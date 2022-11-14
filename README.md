# ape-stats-goerli

Three React components that display Bored Ape related data.

### 1) ApeStatBar

Displays staked ApeCoin amount, max pool amount, unclaimed amount, and daily rate
for the ApeCoin pool, BAYC pool, MAYC pool, and BAKC pool.

### 2) ApeUnusedSerums

Given a Bored Ape `tokenId`, the unused serums to create a Mutant Ape are displayed.

### 3) ApeMatchedItems

Given a Bored Ape `tokenId`, if they exist, the accompanying MAYC, BAKC, and OTHR tokens are displayed.

#

[`ethereum-multicall`](https://www.npmjs.com/package/ethereum-multicall) is used with a public RPC to retreive the on-chain data.

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

### ApeStatBar 📊

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
import { ApeStatBar } from "ape-stats-goerli";

export default function Page() {
  return <ApeStatBar tokenId={"1"} poolId={"1"} isTestnet={true} />;
}
```

### ApeUnusedSerums 🧪

The `tokenId` is **required**.

The code snippet below will render the unused serums for `tokenId` `1` of the BAYC collection used on Ethereum Mainnet.

```javascript
import { ApeUnusedSerums } from "ape-stats-goerli";

export default function Page() {
  return <ApeUnusedSerums tokenId={"1"} />;
}
```

### ApeMatchedItems 🖇️

The `tokenId` is **required**.

The code snippet below will render, if they exist, the accompanying MAYC, BAKC, and OTHR tokens for `tokenId` `1` of the BAYC collection used on Ethereum Mainnet.

```javascript
import { ApeMatchedItems } from "ape-stats-goerli";

export default function Page() {
  return <ApeMatchedItems tokenId={"1"} />;
}
```

## Theming

A `theme` object can be added as a prop to `ApeStatBar`, `ApeUnusedSerums`, and `ApeMatchedItems` for custom styling. \
\
Treat this object as you would inline css styling. \
\
If any of the default styling given to certain parts of the component is undesired, the tables below will aid in custom styling.

#### Exceptions for ApeStatBar

| Theme Key                 | Description                                       | Default     |
| :------------------------ | :------------------------------------------------ | :---------- |
| `subTitleFontSize`        | Font size describing which pool the data is from. | `60%`       |
| `skeletonBackgroundColor` | Color of the loading placeholder.                 | `#DDDBDD`   |
| `statColor`               | Font color of the stats.                          | `limegreen` |
| `rateFontSize`            | Font size of the 24hr rate.                       | `.6rem`     |
| `linkFontSize`            | Font size of the external link.                   | `60%`       |

#### Exceptions for ApeUnusedSerums

| Theme Key                 | Description                              | Default            |
| :------------------------ | :--------------------------------------- | :----------------- |
| `dividerColor`            | Color of dividing line.                  | `rgb(55, 59, 66)`  |
| `skeletonBackgroundColor` | Color of the loading placeholder.        | `#DDDBDD`          |
| `buyButtonColor`          | Font and border color of the buy button. | `rgb(85, 189, 82)` |
| `itemsGap`                | Vertical gap between items               | `0.5rem`           |
| `imageGap`                | Spacing between image and title.         | `0.5rem`           |

#### Exceptions for ApeMatchedItems

| Theme Key                 | Description                                  | Default              |
| :------------------------ | :------------------------------------------- | :------------------- |
| `dividerColor`            | Color of dividing line.                      | `rgb(55, 59, 66)`    |
| `skeletonBackgroundColor` | Color of the loading placeholder.            | `#DDDBDD`            |
| `ownedByColor`            | Font color of the text that says "Owned by". | `rgb(140, 149, 156)` |
| `itemsGap`                | Vertical gap between items                   | `0.5rem`             |
| `imageGap`                | Spacing between image and title.             | `0.5rem`             |

```javascript
import { ApeStatBar } from 'ape-stats-goerli'

export default function Page() {
  return(
    <ApeStatBar
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

## Props for ApeStatBar

| Parameter        | Type      | Description                                                    | Default     |
| :--------------- | :-------- | :------------------------------------------------------------- | :---------- |
| `stakersAddress` | `string`  | **Required if poolId is 0**. Valid wallet address.             | `undefined` |
| `tokenId`        | `string`  | **Required if poolId is NOT 0**. Valid `tokenId` for NFT.      | `undefined` |
| `poolId`         | `string`  | Pool ID to determine which staking pool to retrieve data from. | `'0'`       |
| `theme`          | `object`  | Inline CSS styling object.                                     | `undefined` |
| `isTestnet`      | `boolean` | Boolean used for choose which chain to get staking data from.  | `true`      |

## Props for ApeUnusedSerums

| Parameter | Type     | Description                                   | Default     |
| :-------- | :------- | :-------------------------------------------- | :---------- |
| `tokenId` | `string` | **Required**. Valid `tokenId` for BAYC token. | `undefined` |
| `theme`   | `object` | Inline CSS styling object.                    | `undefined` |

## Props for ApeMatchedItems

| Parameter | Type     | Description                                   | Default     |
| :-------- | :------- | :-------------------------------------------- | :---------- |
| `tokenId` | `string` | **Required**. Valid `tokenId` for BAYC token. | `undefined` |
| `theme`   | `object` | Inline CSS styling object.                    | `undefined` |
