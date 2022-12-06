import React from "react";
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
import { ApeStatBarProps } from "./ApeStatBar.types";
import { getPrettyValue, round } from "../../utils/formatters";

const STAKING_LIVE_TIMESTAMP_APPROX = 1670308437;

const goerliProvider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

const goerliMulticall = new Multicall({ ethersProvider: goerliProvider, tryAggregate: true });

const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

const formatAmount = (num = "0", percision = 4) => {
  if (Number(num) < 0.0001 && Number(num) > 0) {
    return '< 0.0001'
  }
  return getPrettyValue(parseFloat(round(num, percision)))
}

const references: string[] = [
  'getApeCoinStakeCall',
  'getBaycStakesCall',
  'getMaycStakesCall',
  'getBakcStakesCall',
]

const methodNames: string[] = [
  'getApeCoinStake',
  'getBaycStakes',
  'getMaycStakes',
  'getBakcStakes',
]

const poolTitle: string[] = [
  'APE',
  'APE/BAYC',
  'APE/MAYC',
  'APE/BAKC'
]

const ApeStatBar = ({ theme, tokenId, stakersAddress, poolId = '0', isTestnet = false }: ApeStatBarProps) => {
  const [stakedAmount, setStakedAmount] = React.useState<undefined|string>(undefined);
  const [stakeCap, setStakeCap] = React.useState<undefined|string>(undefined);
  const [unclaimedApeCoin, setUnclaimedApeCoin] = React.useState<undefined|string>(undefined);
  const [rewards24hr, setRewards24hr] = React.useState<undefined|string>(undefined)
  const [ownerOf, setOwnerOf] = React.useState<undefined|string>(undefined)

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
      const result = isTestnet ? await goerliMulticall.call(nftCallContext) : await multicall.call(nftCallContext)
      const ownersAddress = result?.results?.NFTContract?.callsReturnContext[0]?.returnValues[0]
      setOwnerOf(ownersAddress)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
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
      const result = isTestnet ? await goerliMulticall.call(stakingCallContext) : await multicall.call(stakingCallContext)
      let id = !tokenId ? "0" : String(tokenId)
      const tokenIdHex = ethers.utils.hexlify(Number(id))
      const returnedStakes = result?.results?.ApeCoinStaking?.callsReturnContext[0]?.returnValues;
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

  React.useEffect(() => {
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
        <ApeCoinLogo />
        <div style={{display: "grid", gap: ".25rem"}}>
          <div style={{display: 'flex', alignItems: "baseline",}}>
            <div style={{width: "max-content"}}>$APE Staked</div>
            <div style={{fontSize: theme?.subTitleFontSize ? theme?.subTitleFontSize : "60%"}}>
              &nbsp;{poolTitle[Number(poolId)]}
            </div>
          </div>
          {/* --- remove section when mainnetlive */}
            {!isTestnet && new Date().getTime() / 1000 < STAKING_LIVE_TIMESTAMP_APPROX ?
              <div style={{fontSize: ".85rem"}}>*Stats live upon deployment*</div>
            :
            // ----
            !unclaimedApeCoin || !rewards24hr || !stakedAmount || !stakeCap ?
              <Skeleton 
                height={theme?.fontSize} 
                backgroundColor={theme?.skeletonBackgroundColor} 
              />
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
            {/* --- remove section when mainnetlive */}
            {!isTestnet && new Date().getTime() / 1000 < STAKING_LIVE_TIMESTAMP_APPROX ?
              <div>-</div>
            :
            // ---
            !unclaimedApeCoin || !rewards24hr || !stakedAmount || !stakeCap ?
              <Skeleton 
                height={theme?.rateFontSize ? theme?.rateFontSize : ".6rem"} 
                backgroundColor={theme?.skeletonBackgroundColor} 
              />
              :
              <div>{formatAmount(rewards24hr)}</div>
            }
          </div>
        </div>
      </div>
      <div style={{display: "grid", gap: ".25rem",}}>
        <div>Unclaimed $APE</div>
        {/* --- remove section when mainnetlive */}
        {!isTestnet && new Date().getTime() / 1000 < STAKING_LIVE_TIMESTAMP_APPROX ?
          <div className='ape-stat-bar-unclaimed'>-</div>
        :
        // ---
        !unclaimedApeCoin || !rewards24hr || !stakedAmount || !stakeCap ?
          <Skeleton 
            height={theme?.fontSize} 
            backgroundColor={theme?.skeletonBackgroundColor} 
          />
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

export default ApeStatBar;