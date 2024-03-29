import React from "react";
import { Multicall } from 'ethereum-multicall';
import { ethers } from 'ethers';
import '../../styles.css';
import { MAYC_ABI, NFT_ABI } from "../../constants/abi";
import { MAYC, NFT_CONTRACTS, OTHERSIDE } from "../../constants/addresses";
import { ApeMatchedItemsProps } from "./ApeMatchedItems.types";
import { BoredApeIcon, KennelIcon, MutantIcon, OthersideIcon } from "../CollectionIcons";
import { getEllipsisTxt } from "../../utils/formatters";

const provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7");

const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

const serumTypes: string[] = [
  '0',
  '1',
  '69'
]

interface ITokenTypeString<TValue> {
  [id: string]: TValue;
}

const tokenTypeString: ITokenTypeString<string> = {
  mutant: "MAYC",
  otherside: "Otherside",
  kennel: "BAKC",
  ape: "BAYC"
}

const collectionType: ITokenTypeString<string> = {
  mutant: "0",
  otherside: "1",
  kennel: "2",
  ape: "3"
}

const apeIdByMegaMutantId: ITokenTypeString<string> = {
  "30000": "8074",
  "30001": "416",
  "30002": "9317",
  "30003": "3287",
  "30004": "4687",
  "30005": "5235",
  "30006": "5840",
}

interface ITokenTypeIcon<Icon> {
  [id: string]: Icon;
}

const tokenTypeIcon: ITokenTypeIcon<any> = {
  mutant: <MutantIcon />,
  otherside: <OthersideIcon />,
  kennel: <KennelIcon />,
  ape: <BoredApeIcon />
}

const maxUrlCallAmount = 5;

const getTokenIdFromMutantId = (mutantId: string) => {
  if (apeIdByMegaMutantId[mutantId] !== undefined) {
    return apeIdByMegaMutantId[mutantId]
  }
  return (Math.floor((Number(mutantId) - 10000) / 2)).toString()
}

//@dev collectionId
//"0": mutant token
//"1": otherside token
//"2": kennel token
//"3": ape token

const ApeMatchedItems = ({ theme, tokenId, baseUrl, collectionId }: ApeMatchedItemsProps) => {
  const marketplaceByType: ITokenTypeString<string> = {
    mutant: `https://${baseUrl}/collections/0x60e4d786628fea6478f785a6d7e704777c86a7c6/tokens/`,
    otherside: `https://${baseUrl}/collections/0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258/tokens/`,
    kennel: `https://${baseUrl}/collections/0xba30e5f9bb24caa003e9f2f0497ad287fdf95623/tokens/`,
    ape: `https://${baseUrl}/collections/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/tokens/`,
  }
  const [hasMutated, setHasMutated] = React.useState<undefined | Array<{ reference: string, methodName: string, methodParameters: Array<string> }>>(undefined);
  const [mutantTokenIds, setMutantTokenIds] = React.useState<undefined | Array<string>>(undefined);
  const [metadata, setMetadata] = React.useState<undefined | Array<any> | Array<{ owner: string, tokenId: string, type: string, url: string, loaded: boolean, isError: boolean, urlCallCount: number }>>(undefined);
  const [isLoading, setIsLoading] = React.useState<Boolean>(true);
  const [isError, setIsError] = React.useState<Boolean>(false);

  React.useEffect(() => {
    if (collectionId === '0' && Number(tokenId) < 10000) {
      setIsError(true);
      setIsLoading(false);
    }
  }, [])


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
        if (hasUsed) {
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
      setIsError(true)
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (collectionId === '0' && Number(tokenId) < 10000) {
      setIsError(true);
      setIsLoading(false);
    } else if (!hasMutated && tokenId && (collectionId === '3' || collectionId === '2' || collectionId === '1')) {
      handleHasMutatedCall();
    }
  }, [hasMutated, tokenId, collectionId])

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
      setIsError(true)
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (collectionId === '0' && Number(tokenId) < 10000) {
      setIsError(true);
      setIsLoading(false);
    } else if (hasMutated && hasMutated.length > 0 && tokenId && !mutantTokenIds && (collectionId === '3' || collectionId === '2' || collectionId === '1')) {
      handleGetMutantTokenIds(); //will only call if the mutants exist
    } else if (hasMutated && hasMutated.length === 0 && tokenId && !mutantTokenIds && (collectionId === '3' || collectionId === '2' || collectionId === '1')) {
      setMutantTokenIds([])
    } else if (tokenId && !mutantTokenIds && collectionId === '0') {
      setMutantTokenIds([String(tokenId)])
    }
  }, [hasMutated, tokenId, mutantTokenIds, collectionId])

  const getMetadata = async () => {
    try {
      const baycAddressString = `tokens=${NFT_CONTRACTS[1]}%3A${collectionId === "0" ? getTokenIdFromMutantId(String(tokenId)) : String(tokenId)}&`
      const bakcAddressString = `tokens=${NFT_CONTRACTS[3]}%3A${collectionId === "0" ? getTokenIdFromMutantId(String(tokenId)) : String(tokenId)}&`
      const othersideAddressString = `tokens=${OTHERSIDE}%3A${collectionId === "0" ? getTokenIdFromMutantId(String(tokenId)) : String(tokenId)}&`

      const mutantAddressString = mutantTokenIds?.map((i, idx) => (
        `tokens=${NFT_CONTRACTS[2]}%3A${String(i)}`
      )) || []

      const combined = (baycAddressString + bakcAddressString + othersideAddressString + mutantAddressString).replace(",", "&")

      const options = { method: 'GET', headers: { accept: '*/*', 'x-api-key': process.env.RESERVOIR_API_KEY || "" } };

      const res = await fetch(`
        https://api.reservoir.tools/tokens/v5?${combined}&sortBy=floorAskPrice&limit=20&includeTopBid=false&includeAttributes=false&includeQuantity=false&includeDynamicPricing=false&normalizeRoyalties=true`
        , options
      )

      const data = await res.json()

      const tokens = data.tokens;

      console.log(tokens)

      let dataToDisplay = [];

      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].token.collection.id.toLowerCase() === NFT_CONTRACTS[1].toLowerCase()) {//bayc
          dataToDisplay.push({
            urlCallCount: 0,
            isError: false,
            loaded: false,
            owner: tokens[i].token.owner,
            type: "ape",
            url: tokens[i].token.image,
            tokenId: tokens[i].token.tokenId,
            listingPrice: tokens[i].market.floorAsk.price === null ?
              "Unlisted"
              :
              `${tokens[i].market.floorAsk.price.amount.decimal.toString()} ${tokens[i].market.floorAsk.price.currency.symbol}`
          })
        }
        if (tokens[i].token.collection.id.toLowerCase() === NFT_CONTRACTS[2].toLowerCase()) {//mayc
          dataToDisplay.push({
            urlCallCount: 0,
            isError: false,
            loaded: false,
            owner: tokens[i].token.owner,
            type: "mutant",
            url: tokens[i].token.image,
            tokenId: tokens[i].token.tokenId,
            listingPrice: tokens[i].market.floorAsk.price === null ?
              "Unlisted"
              :
              `${tokens[i].market.floorAsk.price.amount.decimal.toString()} ${tokens[i].market.floorAsk.price.currency.symbol}`
          })
        }
        if (tokens[i].token.collection.id.toLowerCase() === NFT_CONTRACTS[3].toLowerCase()) {//bakc
          dataToDisplay.push({
            urlCallCount: 0,
            isError: false,
            loaded: false,
            owner: tokens[i].token.owner,
            type: "kennel",
            url: tokens[i].token.image,
            tokenId: tokens[i].token.tokenId,
            listingPrice: tokens[i].market.floorAsk.price === null ?
              "Unlisted"
              :
              `${tokens[i].market.floorAsk.price.amount.decimal.toString()} ${tokens[i].market.floorAsk.price.currency.symbol}`
          })
        }
        if (collectionId !== "0" && tokens[i].token.collection.id.toLowerCase() === OTHERSIDE.toLowerCase()) {//otherside
          dataToDisplay.push({
            urlCallCount: 0,
            isError: false,
            loaded: false,
            owner: tokens[i].token.owner,
            type: "otherside",
            url: tokens[i].token.image,
            tokenId: tokens[i].token.tokenId,
            listingPrice: tokens[i].market.floorAsk.price === null ?
              "Unlisted"
              :
              `${tokens[i].market.floorAsk.price.amount.decimal.toString()} ${tokens[i].market.floorAsk.price.currency.symbol}`
          })
        }
      }
      setMetadata(dataToDisplay)
      setIsLoading(false);
    } catch (error) {
      console.log(error)
      setIsError(true)
      setIsLoading(false);
    }
  }

  React.useEffect(() => {
    if (mutantTokenIds && tokenId && !metadata) {
      getMetadata();
    }
  }, [metadata, tokenId, mutantTokenIds])

  const handleImageLoaded = (type: string, tokenId: string) => {
    setMetadata(prevMetadata => {
      const newMetadata = prevMetadata?.map((i) => {
        if (i.type === type && i.tokenId === tokenId) {
          return { ...i, loaded: true }
        }
        return i
      })
      return newMetadata
    })
  }

  const handleImageError = (type: string, tokenId: string) => {
    setMetadata(prevMetadata => {
      const newMetadata = prevMetadata?.map((i) => {
        if (i.urlCallCount < maxUrlCallAmount) {
          if (i.type === type && i.tokenId === tokenId) {
            const timestamp = (new Date()).getTime();
            return { ...i, url: `${i.url}?_=${timestamp}`, urlCallCount: i.urlCallCount + 1 }
          }
          return i;
        } else {
          if (i.type === type && i.tokenId === tokenId) {
            return { ...i, loaded: true, isError: true }
          }
          return i
        }
      })
      return newMetadata
    })
  }

  return (
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
      <div style={{ paddingBottom: "1rem" }}>
        Matched Items
        ({metadata && !isLoading ? String(metadata.filter(i => i.owner !== undefined).filter(i => collectionType[i.type] !== collectionId).length) : "-"})
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
                  marginRight: theme?.imageGap ? theme?.imageGap : ".5rem",
                  backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
                }}
              >
              </div>
              <div
                className="loading-state"
                style={{
                  borderRadius: "5px",
                  maxWidth: "150px",
                  width: "20vw",
                  height: "20px",
                  backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
                }}
              />
            </div>
            <div
              className="loading-state"
              style={{
                borderRadius: "5px",
                maxWidth: "100px",
                width: "15vw",
                height: "20px",
                backgroundColor: theme?.skeletonBackgroundColor ? theme?.skeletonBackgroundColor : "#DDDBDD"
              }}
            />
          </div>
        </div>
      )}

      {isError && (
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
              {tokenTypeIcon['mutant']}
              <div
                style={{
                  paddingLeft: theme?.imageGap ? theme?.imageGap : ".5rem",
                  animation: 'fadeIn .75s'
                }}
              >
                {collectionId === '0' && Number(tokenId) < 10000 ? "Matched Items unavailable for MAYC 0 - 9,999" : "No Items Found"}
              </div>
            </div>
            <div
              style={{
                color: theme?.ownedByColor ? theme?.ownedByColor : "rgb(140, 149, 156)"
              }}
            >
              -
            </div>
          </div>
        </div>
      )}

      {metadata && !isLoading && (
        metadata
          .filter(i => i.owner !== undefined)
          .filter(i => collectionType[i.type] !== collectionId)
          .map((i, idx) => (
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
                          <div style={{ fontSize: "7px", maxWidth: "50px", textAlign: "center" }}>IPFS Timeout</div>
                        </>
                        :
                        null
                      }
                    </div>
                    <div
                      style={{
                        paddingLeft: theme?.imageGap ? theme?.imageGap : ".5rem",
                        animation: 'fadeIn .75s',
                      }}
                    >
                      <a
                        href={`${marketplaceByType[i.type]}${i.tokenId}`}
                        target="_blank"
                        rel="noopenner noreferrer"
                        style={{
                          cursor: "pointer",
                          color: "inherit",
                          // textDecoration: "none"
                        }}
                      >
                        {`${tokenTypeString[i.type]} #${i.tokenId}`}
                      </a>
                      <div
                        style={{
                          color: theme?.listingPriceColor ? theme?.listingPriceColor : "rgb(140, 149, 156)",
                          fontSize: theme?.listingPriceFontSize ? theme?.listingPriceFontSize : "80%",
                          fontWeight: theme?.listingPriceFontWeight ? theme?.listingPriceFontWeight : "300",
                          paddingTop: theme?.listingPricePaddingTop ? theme?.listingPricePaddingTop : ".25rem",
                        }}
                      >
                        {i.listingPrice}
                      </div>
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
              {idx + 1 !== metadata.filter(i => i.owner !== undefined).filter(i => collectionType[i.type] !== collectionId).length && (
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

      {metadata && metadata.filter(i => i.owner !== undefined).filter(i => collectionType[i.type] !== collectionId).length === 0 && !isLoading && (
        <div>No Matched Items Found</div>
      )}

    </div>
  )
}

export default ApeMatchedItems;