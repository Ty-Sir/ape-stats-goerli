import { CSSProperties } from 'react';

interface ApeStatBarProps {
    theme?: CSSProperties | any;
    tokenId?: String;
    stakersAddress?: String;
    poolId: String;
    isTestnet: Boolean;
}

declare const ApeStatBar: ({ theme, tokenId, stakersAddress, poolId, isTestnet }: ApeStatBarProps) => JSX.Element;

interface UnusedSerumsProps {
    theme?: CSSProperties | any;
    tokenId?: String;
}

declare const UnusedSerums: ({ theme, tokenId }: UnusedSerumsProps) => JSX.Element;

interface MatchedItemsProps {
    theme?: CSSProperties | any;
    tokenId?: String;
}

declare const MatchedItems: ({ theme, tokenId }: MatchedItemsProps) => JSX.Element;

export { ApeStatBar, MatchedItems, UnusedSerums };
