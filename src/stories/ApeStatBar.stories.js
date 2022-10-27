import { React } from "react"
import { storiesOf } from "@storybook/react"

import { ApeStatBar } from "../components/ApeStatBar"

const stories = storiesOf("App test", module);

stories.add('App', () => {
  return(
    <div>
      <ApeStatBar 
        stakersAddress="0x47Ef3bF350F70724F2fd34206990cdE9C3A6B6F0"
        isTestnet={true}
      />
      <ApeStatBar 
        tokenId={71} 
        poolId="1"
        isTestnet={true}
        theme={{
          skeletonBackgroundColor: "pink"
        }}
      />
      <ApeStatBar 
        tokenId={75} 
        poolId="2"
        isTestnet={true}
      />
      <ApeStatBar 
        tokenId={65} 
        poolId="3"
        isTestnet={true}
      />
    </div>
  )
})