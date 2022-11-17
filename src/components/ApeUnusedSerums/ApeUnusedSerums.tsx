import React from "react";
import { Multicall } from 'ethereum-multicall';
import { ethers } from 'ethers';
import '../../styles.css';
import { MAYC_ABI } from "../../constants/abi";
import { MAYC } from "../../constants/addresses";
import { ApeUnusedSerumsProps } from "./ApeUnusedSerums.types";
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


const ApeUnusedSerums = ({ theme, tokenId, baseUrl }: ApeUnusedSerumsProps) => {
  const serumLinks: string[] = [
    `https://${baseUrl}/collections/0x22c36bfdcef207f9c0cc941936eff94d4246d14a/tokens/0`,
    `https://${baseUrl}/collections/0x22c36bfdcef207f9c0cc941936eff94d4246d14a/tokens/1`,
    `https://${baseUrl}/collections/0x22c36bfdcef207f9c0cc941936eff94d4246d14a/tokens/69`
  ]
  const [items, setItems] = React.useState<undefined|Array<{hasUsed: boolean, type: string, image: any, link: string}>>(undefined);
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
          image: serumImages[i],
          link: serumLinks[i],
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
        Unused Serums 
        ({items && !isLoading ? String(items.filter(i => !i.hasUsed).length) : "-"})
      </div>

      {isLoading && (
        <div 
          style={{
            padding: ".5rem 0"
          }}
        >
          <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: ".5rem"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <div 
                className="loading-state"
                style={{
                  borderRadius: "10px",
                  width: "50px",
                  height: "50px",
                  marginRight: theme?.imageGap ? theme?.imageGap :  ".5rem", 
                  backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
                }}
              />
              <div 
                className="loading-state"
                style={{
                  borderRadius: "5px",
                  width: "15vw",
                  maxWidth: "150px",
                  height: "20px",
                  backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
                }}
                />
            </div>
            <div
              className="loading-state"
              style={{
                borderRadius: "10px",
                height: "35px",
                width: "15vw",
                maxWidth: "135px",
                backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
              }}
            />
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
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: ".5rem"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <div style={{
                      paddingRight: theme?.imageGap ? theme?.imageGap : ".5rem", 
                      animation: 'fadeIn .75s'
                    }}
                  >
                    {i.image}
                  </div>
                  <div style={{animation: 'fadeIn .75s'}}>
                    <a
                    href={i.link} 
                    target="_blank" 
                    rel="noopenner noreferrer"
                    style={{
                      cursor: "pointer",
                      color: "inherit",
                      textDecoration: "none"
                    }}
                  >
                    {i.type}
                  </a>
                  </div>
                </div>
                <a
                  href={i.link} 
                  target="_blank" 
                  rel="noopenner noreferrer"
                  style={{
                    cursor: "pointer",
                    color: "inherit",
                    textDecoration: "none"
                  }}
                >
                  <div
                    style={{
                      textTransform: "uppercase",
                      color: theme?.buyButtonColor ? theme?.buyButtonColor : "rgb(85, 189, 82)",
                      border: "1px solid",
                      borderColor: theme?.buyButtonColor ? theme?.buyButtonColor : "rgb(85, 189, 82)",
                      padding: ".5rem .75rem",
                      fontSize: "80%",
                      borderRadius: "10px",
                      textAlign: "center"
                    }}
                  >
                    Eligible to buy
                  </div>
                </a>
              </div>
            </div>
            {idx + 1 !== items.filter(i => !i.hasUsed).length && (
              <div 
                style={{
                  height: "1px", 
                  background: theme?.dividerColor ? theme?.dividerColor : "rgb(55, 59, 66)",
                  margin: theme?.itemGap ? `${theme?.itemGap} 0` : ".5rem 0"
                }} 
              />
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

export default ApeUnusedSerums;