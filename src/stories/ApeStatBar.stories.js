import { React } from "react"
import { storiesOf } from "@storybook/react"

import { ApeStatBar, UnusedSerums, MatchedItems } from "../index"

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
        isTestnet={true}
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

stories.add("UnusedSerums", () => {
  return(
    <div>
      <UnusedSerums 
        tokenId='2228'
        theme={{
          maxWidth: "800px",
          margin: '0 auto 2rem auto',
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
          skeletonBackgroundColor: "pink"
        }}
      />
    </div>
  )
})

stories.add("MatchedItems", () => {
  return(
    <div>
      {/* <MatchedItems 
        tokenId='102'
        theme={{
          maxWidth: "800px",
          margin: '0 auto 2rem auto',
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
        }}
      /> */}
      <MatchedItems 
        tokenId='2258'
        theme={{
          maxWidth: "800px",
          margin: '0 auto 2rem auto',
          borderRadius: "10px",
          backgroundColor: "#000000",
          border: "1px solid #45494D",
          color: "white",
          padding: "1.5rem",
        }}
      />
    </div>
  )
})