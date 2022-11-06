import React from "react";
import { Multicall } from 'ethereum-multicall';
import { ethers } from 'ethers';
import '../../styles.css';
import { MAYC_ABI } from "../../constants/abi";
import { MAYC } from "../../constants/addresses";
import { UnusedSerumsProps } from "./UnusedSerums.types";
import { M1Serum, M2Serum, MegaSerum } from "../SerumImages";

const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7");

const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

const serumTypes: string[] = [
  '0',
  '1',
  '69'
]

const serumTypeString: string[] = [
  "M1 Mutant Serum",
  "M2 Mutant Serum",
  "Mega Mutant Serum",
]

const serumImages: any[] = [
  <M1Serum />,
  <M2Serum />,
  <MegaSerum />,
]

const UnusedSerums = ({ theme, tokenId }: UnusedSerumsProps) => {
  const [items, setItems] = React.useState<undefined|Array<{hasUsed: boolean, type: string, image: any}>>(undefined);
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);
  
  const unusedItemsCall = [
    {
      reference: 'MutantApeYachtClub',
      contractAddress: MAYC,
      abi: MAYC_ABI,
      calls: [
        { 
          reference: "hasApeBeenMutatedWithTypeCall0", 
          methodName: "hasApeBeenMutatedWithType", 
          methodParameters: [serumTypes[0], String(tokenId)] 
        },
        { 
          reference: "hasApeBeenMutatedWithTypeCall1", 
          methodName: "hasApeBeenMutatedWithType", 
          methodParameters: [serumTypes[1], String(tokenId)] 
        },
        { 
          reference: "hasApeBeenMutatedWithTypeCall69", 
          methodName: "hasApeBeenMutatedWithType", 
          methodParameters: [serumTypes[2], String(tokenId)] 
        },
    ]
    },
  ];

  const handleMulitcall = async () => {
    try {
      const result = await multicall.call(unusedItemsCall)
      let itemArray = [];
      for (let i = 0; i < 3; i++) {
        const hasUsed = result.results.MutantApeYachtClub.callsReturnContext[i].returnValues[0];
        itemArray.push({
          hasUsed: hasUsed,
          type: serumTypeString[i],
          image: serumImages[i]
        });
      }
      setItems(itemArray)
      setIsLoading(false);
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if(!items && tokenId) {
      handleMulitcall();    
    }
  }, [items, tokenId])

  //theme exceptions:
  //-dividerColor
  
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
        minWidth: "fit-content",
        display: "block",
        ...theme
      }}
      className='ape-stat-bar-display'
    >
      <div style={{paddingBottom: "1rem"}}>
        Unused Serums ({items && !isLoading ? String(items.filter(i => !i.hasUsed).length) : "-"})
      </div>

      {isLoading && (
        <div 
          style={{
            padding: ".5rem 0"
          }}
        >
          <div 
            style={{
              display: "flex"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <div 
                style={{
                  borderRadius: "10px",
                  width: "50px",
                  height: "50px",
                  marginRight: ".5rem", 
                  backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
                }}
                >
              </div>
              <div 
                style={{
                  borderRadius: "5px",
                  width: "150px",
                  height: "20px",
                  backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
                }}
              >
              </div>
            </div>
          </div>
        </div>
      )}

      {items && items.filter(i => !i.hasUsed).length > 0 && !isLoading && (
        items.filter(i => !i.hasUsed).map((i, idx) => (
          <div key={idx}>
            <div 
              style={{
                padding: ".5rem 0"
              }}
            >
              <div 
                style={{
                  display: "flex"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <div style={{paddingRight: ".5rem"}}>
                    {i.image}
                  </div>
                  {i.type}
                </div>
              </div>
            </div>
            {idx + 1 !== items.filter(i => !i.hasUsed).length && (
              <div style={{height: "1px", background: theme?.dividerColor ? theme?.dividerColor : "#DDDBDD"}} />
            )}
          </div>
        ))
      )}

      {items && items.filter(i => !i.hasUsed).length === 0 && !isLoading && (
        <div>All Mutant Serum Used</div>
      )}

    </div>
  )
}

export default UnusedSerums;