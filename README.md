# Analytics for ClayStack users on different networks.

## Setup

-   Prepare an `.env` file with the following details:

```
MONGO_URL=''
INFURA_PROJECT_ID=''

```

-   `npm install`

## Usage

1. Configure the `hardhat.config.js` file to use the desired forking config. Defaults to `mainnet` by default.
2. Run a hardhat node by `npm run run-node`. Will start a local node.
3. Run the script by `npm run run-job`.

## How it works

1. The script will read users from the `accounts` table and batch them in a size of 100.
2. By default we start at index 0, but in case we already have some data in the `balance_history`, we will start at that index, to avoid duplicate calls.
3. It gets the balances of users, and saves in `balance_history` collection.
