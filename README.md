# ape-stats-goerli

Reusable React component that displays staked ApeCoin amount, max pool amount, unclaimed amount, and daily rate
for the ApeCoin pool, BAYC pool, MAYC pool, and BAKC pool.

[`ethereum-multicall`](https://www.npmjs.com/package/ethereum-multicall) is used with a public RPC to retreive the on-chain staking data.

## Installation

Installed with npm or yarn.

If [`ethers`](https://www.npmjs.com/package/ethers) is not in your project, install with [`ethers`](https://www.npmjs.com/package/ethers) as well.

```bash
  npm install ape-package ethers
```

or

```bash
  yarn add ape-package ethers
```

## Usage

#### Currently only Goërli is supported. Mainnet support will be added when the staking contract address is made available.

The `stakersAddress` is **required** if `poolId` is `0`. Otherwise the `stakersAddress` is inferred from the `ownerOf` the `tokenId` supplied. \
\
The `tokenId` is **required** if `poolId` is **NOT** `0`. The `stakersAddress` prop will be ignored in this case.\
\
If `poolId` is left `undefined` it will default to `0` ie. the ApeCoin staking pool.

| Pool ID | Description  |
| :------ | :----------- |
| `0`     | ApeCoin Pool |
| `1`     | BAYC Pool    |
| `2`     | MAYC Pool    |
| `3`     | BAKC Pool    |

The code snippet below will render the stats for `tokenId` `1` of the BAYC collection used on Goërli.

```javascript
import { ApeComponent } from "ape-package";

export default function Page() {
  return <ApeComponent tokenId={"10"} poolId={"1"} isTestnet={true} />;
}
```

## Theming

A `theme` object can be added as a prop to the ApeComponent for custom styling. \
\
Treat this object as you would inline css styling. \
\
If any of the default styling given to certain parts of the component is undesired, the table below will aid in custom styling.

#### Exceptions

| Theme Key                 | Description                                       | Default     |
| :------------------------ | :------------------------------------------------ | :---------- |
| `subTitleFontSize`        | Font size describing which pool the data is from. | `60%`       |
| `skeletonBackgroundColor` | Color of the loading placeholder.                 | `#DDDBDD`   |
| `statColor`               | Font color of the stats.                          | `limegreen` |
| `rateFontSize`            | Font size of the 24hr rate.                       | `.6rem`     |
| `linkFontSize`            | Font size of the external link.                   | `60%`       |

```javascript
import { ApeComponent } from 'ape-package'

export default function Page() {
  return(
    <ApeComponent
        tokenId={"10"}
        poolId={"1"}
        theme={{
            borderRadius: "10px",
            backgroundColor: "#000000",
            border: "1px solid #45494D",
            color: "white",
            padding: "1.5rem"
            skeletonBackgroundColor: "pink"
        }}
    />
  )
}
```

## Options

| Parameter        | Type      | Description                                                    | Default     |
| :--------------- | :-------- | :------------------------------------------------------------- | :---------- |
| `stakersAddress` | `string`  | **Required if poolId is 0**. Valid wallet address.             | `undefined` |
| `tokenId`        | `string`  | **Required if poolId is NOT 0**. Valid token ID for NFT.       | `undefined` |
| `poolId`         | `string`  | Pool ID to determine which staking pool to retrieve data from. | `'0'`       |
| `theme`          | `object`  | Inline CSS styling object.                                     | `undefined` |
| `isTestnet`      | `boolean` | Boolean used for choose which chain to get staking data from.  | `true`      |
