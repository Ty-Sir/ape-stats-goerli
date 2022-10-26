var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from "react";
import { ApeCoinLogo } from "../ApeCoinLogo";
import { ExternalLinkIcon } from "../ExternalLinkIcon";
import { Multicall } from 'ethereum-multicall';
import { BigNumber, ethers } from 'ethers';
import { Skeleton } from "../Skeleton";
import '../../styles.css';
import { APE_COIN_STAKING_ABI, NFT_ABI } from "../../constants/abi";
import { APE_COIN_STAKING_GOERLI, APE_COIN_STAKING_MAINNET, NFT_CONTRACTS_GOERLI, NFT_CONTRACTS } from "../../constants/addresses";
import { getPrettyValue, round } from "../../utils/formatters";
const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });
const formatAmount = (num = "0", percision = 4) => {
    if (Number(num) < 0.0001 && Number(num) > 0) {
        return '< 0.0001';
    }
    return getPrettyValue(parseFloat(round(num, percision)));
};
const references = [
    'getApeCoinStakeCall',
    'getBaycStakesCall',
    'getMaycStakesCall',
    'getBakcStakesCall',
];
const methodNames = [
    'getApeCoinStake',
    'getBaycStakes',
    'getMaycStakes',
    'getBakcStakes',
];
export const ApeStatBar = ({ theme, tokenId, stakersAddress, poolId = '0', isTestnet = true }) => {
    const [stakedAmount, setStakedAmount] = React.useState(undefined);
    const [stakeCap, setStakeCap] = React.useState(undefined);
    const [unclaimedApeCoin, setUnclaimedApeCoin] = React.useState(undefined);
    const [rewards24hr, setRewards24hr] = React.useState(undefined);
    const [ownerOf, setOwnerOf] = React.useState(undefined);
    const nftCallContext = [
        {
            reference: 'NFTContract',
            contractAddress: isTestnet ? NFT_CONTRACTS_GOERLI[(Number(poolId))] : NFT_CONTRACTS[(Number(poolId))],
            abi: NFT_ABI,
            calls: [
                {
                    reference: 'ownerOfCall',
                    methodName: 'ownerOf',
                    methodParameters: [tokenId]
                },
            ]
        },
    ];
    const handleOwnerOf = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const result = yield multicall.call(nftCallContext);
            const ownersAddress = (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.results) === null || _a === void 0 ? void 0 : _a.NFTContract) === null || _b === void 0 ? void 0 : _b.callsReturnContext[0]) === null || _c === void 0 ? void 0 : _c.returnValues[0];
            setOwnerOf(ownersAddress);
        }
        catch (error) {
            console.log(error);
        }
    });
    React.useEffect(() => {
        if (poolId && String(poolId) !== '0' && !ownerOf && tokenId) {
            handleOwnerOf();
        }
    }, [poolId, tokenId, ownerOf]);
    const stakingCallContext = [
        {
            reference: 'ApeCoinStaking',
            contractAddress: isTestnet ? APE_COIN_STAKING_GOERLI : APE_COIN_STAKING_MAINNET,
            abi: APE_COIN_STAKING_ABI,
            calls: [
                {
                    reference: references[poolId && Number(poolId)],
                    methodName: methodNames[poolId && Number(poolId)],
                    methodParameters: [poolId && String(poolId) !== '0' ? ownerOf : stakersAddress]
                },
                {
                    reference: 'getPoolsUICall',
                    methodName: 'getPoolsUI',
                    methodParameters: []
                },
            ]
        },
    ];
    const handleMulitcall = () => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        try {
            const result = yield multicall.call(stakingCallContext);
            let id = !tokenId ? "0" : String(tokenId);
            const tokenIdHex = ethers.utils.hexlify(Number(id));
            const returnedStakes = (_f = (_e = (_d = result === null || result === void 0 ? void 0 : result.results) === null || _d === void 0 ? void 0 : _d.ApeCoinStaking) === null || _e === void 0 ? void 0 : _e.callsReturnContext[0]) === null || _f === void 0 ? void 0 : _f.returnValues;
            const stakeStruct = String(poolId) !== '0' ? returnedStakes.find(stake => { var _a; return ((_a = stake[1]) === null || _a === void 0 ? void 0 : _a.hex) === tokenIdHex; }) : returnedStakes;
            let poolCapWeiAmount = "0";
            if (String(poolId) !== '0') {
                //nft staking cap
                poolCapWeiAmount = String(BigNumber.from((_k = (_j = (_h = (_g = result === null || result === void 0 ? void 0 : result.results) === null || _g === void 0 ? void 0 : _g.ApeCoinStaking) === null || _h === void 0 ? void 0 : _h.callsReturnContext[1]) === null || _j === void 0 ? void 0 : _j.returnValues[Number(poolId)][2][3]) === null || _k === void 0 ? void 0 : _k.hex));
                poolCapWeiAmount = ethers.utils.formatEther(poolCapWeiAmount);
            }
            const weiStakedAmount = String((_l = stakeStruct[2]) === null || _l === void 0 ? void 0 : _l.hex);
            const unclaimedWeiAmount = String((_m = stakeStruct[3]) === null || _m === void 0 ? void 0 : _m.hex);
            const rewards = String((_o = stakeStruct[4]) === null || _o === void 0 ? void 0 : _o.hex);
            setStakedAmount(ethers.utils.formatEther(weiStakedAmount));
            setStakeCap(poolCapWeiAmount);
            setUnclaimedApeCoin(ethers.utils.formatEther(unclaimedWeiAmount));
            setRewards24hr(ethers.utils.formatEther(rewards));
        }
        catch (error) {
            console.log(error);
        }
    });
    React.useEffect(() => {
        if (!stakedAmount &&
            !stakeCap &&
            !unclaimedApeCoin &&
            !rewards24hr) {
            if (poolId && ((String(poolId) !== "0" && ownerOf) || (String(poolId) === "0" && stakersAddress))) {
                handleMulitcall();
            }
        }
    }, [stakedAmount, stakeCap, rewards24hr, unclaimedApeCoin, ownerOf, poolId, stakersAddress]);
    return (<div style={Object.assign({ backgroundColor: (theme === null || theme === void 0 ? void 0 : theme.backgroundColor) ? theme === null || theme === void 0 ? void 0 : theme.backgroundColor : "white", borderRadius: (theme === null || theme === void 0 ? void 0 : theme.borderRadius) ? theme === null || theme === void 0 ? void 0 : theme.borderRadius : "5px", padding: (theme === null || theme === void 0 ? void 0 : theme.padding) ? theme === null || theme === void 0 ? void 0 : theme.padding : "1.125rem 2rem", color: (theme === null || theme === void 0 ? void 0 : theme.color) ? theme === null || theme === void 0 ? void 0 : theme.color : "black", fontFamily: (theme === null || theme === void 0 ? void 0 : theme.fontFamily) ? theme === null || theme === void 0 ? void 0 : theme.fontFamily : "sans-serif", fontWeight: (theme === null || theme === void 0 ? void 0 : theme.fontWeight) ? theme === null || theme === void 0 ? void 0 : theme.fontWeight : "bold", boxShadow: (theme === null || theme === void 0 ? void 0 : theme.boxShadow) ? theme === null || theme === void 0 ? void 0 : theme.boxShadow : "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", justifyContent: "space-between", minWidth: "fit-content", gap: "1rem" }, theme)} className='ape-stat-bar-display'>
      <div style={{
            gap: ".75rem",
            alignItems: "center"
        }} className='ape-stat-bar-display'>
        <ApeCoinLogo />
        <div style={{ display: "grid", gap: ".25rem" }}>
          <div>$APE Staked</div>
          {!unclaimedApeCoin || !rewards24hr || !stakedAmount || !stakeCap ?
            <Skeleton height={theme === null || theme === void 0 ? void 0 : theme.fontSize} backgroundColor={theme === null || theme === void 0 ? void 0 : theme.skeletonBackgroundColor}/>
            :
                <div style={{
                        color: (theme === null || theme === void 0 ? void 0 : theme.statColor) ? theme === null || theme === void 0 ? void 0 : theme.statColor : 'limegreen',
                        animation: 'fadeIn .75s'
                    }}>
              <span>{formatAmount(stakedAmount)}</span>
               {poolId && String(poolId) !== "0" ?
                        <span>
                    {` / ${formatAmount(stakeCap)}`}
                  </span>
                        :
                            null}
            </div>}
          <div style={{
            fontSize: (theme === null || theme === void 0 ? void 0 : theme.rateFontSize) ? theme === null || theme === void 0 ? void 0 : theme.rateFontSize : "60%",
            display: 'flex',
            gap: ".2rem",
        }} className='ape-stat-bar-rewards'>
            <div>$APE/24hr:</div>
            {!unclaimedApeCoin || !rewards24hr || !stakedAmount || !stakeCap ?
            <Skeleton height={(theme === null || theme === void 0 ? void 0 : theme.rateFontSize) ? theme === null || theme === void 0 ? void 0 : theme.rateFontSize : ".6rem"} backgroundColor={theme === null || theme === void 0 ? void 0 : theme.skeletonBackgroundColor}/>
            :
                <div>{formatAmount(rewards24hr)}</div>}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gap: ".25rem", }}>
        <div>Unclaimed $APE</div>
        {!unclaimedApeCoin || !rewards24hr || !stakedAmount || !stakeCap ?
            <Skeleton height={theme === null || theme === void 0 ? void 0 : theme.fontSize} backgroundColor={theme === null || theme === void 0 ? void 0 : theme.skeletonBackgroundColor}/>
            :
                <div style={{
                        color: (theme === null || theme === void 0 ? void 0 : theme.statColor) ? theme === null || theme === void 0 ? void 0 : theme.statColor : 'limegreen',
                        animation: 'fadeIn .75s',
                    }} className='ape-stat-bar-unclaimed'>
            {formatAmount(unclaimedApeCoin)}
          </div>}
        <a style={{
            cursor: "pointer",
            color: "inherit",
            textDecoration: "none",
            width: "fit-content",
            justifySelf: "end",
        }} href="https://apestake.io/" target={"_blank"} rel="noopenner noreferrer">
          <div style={{
            fontSize: (theme === null || theme === void 0 ? void 0 : theme.linkFontSize) ? theme === null || theme === void 0 ? void 0 : theme.linkFontSize : "60%",
            display: "flex",
            gap: ".25rem",
        }}>
            <span>Manage</span>
            <ExternalLinkIcon />
          </div>
        </a>
      </div>
    </div>);
};
