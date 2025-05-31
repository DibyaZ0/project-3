import { MongoClient, ServerApiVersion  } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const atlasuri = "mongodb+srv://dibyajyotisahoo1711:Lucky1234@cluster0.fjwjzld.mongodb.net/hm_db?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(uri);
const dbName = 'hm_db';

const atlasClient = new MongoClient(atlasuri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

var db;
var atlasDb;

export async function connectDB() {
    if (!db) {
      try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connected successfully');
      } catch (err) {
      console.error('Read all error:', err);
      }
    }
}

export async function connectAtlasDB() {
  if (!atlasDb) {
    await atlasClient.connect();
    atlasDb = atlasClient.db(dbName);
    console.log('Connected successfully');
  }
}

export function getDB() {
  if (!atlasDb) throw new Error('DB connection error');
  return atlasDb;
}

export function getAtlasDB() {
  if (!atlasDb) throw new Error('DB connection error');
  return atlasDb;
}