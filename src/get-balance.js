const { ethers } = require('ethers');
const TokenAbi = require('./abi/Token.json');

const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_URL);

const NATIVE_TOKENS = {
    mainnet: 'ETH',
    polygon: 'MATIC',
    fantom: 'FTM',
};
const TOKENS = {
    mainnet: {
        GRT: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
        MATIC: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        FTM: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
        csMATIC: '0x38b7bf4eecf3eb530b1529c9401fc37d2a71a912',
        stMATIC: '0x9ee91f9f426fa633d227f7a9b000e28b9dfd8599',
        stETH: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    },
    polygon: {
        csMATIC: '0x7ed6390f38d554B8518eF30B925b46972E768AF8',
        wMATIC: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        stMATIC: '0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4',
    },
    fantom: {
        wFTM: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    },
};

const getNetworkTokenKey = (network) => `${network}_${NATIVE_TOKENS[network]}`;

const getTokenContracts = (network) => {
    const networkTokens = TOKENS[network];
    return Object.entries(networkTokens).reduce((acc, [network, tokenAddress]) => {
        acc[network] = new ethers.Contract(tokenAddress, TokenAbi, provider);
        return acc;
    }, {});
};

const getUserBalances = async (userAddress, network, tokenContracts) => {
    const networkTokens = TOKENS[network];

    const nativeBalanceReq = provider.getBalance(userAddress);
    const tokenBalancesReq = Object.keys(networkTokens).map((token) => {
        return tokenContracts[token].balanceOf(userAddress);
    });

    const allBalances = await Promise.all([...tokenBalancesReq, nativeBalanceReq]);

    const nativeBalance = allBalances.pop();
    const tokenBalances = Object.keys(networkTokens).reduce((acc, token, index) => {
        acc[`${network}_${token}`] = +ethers.utils.formatEther(allBalances[index]);
        return acc;
    }, {});

    return {
        userAddress,
        [getNetworkTokenKey(network)]: +ethers.utils.formatEther(nativeBalance),
        ...tokenBalances,
    };
};

module.exports = {
    getTokenContracts,
    getUserBalances,
    getNetworkTokenKey,
};
