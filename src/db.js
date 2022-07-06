require('dotenv').config();
const dateFns = require('date-fns');
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.LOCAL_MONGO_URL);

const BATCH_SIZE = 10;

const db = client.db('claystack');

const accounts = db.collection('accounts');
const balanceHistory = db.collection('balance_history');

const init = async () => {
    await client.connect();

    const getUsers = async (page) => {
        const cursor = accounts
            .find()
            .project({
                _id: 1,
            })
            .limit(BATCH_SIZE)
            .skip(BATCH_SIZE * page);
        const items = await cursor.toArray();
        return items.map((i) => i._id);
    };

    const initHistoryCollection = async () => {
        const exists = (await db.listCollections({ name: 'balance_history' }).toArray()).length > 0;
        if (exists) return;
        await db.createCollection('balance_history', {
            timeseries: {
                timeField: 'timestamp',
                metaField: 'metadata',
                granularity: 'hours',
            },
        });
    };

    return { db, accounts, getUsers, initHistoryCollection };
};

const handlers = {
    saveUsers: async (users) => {
        const pr = users.map((u) =>
            balanceHistory.updateOne(
                {
                    userAddress: u.userAddress,
                    timestamp: dateFns.startOfDay(new Date()),
                },
                {
                    $set: {
                        ...u,
                        timestamp: dateFns.startOfDay(new Date()),
                    },
                },
                {
                    upsert: true,
                },
            ),
        );
        await Promise.all(pr);
    },
};

/* (async () => {
    try {
        const { initHistoryCollection, getUsers } = await init();
        await initHistoryCollection();
        return;
        const p1 = await getUsers(0);
        console.log('p1:', p1);
    } finally {
        await client.close();
    }
})();
 */

module.exports = {
    handlers,
};
