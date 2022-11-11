import { CSSProperties } from 'react';

interface ApeStatBarProps {
    theme?: CSSProperties | any;
    tokenId?: String;
    stakersAddress?: String;
    poolId: String;
    isTestnet: Boolean;
}

declare const ApeStatBar: ({ theme, tokenId, stakersAddress, poolId, isTestnet }: ApeStatBarProps) => JSX.Element;

interface ApeUnusedSerumsProps {
    theme?: CSSProperties | any;
    tokenId?: String;
}

declare const ApeUnusedSerums: ({ theme, tokenId }: ApeUnusedSerumsProps) => JSX.Element;

interface ApeMatchedItemsProps {
    theme?: CSSProperties | any;
    tokenId?: String;
}

declare const ApeMatchedItems: ({ theme, tokenId }: ApeMatchedItemsProps) => JSX.Element;

export { ApeMatchedItems, ApeStatBar, ApeUnusedSerums };
