# ape-stats-goerli

Three React components and a hook that display Bored Ape related data.

### 1) ApeStatBar

Displays staked ApeCoin amount, max pool amount, unclaimed amount, and daily rate
for the ApeCoin pool, BAYC pool, MAYC pool, and BAKC pool.

### 2) useStakedAmount

Returns the staked ApeCoin amount for the ApeCoin pool, BAYC pool, MAYC pool, and BAKC pool.

### 3) ApeUnusedSerums

Given a Bored Ape `tokenId`, the unused serums to create a Mutant Ape are displayed.

### 4) ApeMatchedItems

Given a `collectionId` and `tokenId`, if they exist, the accompanying BAYC, MAYC, BAKC, and/or OTHR tokens are displayed.

#

[`ethereum-multicall`](https://www.npmjs.com/package/ethereum-multicall) is used with a public RPC to retreive the on-chain data.

## Installation

Installed with npm or yarn.

If [`ethers`](https://www.npmjs.com/package/ethers) is not in your project, install with [`ethers`](https://www.npmjs.com/package/ethers) as well.

```bash
  npm install ape-stats-goerli ethers
```

or

```bash
  yarn add ape-stats-goerli ethers
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

### useStakedAmount 📊

#### Currently only Goërli is supported. Mainnet support will be added when the staking contract address is made available.

The params go as follows: `isTestnet: boolean`, `poolId: string,` `tokenId: string`, `stakersAddress: string` \
\
Just like `ApeStatBar` , `stakersAddress` is **required** if `poolId` is 0. \
And `tokenId` is **required** if `poolId` is 1, 2 or 3 \
\
_Refer to table above for `poolId` reference._ \
\
The code snippet below will return the amount of staked ApeCoin for `stakersAddress` `0x9B6cEd7dc2F47Ae3e30E6162193BD9CE78643A63` on Goërli. \
_Enter `tokenId` as empty string if `poolId` is 0._

```javascript
import { useStakedAmount } from "ape-stats-goerli";

export default function Page() {
  const { stakedAmount } = useStakedAmount(
    true,
    "0",
    "",
    "0x9B6cEd7dc2F47Ae3e30E6162193BD9CE78643A63"
  );

  return <div>{stakedAmount}</div>;
}
```

The code snippet below will return the amount of staked ApeCoin for the BAYC pool for `tokenId` `10` on Goërli. \
_Omit `stakersAddress` if `poolId` is 1, 2, or 3._

```javascript
import { useStakedAmount } from "ape-stats-goerli";

export default function Page() {
  const { stakedAmount } = useStakedAmount(true, "1", "10");

  return <div>{stakedAmount}</div>;
}
```

### UnusedSerums 🧪

The `tokenId` and `baseUrl` are **required**.

The code snippet below will render the unused serums for `tokenId` `1` of the BAYC collection used on Ethereum Mainnet.

```javascript
import { UnusedSerums } from "ape-stats-goerli";

export default function Page() {
  return <UnusedSerums baseUrl="bayc.snag-render.com" tokenId={"1"} />;
}
```

### MatchedItems 🖇️

| Colletion ID | Description |
| :----------- | :---------- |
| `0`          | MAYC Token  |
| `1`          | OTHR Token  |
| `2`          | BAKC Token  |
| `3`          | BAYC TOken  |

The `collectionId`, `tokenId`, and `baseUrl` are **required**.\
**The given `tokenId` must exist.**

The code snippet below will render the accompanying MAYC, BAKC, and BAYC tokens for `tokenId` `1290` of the OTHR collection used on Ethereum Mainnet.

```javascript
import { MatchedItems } from "ape-stats-goerli";

export default function Page() {
  return (
    <MatchedItems
      baseUrl="bayc.snag-render.com"
      tokenId={"1290"}
      collectionId="1"
    />
  );
}
```

The code snippet below will render the accompanying OTHR, BAKC, and BAYC tokens for `tokenId` `30006` of the MAYC collection used on Ethereum Mainnet.

```javascript
import { MatchedItems } from "ape-stats-goerli";

export default function Page() {
  return (
    <MatchedItems
      baseUrl="bayc.snag-render.com"
      tokenId={"30006"}
      collectionId="0"
    />
  );
}
```

## Theming

A `theme` object can be added as a prop to `ApeStatBar`, `UnusedSerums`, and `MatchedItems` for custom styling. \
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

#### Exceptions for UnusedSerums

| Theme Key                 | Description                              | Default            |
| :------------------------ | :--------------------------------------- | :----------------- |
| `dividerColor`            | Color of dividing line.                  | `rgb(55, 59, 66)`  |
| `skeletonBackgroundColor` | Color of the loading placeholder.        | `#DDDBDD`          |
| `buyButtonColor`          | Font and border color of the buy button. | `rgb(85, 189, 82)` |

#### Exceptions for MatchedItems

| Theme Key                 | Description                                  | Default              |
| :------------------------ | :------------------------------------------- | :------------------- |
| `dividerColor`            | Color of dividing line.                      | `rgb(55, 59, 66)`    |
| `skeletonBackgroundColor` | Color of the loading placeholder.            | `#DDDBDD`            |
| `ownedByColor`            | Font color of the text that says "Owned by". | `rgb(140, 149, 156)` |

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
| `isTestnet`      | `boolean` | Boolean used for choose which chain to get staking data from.  | `false`     |

## Props for UnusedSerums

| Parameter | Type     | Description                                   | Default     |
| :-------- | :------- | :-------------------------------------------- | :---------- |
| `tokenId` | `string` | **Required**. Valid `tokenId` for BAYC token. | `undefined` |
| `baseUrl` | `string` | **Required**. Base URL for external link.     | `undefined` |
| `theme`   | `object` | Inline CSS styling object.                    | `undefined` |

## Props for MatchedItems

| Parameter      | Type     | Description                                                                       | Default     |
| :------------- | :------- | :-------------------------------------------------------------------------------- | :---------- |
| `tokenId`      | `string` | **Required**. Valid `tokenId` for BAYC token.                                     | `undefined` |
| `baseUrl`      | `string` | **Required**. Base URL for external link.                                         | `undefined` |
| `collectionId` | `string` | **Required**. Reference to determine what collection the given `tokenId` is from. | `undefined` |
| `theme`        | `object` | Inline CSS styling object.                                                        | `undefined` |
