require('dotenv').config();

require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');

const MNEMONIC =
    process.env.MNEMONIC || 'test test test test test test test test test test test junk';
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || '';

const chainIds = {
    ganache: 1337,
    goerli: 5,
    hardhat: 31337,
    kovan: 42,
    mainnet: 1,
    rinkeby: 4,
    ropsten: 3,
    mumbai: 80001,
    polygon: 137,
};

function createTestnetConfig(network) {
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
            blockNumber: 10967472,
        },
    };
}
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks: {
        hardhat: {
            forking: {
                url: createTestnetConfig('mumbai').url,
            },
        },
        local: {
            url: 'http://127.0.0.1:8545/',
            timeout: 60000,
            forking: {
                url: createTestnetConfig('fantomTest').url,
            },
        },
        mumbai: createTestnetConfig('mumbai'),
        rinkeby: createTestnetConfig('rinkeby'),
        fantomTest: createTestnetConfig('fantomTest'),
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
