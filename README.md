# Analytics for ClayStack users on different networks.

## Setup

-   Prepare an `.env` file with the following details:

```
READ_MONGO_URL='' # Mongo URI for the database where it reads the `accounts` collection
WRITE_MONGO_URL='' # Mongo URI for the database to save the `balance_history` collection

READ_MONGO_DB='' # Database name where the `accounts` collection exists
WRITE_MONGO_DB='' # Database name where to save the `balance_history` collection

JSON_RPC_URL='' # RPC URL of the ethereum node

RPC_USER='' # Username if JSON RPC is under basic authentication
RPC_PASS='' # Password of JSON RPC basic AuthN

```

-   `npm install`

## Usage

Running the script for various networks. Make sure the `JSON_RPC_URL` points to the correct network.

1. Ethereum mainnet - `NETWORK=mainnet npm start`
1. Polygon - `NETWORK=polygon npm start`
1. Fantom - `NETWORK=fantom npm start`

## How it works - 

1. The script will read users from the `accounts` table and batch them in a size of 100.
2. By default we start at index 0, but in case we already have some data in the `balance_history`, we will start at that index, to avoid duplicate calls.
3. It gets the balances of users, and saves in `balance_history` collection.
