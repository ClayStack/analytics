const { ethers } = require('hardhat');
const TokenAbi = require('./abi/Token.json');

const { handlers } = require('./db');

const nativeTokens = {
    mumbai: 'MATIC',
    polygon: 'MATIC',
    rinkeby: 'ETH',
    fantom: 'FTM',
    fantomTest: 'FTM',
};
const tokens = {
    mumbai: {
        csMATIC: '0x7c35c1bfd89bbde1c63a45b295a02a07e52e27cf',
    },
    polygon: {
        csMATIC: '0x7ed6390f38d554B8518eF30B925b46972E768AF8',
    },
    rinkeby: {
        GRT: '0x54fe55d5d255b8460fb3bc52d5d676f9ae5697cd',
        csGRT: '0xb5bEA89ac64555FBa349088434A5Ca21236C23CC',
    },
    fantomTest: {
        csFTM: '0x46609584b6022EF914C88ab0C8abf578a2B4E7A3',
    },
};

const network = process.env.HARDHAT_NETWORK;

const getUserBalances = async (userAddress) => {
    const networkTokens = tokens[network];
    const nativeToken = nativeTokens[network];

    const nativeBalanceReq = ethers.provider.getBalance(userAddress);
    const tokenBalancesReq = Object.values(networkTokens).map((tokenAddress) => {
        const token = new ethers.Contract(tokenAddress, TokenAbi, ethers.provider);
        return token.balanceOf(userAddress);
    });

    const allBalances = await Promise.all([...tokenBalancesReq, nativeBalanceReq]);

    const nativeBalance = allBalances.pop();
    const tokenBalances = Object.keys(networkTokens).reduce((acc, token, index) => {
        acc[`${network}_${token}`] = +ethers.utils.formatEther(allBalances[index]);
        return acc;
    }, {});

    return {
        userAddress,
        [`${network}_${nativeToken}`]: +ethers.utils.formatEther(nativeBalance),
        ...tokenBalances,
    };
};

(async () => {
    const users = [
        '0xDb7Cb98bb2834b3857816fE6eE709A8cCCA6AFBB',
        '0xc846E67CCC6520580819B4263B1aD5eA4129E562',
    ];

    const allBalances = await Promise.all(users.map(getUserBalances));

    handlers.saveUsers(allBalances);
})();
