export const APE_COIN_STAKING_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getApeCoinStake",
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
        "internalType": "struct ApeCoinStaking.DashboardStake",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getBakcStakes",
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
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "getMaycStakes",
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
    "inputs": [],
    "name": "getPoolsUI",
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
            "name": "stakedAmount",
            "type": "uint256"
          },
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
            "name": "currentTimeRange",
            "type": "tuple"
          }
        ],
        "internalType": "struct ApeCoinStaking.PoolUI",
        "name": "",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "poolId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stakedAmount",
            "type": "uint256"
          },
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
            "name": "currentTimeRange",
            "type": "tuple"
          }
        ],
        "internalType": "struct ApeCoinStaking.PoolUI",
        "name": "",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "poolId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stakedAmount",
            "type": "uint256"
          },
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
            "name": "currentTimeRange",
            "type": "tuple"
          }
        ],
        "internalType": "struct ApeCoinStaking.PoolUI",
        "name": "",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "poolId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "stakedAmount",
            "type": "uint256"
          },
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
            "name": "currentTimeRange",
            "type": "tuple"
          }
        ],
        "internalType": "struct ApeCoinStaking.PoolUI",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export const NFT_ABI = [
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

export const MAYC_ABI = [
  { 
    "inputs": [
      {
        "internalType": "uint8",
        "name": "serumType", 
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "apeId",
        "type": "uint256"
      }
    ],
    "name": "hasApeBeenMutatedWithType",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "apeId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "serumTypeId",
        "type": "uint8"
      }
    ],
    "name": "getMutantIdForApeAndSerumCombination",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]