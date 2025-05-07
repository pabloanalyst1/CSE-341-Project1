const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
console.log('🧪 URI:', process.env.MONGODB_URI); //comprobar que obtenga el url


const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true
});

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
