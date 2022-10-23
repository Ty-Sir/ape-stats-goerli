import React, { useState, useEffect } from "react";
import { ApeCoinLogo } from "../ApeCoinLogo"
import { ExternalLinkIcon } from "../ExternalLinkIcon"
import { Multicall } from 'ethereum-multicall';
import { BigNumber, ethers } from 'ethers';
import { Skeleton } from "../Skeleton";
import '../../styles.css';

const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount)
}

export const BAYCStatBar = ({ theme, tokenId }) => {
  const [stakedAmount, setStakedAmount] = useState(undefined);
  const [stakeCap, setStakeCap] = useState(undefined);
  
  const contractCallContext = [
    {
      reference: 'ApeCoinStaking',
      contractAddress: '0x831e0c7A89Dbc52a1911b78ebf4ab905354C96Ce',
      abi: [ 
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "nftPosition",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "stakedAmount",
              "type": "uint256"
            },
            {
              "internalType": "int256",
              "name": "rewardsDebt",
              "type": "int256"
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
       ],
      calls: [
        { 
          reference: 'nftPositionCall', 
          methodName: 'nftPosition', 
          methodParameters: ["1", String(tokenId)] 
        },
        { 
          reference: 'getTimeRangeByCall', 
          methodName: 'getTimeRangeBy', 
          methodParameters: ["1", '1'] 
        },
    ]
    },
  ];

  const handleMulitcall = async () => {
    try {
      const result = await multicall.call(contractCallContext)
      const maxWeiStakeAmount = String(BigNumber.from(result?.results?.ApeCoinStaking?.callsReturnContext[1]?.returnValues[3]?.hex))
      const weiStakedAmount = String(BigNumber.from(result?.results?.ApeCoinStaking?.callsReturnContext[0]?.returnValues[0]?.hex));
      setStakedAmount(ethers.utils.formatEther(weiStakedAmount))
      setStakeCap(ethers.utils.formatEther(maxWeiStakeAmount))
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if(!stakedAmount && !stakeCap && tokenId !== undefined) handleMulitcall()
  }, [stakedAmount, stakeCap])
  
  console.log(theme)
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
        </div>
      </div>
      <div style={{display: "grid", gap: ".25rem"}}>
        <div>Token Id</div>
        {!tokenId ?
          <Skeleton />
          :
          <div
            style={{
              color: theme?.statColor ? theme?.statColor : 'limegreen',
              animation: 'fadeIn .75s'
            }}
          >
            {tokenId}
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
              fontSize: theme?.linkFontSize ? theme?.linkFontSize : ".75rem",
              display: "flex",
              gap: ".25rem",
              paddingTop: ".5rem"
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