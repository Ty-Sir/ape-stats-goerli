import { React } from "react"
import { storiesOf } from "@storybook/react"
import { ApeStatBar, ApeUnusedSerums, ApeMatchedItems } from "../index"
import { useStakedAmount } from "../index";

const stories = storiesOf("Ape Components", module);

stories.add('Ape Stat Bar', () => {
  return(
    <div>
      <ApeStatBar 
        stakersAddress="0x47Ef3bF350F70724F2fd34206990cdE9C3A6B6F0"
        isTestnet={true}
      />
      <ApeStatBar 
        tokenId={'71'} 
        poolId="1"
        isTestnet={false}
        theme={{
          skeletonBackgroundColor: "pink"
        }}
      />
      <ApeStatBar 
        tokenId={'75'} 
        poolId="2"
        isTestnet={true}
      />
      <ApeStatBar 
        tokenId={'65'} 
        poolId="3"
        isTestnet={true}
      />
    </div>
  )
})

stories.add("ApeUnusedSerums", () => {
  return(
    <div>
      <ApeUnusedSerums 
        tokenId='416'
        baseUrl={'apecoinmarketplace.com'}
        theme={{
          maxWidth: "800px",
          margin: '0 auto 2rem auto',
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          skeletonBackgroundColor: "pink",
          imageGap: "2rem"
        }}
      />
    </div>
  )
})

const Demo = () => {
  const { stakedAmount } = useStakedAmount(true, '1', '71')
  return(
    <div>{stakedAmount}</div>
  )
}

stories.add("Hook", () => (<Demo />))

stories.add("ApeMatchedItems", () => {
  return(
    <div>
      <ApeMatchedItems 
        tokenId='1290'
        baseUrl="bayc.snag-render.com"
        collectionId={"2"}
        theme={{
          maxWidth: "800px",
          margin: '0 auto 2rem auto',
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          imageGap: "1rem"
        }}
      />
      <ApeMatchedItems 
        tokenId='9999'
        baseUrl="bayc.snag-render.com"
        collectionId={"0"}
        theme={{
          maxWidth: "800px",
          margin: '0 auto 2rem auto',
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          imageGap: "1rem"
        }}
      />
      <ApeMatchedItems 
        tokenId='30001'
        baseUrl="bayc.snag-render.com"
        collectionId={"0"}
        theme={{
          maxWidth: "800px",
          margin: '0 auto 2rem auto',
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          imageGap: "1rem"
        }}
      />
      <ApeMatchedItems 
        tokenId='26634'
        baseUrl="bayc.snag-render.com"
        collectionId={"0"}
        theme={{
          maxWidth: "800px",
          margin: '0 auto 2rem auto',
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          imageGap: "1rem"
        }}
      />
    </div>
  )
})