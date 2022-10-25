import React, { useState, useEffect } from "react";
import { ApeCoinLogo } from "../ApeCoinLogo"
import { ExternalLinkIcon } from "../ExternalLinkIcon"
import { Multicall } from 'ethereum-multicall';
import { BigNumber, ethers } from 'ethers';
import { Skeleton } from "../Skeleton";
import '../../styles.css';
import { APE_COIN_STAKING_ABI, NFT_ABI } from "../../constants/abi";
import { 
  APE_COIN_STAKING_GOERLI, 
  APE_COIN_STAKING_MAINNET,
  NFT_CONTRACTS_GOERLI,
  NFT_CONTRACTS
} from "../../constants/addresses";

const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

const references = [
  'getApeCoinStakeCall',
  'getBaycStakesCall',
  'getMaycStakesCall',
  'getBakcStakesCall',
]

const methodNames = [
  'getApeCoinStake',
  'getBaycStakes',
  'getMaycStakes',
  'getBakcStakes',
]

export const ApeStatBar = ({ theme, tokenId, stakersAddress, poolId = 0, isTestnet = true }) => {
  const [stakedAmount, setStakedAmount] = useState(undefined);
  const [stakeCap, setStakeCap] = useState(undefined);
  const [unclaimedApeCoin, setUnclaimedApeCoin] = useState(undefined);
  const [rewards24hr, setRewards24hr] = useState(undefined)
  const [ownerOf, setOwnerOf] = useState(undefined)

  const nftCallContext = [
    {
      reference: 'NFTContract',
      contractAddress: isTestnet ? NFT_CONTRACTS_GOERLI[(Number(poolId))] : NFT_CONTRACTS[(Number(poolId))],
      abi: NFT_ABI,
      calls: [
        { 
          reference: 'ownerOfCall', 
          methodName: 'ownerOf', 
          methodParameters: [tokenId] 
        },
    ]
    },
  ]

  const handleOwnerOf = async () => {
    try {
      const result = await multicall.call(nftCallContext)
      const ownersAddress = result?.results?.NFTContract?.callsReturnContext[0]?.returnValues[0]
      setOwnerOf(ownersAddress)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(poolId && String(poolId) !== '0' && !ownerOf && tokenId){
      handleOwnerOf()
    }
  }, [poolId, tokenId, ownerOf])
  
  const stakingCallContext = [
    {
      reference: 'ApeCoinStaking',
      contractAddress: isTestnet ? APE_COIN_STAKING_GOERLI : APE_COIN_STAKING_MAINNET,
      abi: APE_COIN_STAKING_ABI,
      calls: [
        { 
          reference: references[poolId && Number(poolId)], 
          methodName: methodNames[poolId && Number(poolId)], 
          methodParameters: [poolId && String(poolId) !== '0' ? ownerOf : stakersAddress] 
        },
        { 
          reference: 'getPoolsUICall', 
          methodName: 'getPoolsUI', 
          methodParameters: [] 
        },
    ]
    },
  ];

  const handleMulitcall = async () => {
    try {
      const result = await multicall.call(stakingCallContext)
      console.log(result)
      let id = !tokenId ? "0" : String(tokenId)
      const tokenIdHex = ethers.utils.hexlify(Number(id))
      const returnedStakes = result?.results?.ApeCoinStaking?.callsReturnContext[0]?.returnValues;
      console.log(returnedStakes)
      const stakeStruct = String(poolId) !== '0' ? returnedStakes.find(stake => stake[1]?.hex === tokenIdHex) : returnedStakes;
      let poolCapWeiAmount = "0";
      if(String(poolId) !== '0'){
        //nft staking cap
        poolCapWeiAmount = String(BigNumber.from(result?.results?.ApeCoinStaking?.callsReturnContext[1]?.returnValues[Number(poolId)][2][3]?.hex))
        poolCapWeiAmount = ethers.utils.formatEther(poolCapWeiAmount)
      }
      
      const weiStakedAmount = String(stakeStruct[2]?.hex);
      const unclaimedWeiAmount = String(stakeStruct[3]?.hex);
      const rewards = String(stakeStruct[4]?.hex);
      setStakedAmount(ethers.utils.formatEther(weiStakedAmount))
      setStakeCap(poolCapWeiAmount)
      setUnclaimedApeCoin(ethers.utils.formatEther(unclaimedWeiAmount))
      setRewards24hr(ethers.utils.formatEther(rewards))
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if(!stakedAmount && 
      !stakeCap && 
      !unclaimedApeCoin &&
      !rewards24hr
    ) {
      if(poolId && ((String(poolId) !== "0" && ownerOf) || (String(poolId) === "0" && stakersAddress))){

        handleMulitcall();
      }
    }
  }, [stakedAmount, stakeCap, rewards24hr, unclaimedApeCoin, ownerOf, poolId, stakersAddress])
  
  return(
    <div
      style={{
        backgroundColor: theme?.backgroundColor ? theme?.backgroundColor : "white",
        borderRadius: theme?.borderRadius ? theme?.borderRadius : "5px",
        padding: theme?.padding ? theme?.padding : "1.125rem 2rem",
        color: theme?.color ? theme?.color : "black",
        fontFamily: theme?.fontFamily ? theme?.fontFamily : "sans-serif",
        fontWeight: theme?.fontWeight ? theme?.fontWeight : "bold",
        boxShadow: theme?.boxShadow ? theme?.boxShadow : "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        justifyContent: "space-between",
        minWidth: "fit-content",
        gap: "1rem",
        ...theme
      }}
      className='ape-stat-bar-display'
    >
      <div 
        style={{
          gap: ".75rem", 
          alignItems: "center"
        }}
        className='ape-stat-bar-display'
      >
        <ApeCoinLogo className='ape-stat-bar-ape-coin-logo' />
        <div style={{display: "grid", gap: ".25rem"}}>
          <div>$APE Staked</div>
          {!stakedAmount || !stakeCap ?
            <Skeleton />
            :
            <div
              style={{
                color: theme?.statColor ? theme?.statColor : 'limegreen',
                animation: 'fadeIn .75s'
              }}
            >
              <span>{formatAmount(stakedAmount)}</span>
               {
                poolId && String(poolId) !== "0" ?
                  <span>
                    {` / ${formatAmount(stakeCap)}`}
                  </span>
                  :
                  null
                }
            </div>
          }
          <div 
            style={{
              fontSize: theme?.rateFontSize ? theme?.rateFontSize : "60%",
              display: 'flex',
              gap: ".2rem",
            }}
            className='ape-stat-bar-rewards'
          >
            <div>$APE/24hr:</div>
            {rewards24hr ?
                <div>{formatAmount(rewards24hr)}</div>
              :
                <Skeleton height="100%" />
            }
          </div>
        </div>
      </div>
      <div style={{display: "grid", gap: ".25rem"}}>
        <div>Unclaimed $APE</div>
        {!unclaimedApeCoin ?
          <Skeleton />
          :
          <div
            style={{
              color: theme?.statColor ? theme?.statColor : 'limegreen',
              animation: 'fadeIn .75s',
            }}
            className='ape-stat-bar-unclaimed'
          >
            {formatAmount(unclaimedApeCoin)}
          </div>
        }
        <a
          style={{ 
            cursor: "pointer", 
            color: "inherit", 
            textDecoration: "none", 
            width: "fit-content",
            justifySelf: "end",
        }}
          href="https://apestake.io/"
          target={"_blank"}
          rel="noopenner noreferrer"
        >
          <div
            style={{
              fontSize: theme?.linkFontSize ? theme?.linkFontSize : "60%",
              display: "flex",
              gap: ".25rem",
            }}
          >
            <span>Manage</span>
            <ExternalLinkIcon />
          </div>
        </a>
      </div>
    </div>
  )
}