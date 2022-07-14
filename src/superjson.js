const { ethers } = require('hardhat');
const superjson = require('superjson');

superjson.registerCustom(
    {
        isApplicable: (v) => ethers.BigNumber.isBigNumber(v),
        serialize: (v) => v.toJSON(),
        deserialize: (v) => ethers.BigNumber.from(v),
    },
    'BigNumber',
);

module.exports = superjson;
