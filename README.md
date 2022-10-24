# ape-stats-goerli

## Installation

### npm:

```
npm install ape-stats-goerli ethers
```

### yarn:

```
yarn add ape-stats-goerli ethers
```

## Usage

```
import { BAYCStatBar } from "ape-stats-goerli"

export default function Page() {
  return(
    <BAYCStatBar tokenId={<BAYC Token ID>} />
  )
}

```

## Example

[https://ape-stats-example-site.vercel.app/](https://ape-stats-example-site.vercel.app/)

## Theming

A `theme` object can be added as a prop in the BAYCStatBar component for custom styling.

Treat this object as you would inline css styling.

The only difference is when styling the color of the staked amount and Token Id `statColor: "newColor"` is used.

```
import { BAYCStatBar } from "ape-stats-goerli"

export default function Page() {
  return(
    <BAYCStatBar
      tokenId={<BAYC Token ID>}
      theme={{
        backgroundColor: "black",
        color: "white",
        borderRadius: "10px",
        padding: ".5rem 1rem",
        statColor: "orange"
      }}
    />
  )
}
```

## TODO

[ ] Types \
[ ] light/dark mode flag
[ ] Number formatter with prop for custom country
