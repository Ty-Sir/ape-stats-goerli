import { CSSProperties } from "react"

export interface ApeStatBarProps {
  theme?: CSSProperties | any
  tokenId?: String
  stakersAddress?: String
  poolId: String
  isTestnet: Boolean
}