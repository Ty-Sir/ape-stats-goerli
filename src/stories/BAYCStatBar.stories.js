import { React } from "react"
import { storiesOf } from "@storybook/react"

import { BAYCStatBar } from "../components/BAYCStatBar"

const stories = storiesOf("App test", module);

stories.add('App', () => {
  return(<BAYCStatBar theme={{backgroundColor: 'red'}} tokenId={71} />)
})