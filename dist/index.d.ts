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
    baseUrl: String;
}

declare const ApeUnusedSerums: ({ theme, tokenId, baseUrl }: ApeUnusedSerumsProps) => JSX.Element;

interface ApeMatchedItemsProps {
    theme?: CSSProperties | any;
    tokenId?: String;
    baseUrl: String;
    collectionId: String;
}

declare const ApeMatchedItems: ({ theme, tokenId, baseUrl, collectionId }: ApeMatchedItemsProps) => JSX.Element;

declare const useStakedAmount: (isTestnet: Boolean | undefined, poolId: String, tokenId?: String, stakersAddress?: String) => {
    stakedAmount: string | undefined;
};

export { ApeMatchedItems, ApeStatBar, ApeUnusedSerums, useStakedAmount };
