require('dotenv').config();

require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');

const MNEMONIC =
    process.env.MNEMONIC || 'test test test test test test test test test test test junk';
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || '';

const chainIds = {
    hardhat: 31337,
    ganache: 1337,
    mainnet: 1,
    ropsten: 3,
    rinkeby: 4,
    goerli: 5,
    kovan: 42,
    fantom: 250,
    fantomTest: 4002,
    polygon: 137,
    mumbai: 80001,
};
const forkingBlockNumber = {
    mainnet: 15094221,
    fantom: 42213852,
    polygon: 30435632,
};

const getNetworkUrl = (network) => {
    let url = 'https://' + network + '.infura.io/v3/' + INFURA_PROJECT_ID;

    switch (network) {
        case 'mumbai':
            url = 'https://matic-mumbai.chainstacklabs.com';
            break;
        case 'polygon':
            url = 'https://polygon-rpc.com';
            break;
        case 'fantomTest':
            url = 'https://rpc.testnet.fantom.network';
            break;
        case 'fantom':
            url = 'https://rpc2.fantom.network';
            break;
    }
    return url;
};
const getForkingConfig = (network) => ({
    url: getNetworkUrl(network),
    blockNumber: forkingBlockNumber[network] ?? undefined,
});

const getTestnetConfig = (network) => ({
    chainId: chainIds[network],
    url: getNetworkUrl(network),
    forking: getForkingConfig(network),
    accounts: {
        count: 20,
        initialIndex: 0,
        mnemonic: MNEMONIC,
        path: "m/44'/60'/0'/0",
    },
});

const createTestnetConfig = (network) => {
    let url = 'https://' + network + '.infura.io/v3/' + INFURA_PROJECT_ID;

    switch (network) {
        case 'mumbai':
            url = 'https://matic-mumbai.chainstacklabs.com';
            break;
        case 'polygon':
            url = 'https://polygon-rpc.com';
            break;
        case 'fantomTest':
            url = 'https://rpc.testnet.fantom.network';
            break;
        case 'fantom':
            url = 'https://rpc2.fantom.network';
            break;
    }

    return {
        accounts: {
            count: 20,
            initialIndex: 0,
            mnemonic: MNEMONIC,
            path: "m/44'/60'/0'/0",
        },
        chainId: chainIds[network],
        url,
        forking: {
            url,
            blockNumber: forkingBlockNumber[network] ?? undefined,
        },
    };
};
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks: {
        hardhat: {
            forking: getForkingConfig('mainnet'),
        },
        local: {
            url: 'http://127.0.0.1:8545/',
            timeout: 600000,
            forking: getForkingConfig('mainnet'),
        },
        mainnet: getTestnetConfig('mainnet'),
        mumbai: getTestnetConfig('mumbai'),
        rinkeby: getTestnetConfig('rinkeby'),
        fantomTest: getTestnetConfig('fantomTest'),
    },
    solidity: {
        version: '0.8.14',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            outputSelection: {
                '*': {
                    '*': ['storageLayout'],
                },
            },
        },
    },
};
