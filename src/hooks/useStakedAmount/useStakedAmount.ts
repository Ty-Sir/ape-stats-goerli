import React from "react";
import { Multicall } from 'ethereum-multicall';
import { BigNumber, ethers } from 'ethers';
import { APE_COIN_STAKING_ABI, NFT_ABI } from "../../constants/abi";
import { 
  APE_COIN_STAKING_GOERLI, 
  APE_COIN_STAKING_MAINNET,
  NFT_CONTRACTS_GOERLI,
  NFT_CONTRACTS
} from "../../constants/addresses";

const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

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

const useStakedAmount = (isTestnet: Boolean = true, poolId: String, tokenId?: String, stakersAddress?: String) => {
  const [stakedAmount, setStakedAmount] = React.useState<undefined|string>(undefined);
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
      const result = await multicall.call(nftCallContext)
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
      const result = await multicall.call(stakingCallContext)
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
      setStakedAmount(ethers.utils.formatEther(weiStakedAmount))
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if(!stakedAmount) {
      if(poolId && ((String(poolId) !== "0" && ownerOf) || (String(poolId) === "0" && stakersAddress))){
        handleMulitcall();
      }
    }
  }, [stakedAmount,  ownerOf, stakersAddress])

  return { stakedAmount }
}

export default useStakedAmount;