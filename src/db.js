require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URL);

(async () => {
    try {
        await client.connect();

        await client.db('admin').command({ ping: 1 });
        console.log('Connected successfully to server');

        const db = client.db('events');
        const accounts = db.collection('accounts');

        const cursor = accounts.find().project({
            _id: 1,
        });
        await cursor.forEach(console.dir);
    } finally {
        await client.close();
    }
})();
