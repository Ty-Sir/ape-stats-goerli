declare const useStakedAmount: (isTestnet: Boolean | undefined, poolId: String, tokenId?: String, stakersAddress?: String) => {
    stakedAmount: string | undefined;
};
export default useStakedAmount;
