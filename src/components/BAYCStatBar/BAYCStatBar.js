import React, { useState, useEffect } from "react";
import { ApeCoinLogo } from "../ApeCoinLogo"
import { ExternalLinkIcon } from "../ExternalLinkIcon"
import { Multicall } from 'ethereum-multicall';
import { BigNumber, ethers } from 'ethers';
import { Skeleton } from "../Skeleton";
import '../../styles.css';
import { APE_COIN_STAKING_ABI, BAYC_NFT_ABI } from "../../constants/abi";

const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

export const BAYCStatBar = ({ theme, tokenId }) => {
  const [ownerOf, setOwnerOf] = useState(undefined);
  const [stakedAmount, setStakedAmount] = useState(undefined);
  const [stakeCap, setStakeCap] = useState(undefined);
  const [unclaimedApeCoin, setUnclaimedApeCoin] = useState(undefined);
  const [rewards24hr, setRewards24hr] = useState(undefined)
  
  const stakingCallContext = [
    {
      reference: 'ApeCoinStaking',
      contractAddress: '0x831e0c7A89Dbc52a1911b78ebf4ab905354C96Ce',
      abi: APE_COIN_STAKING_ABI,
      calls: [
        { 
          reference: 'getBaycStakesCall', 
          methodName: 'getBaycStakes', 
          methodParameters: [ownerOf] 
        },
        { 
          reference: 'getTimeRangeByCall', 
          methodName: 'getTimeRangeBy', 
          methodParameters: ["1", '1'] 
        },
    ]
    },
  ];

  const nftCallContext = [
    {
      reference: 'BAYCContract',
      contractAddress: '0xF40299b626ef6E197F5d9DE9315076CAB788B6Ef',
      abi: BAYC_NFT_ABI,
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
      setOwnerOf(result?.results?.BAYCContract?.callsReturnContext[0]?.returnValues[0])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(!ownerOf && tokenId) handleOwnerOf()
  }, [tokenId, ownerOf])
  

  const handleMulitcall = async () => {
    try {
      const result = await multicall.call(stakingCallContext)
      const tokenIdHex = ethers.utils.hexlify(tokenId)
      const returnedStakes = result?.results?.ApeCoinStaking?.callsReturnContext[0]?.returnValues;
      const stakeStruct = returnedStakes.find(stake => stake[1]?.hex === tokenIdHex);
      const maxWeiStakeAmount = String(BigNumber.from(result?.results?.ApeCoinStaking?.callsReturnContext[1]?.returnValues[3]?.hex))
      const weiStakedAmount = String(BigNumber.from(stakeStruct[2]?.hex));
      const unclaimedWeiAmount = String(BigNumber.from(stakeStruct[3]?.hex));
      const rewards = String(BigNumber.from(stakeStruct[4]?.hex));
      console.log(rewards)
      setStakedAmount(ethers.utils.formatEther(weiStakedAmount))
      setStakeCap(ethers.utils.formatEther(maxWeiStakeAmount))
      setUnclaimedApeCoin(ethers.utils.formatEther(unclaimedWeiAmount))
      setRewards24hr(ethers.utils.formatEther(rewards))
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if(ownerOf && 
      !stakedAmount && 
      !stakeCap && 
      !unclaimedApeCoin &&
      !rewards24hr &&
      tokenId !== undefined
    ) {
      handleMulitcall();
    }
  }, [stakedAmount, stakeCap, ownerOf, rewards24hr, unclaimedApeCoin, tokenId])
  
  
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
        display: "flex",
        justifyContent: "space-between",
        minWidth: "fit-content",
        gap: "1rem",
        ...theme
      }}
    >
      <div style={{display: "flex", gap: ".75rem", alignItems: "center"}}>
        <ApeCoinLogo style={{width: "50px"}} />
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
              {formatAmount(stakedAmount) +" / "+ formatAmount(stakeCap)}
            </div>
          }
          <div 
            style={{
              fontSize: theme?.rateFontSize ? theme?.rateFontSize : "60%",
              display: 'flex',
              gap: ".2rem"
            }}
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
              textAlign: 'end'
            }}
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
          href="https://solidity.io/"
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