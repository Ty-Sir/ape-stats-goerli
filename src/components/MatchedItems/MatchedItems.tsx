import React from "react";
import { Multicall } from 'ethereum-multicall';
import { ethers } from 'ethers';
import '../../styles.css';
import { MAYC_ABI, NFT_ABI } from "../../constants/abi";
import { MAYC, NFT_CONTRACTS, OTHERSIDE } from "../../constants/addresses";
import { MatchedItemsProps } from "./MatchedItems.types";
import { KennelIcon, MutantIcon, OthersideIcon } from "../CollectionIcons";
import { getEllipsisTxt } from "../../utils/formatters";

const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7");

const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

const serumTypes: string[] = [
  '0',
  '1',
  '69'
]

const getMutantURI = (tokenId: string) => {
  return `https://boredapeyachtclub.com/api/mutants/${tokenId}`
}

const getOthersideURI = (tokenId: string) => {
  return `https://api.otherside.xyz/lands/${tokenId}`
}

const getKennelURI = (tokenId: string) => {
  return `https://gateway.ipfs.io/ipfs/QmTDcCdt3yb6mZitzWBmQr65AW6Wska295Dg9nbEYpSUDR/${tokenId}`
}

const tokenURIs: ((tokenId: string) => string)[] = [
  getMutantURI,
  getKennelURI,
  getOthersideURI,
]

const linkReference: string[] = [
  'mutant',
  'kennel',
  'otherside'
]

interface ITokenTypeString<TValue> {
  [id: string]: TValue;
}

const tokenTypeString: ITokenTypeString<string> = {
  mutant: "MAYC",
  otherside: "Otherside",
  kennel: "BAKC"
}

interface ITokenTypeIcon<Icon> {
  [id: string]: Icon;
}

const tokenTypeIcon: ITokenTypeIcon<any> = {
  mutant: <MutantIcon />,
  otherside: <OthersideIcon />,
  kennel: <KennelIcon />
}

const MatchedItems = ({ theme, tokenId }: MatchedItemsProps) => {
  const [hasMutated, setHasMutated] = React.useState<undefined|Array<{reference: string, methodName: string, methodParameters: Array<string>}>>(undefined);
  const [mutantTokenIds, setMutantTokenIds] = React.useState<undefined|Array<string>>(undefined);
  const [metadata, setMetadata] = React.useState<undefined|Array<any>|Array<{owner: string, tokenId: string, type: string, url: string, loaded: boolean, isError: boolean}>>(undefined);
  const [imageLinks, setImageLinks] = React.useState<undefined|Array<{url: string, tokenId: string, type: string}>>(undefined);
  const [owners, setOwners] = React.useState<undefined|Array<{owner: string, tokenId: string, type: string}>>(undefined)
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);
  
  const hasMutatedCall = [
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

  const handleHasMutatedCall = async () => {
    try {
      const result = await multicall.call(hasMutatedCall)
      let hasMutatedArray = [];
      for (let i = 0; i < 3; i++) {
        const hasUsed = result.results.MutantApeYachtClub.callsReturnContext[i].returnValues[0];
        if(hasUsed){
          hasMutatedArray.push({
            reference: `getMutantIdForApeAndSerumCombinationCall${i}`,
            methodName: "getMutantIdForApeAndSerumCombination",
            methodParameters: [String(tokenId), String(serumTypes[i])]
          });
        }
      }
      setHasMutated(hasMutatedArray)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if(!hasMutated && tokenId) {
      handleHasMutatedCall();    
    }
  }, [hasMutated, tokenId])

  const getMutantTokenIds = [
    {
      reference: 'MutantApeYachtClub',
      contractAddress: MAYC,
      abi: MAYC_ABI,
      calls: hasMutated || []
    },
  ];

  const handleGetMutantTokenIds = async () => {
    try {
      const mutantData = await multicall.call(getMutantTokenIds)
      let mutantIds = []
      const length = mutantData.results.MutantApeYachtClub.callsReturnContext.length;
      for (let i = 0; i < length; i++) {
        const id = mutantData.results.MutantApeYachtClub.callsReturnContext[i].returnValues[0].hex
        mutantIds.push(String(Number(id)))
      }
      setMutantTokenIds(mutantIds)
    } catch (error) {
      console.log(error)
    }
  }
  
  React.useEffect(() => {
    if(hasMutated && hasMutated.length > 0 && tokenId && !mutantTokenIds) {
      handleGetMutantTokenIds(); //will only call if the mutants exist
    } else if (hasMutated && hasMutated.length === 0 && tokenId && !mutantTokenIds){
      setMutantTokenIds([])
    }
  }, [hasMutated, tokenId, mutantTokenIds])

  const getOwners = async () => {
    try {
      let getOwnersCall = []
      if(mutantTokenIds && mutantTokenIds?.length > 0){
        const mutantCalls = mutantTokenIds.map((i, idx) => (
          { 
            reference: `ownerOfCall${idx}`, 
            methodName: "ownerOf", 
            methodParameters: [String(i)] 
          }
        ))
        getOwnersCall = [
          {
            reference: 'Mutant',
            contractAddress: NFT_CONTRACTS[2],
            abi: NFT_ABI,
            calls: mutantCalls
          },
          {
            reference: 'KennelClub',
            contractAddress: NFT_CONTRACTS[3],
            abi: NFT_ABI,
            calls: [
              { 
                reference: "ownerOfCall", 
                methodName: "ownerOf", 
                methodParameters: [String(tokenId)] 
              },
            ]
          },
          {
            reference: 'Otherside',
            contractAddress: OTHERSIDE,
            abi: NFT_ABI,
            calls: [
              { 
                reference: "ownerOfCall", 
                methodName: "ownerOf", 
                methodParameters: [String(tokenId)] 
              },
            ]
          },
        ];
      } else {        
        getOwnersCall = [
          {
            reference: 'KennelClub',
            contractAddress: NFT_CONTRACTS[3],
            abi: NFT_ABI,
            calls: [
              { 
                reference: "ownerOfCall", 
                methodName: "ownerOf", 
                methodParameters: [String(tokenId)] 
              },
            ]
          },
          {
            reference: 'Otherside',
            contractAddress: OTHERSIDE,
            abi: NFT_ABI,
            calls: [
              { 
                reference: "ownerOfCall", 
                methodName: "ownerOf", 
                methodParameters: [String(tokenId)] 
              },
            ]
          },
        ];
      }
      const ownerData = await multicall.call(getOwnersCall)
      const kennelOwner = {
        owner: ownerData.results.KennelClub.callsReturnContext[0].returnValues[0],
        tokenId: String(tokenId),
        type: "kennel"
      }
      const othersideOwner = {
        owner: ownerData.results.Otherside.callsReturnContext[0].returnValues[0],
        tokenId: String(tokenId),
        type: "otherside",
      }
      let mutantOwner: Array<undefined>|Array<{owner: string, tokenId: string, type: string}> = []
      if(mutantTokenIds && mutantTokenIds?.length > 0){
        const ownerOf = mutantTokenIds.map((i, idx) => (
          { 
            owner: ownerData.results.Mutant.callsReturnContext[idx].returnValues[0], 
            tokenId: String(i), 
            type: "mutant"
          }
        ))
        mutantOwner = ownerOf
        setOwners([
          kennelOwner,
          othersideOwner,
          ...mutantOwner
        ]);
      } else {
        setOwners([
          kennelOwner,
          othersideOwner
        ]);
      }
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    if(mutantTokenIds && tokenId && !owners) {
      getOwners();
    }
  }, [owners, tokenId, mutantTokenIds])

  const getImageLinks = async (i: number, id: string) => {
      const res = await fetch(tokenURIs[i](String(id)))
      const data = await res.json();
      let imageURL = data.image;
      if(imageURL.includes("ipfs://")){
        if(i === 0){
          imageURL = imageURL.replace("ipfs://", "https://gateway.ipfs.io/ipfs/")
        }
        if(i === 1){
          imageURL = imageURL.replace("ipfs://", "https://ipfs.io/ipfs/")
        }
      }
      return {
        url: imageURL,
        tokenId: String(id),
        type: linkReference[i]
      };
  }

  const getImages = async () => {
    let images = [];
    if(mutantTokenIds && mutantTokenIds?.length > 0){
      const mutantGetters = mutantTokenIds.map(i => getImageLinks(0, String(i)))
      images = await Promise.all([
        getImageLinks(1, String(tokenId)),
        getImageLinks(2, String(tokenId)),
        ...mutantGetters,
      ])
    } else {
      images = await Promise.all([
        getImageLinks(1, String(tokenId)),
        getImageLinks(2, String(tokenId)),
      ])
    }    
    setImageLinks(images)
  }

  React.useEffect(() => {
    if(mutantTokenIds && tokenId && !imageLinks) {
      getImages();
    }
  }, [imageLinks, tokenId, mutantTokenIds])

  const combineData = () => {
    let combinedData = [];
    if(owners){
      for (let i = 0; i < owners?.length; i++) {
        combinedData.push({
          ...owners[i], 
          loaded: false,
          isError: false,
          ...(imageLinks?.find((itmInner) => itmInner.tokenId === owners[i].tokenId && itmInner.type === owners[i].type))}
         )
      }
    }
    setMetadata(combinedData)
    setIsLoading(false);
  }

  React.useEffect(() => {
    if(tokenId && imageLinks && owners && !metadata) {
      combineData();
    }
  }, [tokenId, imageLinks, owners, metadata])

  const handleImageLoaded = (type: string, tokenId: string) => {
    setMetadata(prevMetadata => {
      const newMetadata = prevMetadata?.map((i) => {
        if(i.type === type && i.tokenId === tokenId){
          return {...i, loaded: true}
        }
          return i
      })
      return newMetadata
    })
  }

  const handleImageError = (type: string, tokenId: string) => {
    setMetadata(prevMetadata => {
      const newMetadata = prevMetadata?.map((i) => {
        if(i.type === type && i.tokenId === tokenId){
          return {...i, loaded: true, isError: true}
        }
          return i
      })
      return newMetadata
    })
  }

  //ownedByColor
  //dividerColor
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
        Matched Items
        ({metadata && !isLoading ? String(metadata.filter(i => i.owner !== undefined).length) : "-"})
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
              gap: "1rem"
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
                  marginRight: ".5rem", 
                  backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
                }}
              >
              </div>
              <div 
                className="loading-state"
                style={{
                  borderRadius: "5px",
                  width: "150px",
                  height: "20px",
                  backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
                }}
              />
            </div>
            <div 
              className="loading-state"
              style={{
                borderRadius: "5px",
                width: "100px",
                height: "20px",
                backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
              }}
            />
          </div>
        </div>
      )}

      {metadata && !isLoading && (
        metadata.filter(i => i.owner !== undefined).map((i, idx) => (
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
                  gap: "1rem"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <img 
                      src={i.url}
                      alt='token image'
                      width={"50px"}
                      height={"50px"}
                      style={{
                        borderRadius: "10px",
                        display: i.loaded && !i.isError ? "flex" : "none",
                        animation: 'fadeIn .75s'
                      }}
                      loading='eager'
                      onLoad={() => handleImageLoaded(i.type, i.tokenId)}
                      onError={() => handleImageError(i.type, i.tokenId)}
                    />
                    {!i.loaded ? 
                      <div className="loading-state">
                        {tokenTypeIcon[i.type]}
                      </div>
                      :
                      null
                    }
                    {i.isError ? 
                      <>
                        {tokenTypeIcon[i.type]}
                        <div style={{fontSize: "7px", maxWidth: "50px", textAlign: "center"}}>IPFS Timeout</div>
                      </>
                      :
                      null
                    }
                  </div>
                  <div
                    style={{
                      paddingLeft: ".5rem",
                      animation: 'fadeIn .75s'
                    }}
                  >
                    {`${tokenTypeString[i.type]} #${i.tokenId}`}
                  </div>
                </div>
                <span style={{
                  fontSize: theme?.fontSize ? theme?.fontSize : "80%",
                  animation: 'fadeIn .75s',
                  textAlign: "right"
                }}
                >
                  <span
                    style={{
                      color: theme?.ownedByColor ? theme?.ownedByColor : "rgb(140, 149, 156)"
                    }}
                  >
                    Owned by {" "}
                  </span>
                  <a 
                    href={`https://etherscan.io/address/${i.owner}`} 
                    target="_blank" 
                    rel="noopenner noreferrer"
                    style={{
                      cursor: "pointer",
                      color: "inherit",
                      textDecoration: "none"
                    }}
                  >
                    <span>
                      {getEllipsisTxt(i.owner)}
                    </span>
                  </a>
                </span>
              </div>
            </div>
            {idx + 1 !== metadata.filter(i => i.owner !== undefined).length && (
              <div style={{height: "1px", background: theme?.dividerColor ? theme?.dividerColor : "rgb(55, 59, 66)"}} />
            )}
          </div>
        ))
      )}

      {metadata && metadata.filter(i => i.owner !== undefined).length === 0 && !isLoading && (
        <div>No Matched Items Found</div>
      )}

    </div>
  )
}

export default MatchedItems;