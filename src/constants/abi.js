export const APE_COIN_STAKING_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getBaycStakes",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "poolId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deposited",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "unclaimed",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewards24hr",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "mainTokenId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "mainTypePoolId",
                "type": "uint256"
              }
            ],
            "internalType": "struct ApeCoinStaking.DashboardPair",
            "name": "pair",
            "type": "tuple"
          }
        ],
        "internalType": "struct ApeCoinStaking.DashboardStake[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_poolId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getTimeRangeBy",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "startTimestampHour",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endTimestampHour",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rewardsPerHour",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "capPerPosition",
            "type": "uint256"
          }
        ],
        "internalType": "struct ApeCoinStaking.TimeRange",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const BAYC_NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
