const { MongoClient } = require('mongodb');
const { getNetworkTokenKey } = require('./get-balance');

const readClient = new MongoClient(process.env.READ_MONGO_URL);
const writeClient = new MongoClient(process.env.WRITE_MONGO_URL);

const readDb = readClient.db(process.env.READ_MONGO_DB);
const writeDb = writeClient.db(process.env.WRITE_MONGO_DB);

const accounts = readDb.collection('accounts');
const balanceHistory = writeDb.collection('balance_history');

const handlers = {
    init: async () => {
        await Promise.all([readClient.connect(), writeClient.connect()]);

        const balanceHistoryCollection = await writeDb
            .listCollections({ name: 'balance_history' })
            .toArray();
        if (balanceHistoryCollection.length === 0) {
            await writeDb.createCollection('balance_history');
        }
    },
    getUserCount: async () => accounts.countDocuments(),
    getInitialPage: async (network = 'mainnet', batchSize = 100) => {
        const count = await balanceHistory.countDocuments({
            [getNetworkTokenKey(network)]: { $exists: true },
        });
        return Math.floor(count / batchSize);
    },
    getUsers: async (page, batchSize = 100) => {
        const cursor = accounts
            .find()
            .project({
                _id: 1,
            })
            .limit(batchSize)
            .skip(batchSize * page);
        const items = await cursor.toArray();
        return items.map((i) => i._id);
    },
    saveUsers: async (users) => {
        const updates = users.map((u) => {
            const { userAddress: _id, ...update } = u;
            return {
                updateOne: {
                    filter: {
                        _id,
                    },
                    update: {
                        $set: {
                            updated_at: new Date(),
                            ...update,
                        },
                    },
                    upsert: true,
                },
            };
        });
        return await balanceHistory.bulkWrite(updates);
    },
};

module.exports = {
    handlers,
    collections: {
        accounts,
        balanceHistory,
    },
};
