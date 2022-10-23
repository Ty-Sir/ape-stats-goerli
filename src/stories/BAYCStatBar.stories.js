import { React } from "react"
import { storiesOf } from "@storybook/react"

import { BAYCStatBar } from "../components/BAYCStatBar"

const stories = storiesOf("App test", module);

stories.add('App', () => {
  return(<BAYCStatBar tokenId={71} />)
})