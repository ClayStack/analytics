const { ethers } = require('hardhat');
const TokenAbi = require('./abi/Token.json');

const tokens = {
    mumbai: {
        csToken: '0x7c35c1bfd89bbde1c63a45b295a02a07e52e27cf',
    },
    polygon: {
        csToken: '0x7ed6390f38d554B8518eF30B925b46972E768AF8',
    },
    rinkeby: {
        grt: '0x54fe55d5d255b8460fb3bc52d5d676f9ae5697cd',
        csGrt: '0xb5bEA89ac64555FBa349088434A5Ca21236C23CC',
    },
    fantomtest: {
        csFtm: '0x46609584b6022EF914C88ab0C8abf578a2B4E7A3',
    },
};

const network = process.env.HARDHAT_NETWORK;

const getUserBalance = async (userAddress) => {
    const networkTokens = tokens[network];

    const nativeBalance = ethers.provider.getBalance(userAddress);
    const tokenBalances = Object.values(networkTokens).map((tokenAddress) => {
        const token = new ethers.Contract(tokenAddress, TokenAbi, ethers.provider);
        return token.balanceOf(userAddress);
    });

    const allBalances = await Promise.all([nativeBalance, ...tokenBalances]);

    const tokenBalancesX = Object.keys(networkTokens).reduce((acc, token, index) => {
        acc[token] = allBalances[index + 1];
        return acc;
    }, {});

    return {
        userAddress,
        [network]: allBalances[0],
        ...tokenBalancesX,
    };
};

(async () => {
    const users = [
        '0x3a9009405c712027a6C08887687227e20bd3647F',
        '0xd40CD5F8836d11016005700b94e8CAd7e52585F2',
        '0x4D548edFbBEbD3e2030a7F67B3CefEa9347592a0',
        '0xaAE9bbc32ec1E78f37725c08C0515E395d0CC10D',
        '0xc846E67CCC6520580819B4263B1aD5eA4129E562',
    ];

    const allBalances = await Promise.all(users.map(getUserBalance));
    console.log('allBalances:', allBalances);
})();
