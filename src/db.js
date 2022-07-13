require('dotenv').config();

const { MongoClient } = require('mongodb');
const readClient = new MongoClient(process.env.READ_MONGO_URL);
const writeClient = new MongoClient(process.env.WRITE_MONGO_URL);

const readDb = readClient.db(process.env.READ_MONGO_DB);
const writeDb = writeClient.db(process.env.WRITE_MONGO_DB);

const accounts = readDb.collection('accounts');
const balanceHistory = writeDb.collection('balance_history');

const handlers = {
    init: async () => {
        await Promise.all([readClient.connect(), writeClient.connect()]);
    },
    getUserCount: async () => accounts.countDocuments(),
    getInitialPage: async (batchSize = 100) => {
        const count = await balanceHistory.countDocuments();
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
