const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

console.log('🧪 URI:', process.env.MONGODB_URI);

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectToDB() {
  try {
    await client.connect();
    db = client.db('cse341');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
  }
}

function getDb() {
  return db;
}

module.exports = { connectToDB, getDb };
