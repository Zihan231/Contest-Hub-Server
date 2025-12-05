// Env
require("dotenv").config();

// DB Connection
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_UserName}:${process.env.DB_Pass}@curd-service.6ebidhj.mongodb.net/?appName=Curd-Service`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let database;

async function connectDB() {
  try {
    await client.connect();
    database = client.db("ContestHub");
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (e) {
    console.log(e);
  }
}

function getUsersCollection() {
  if (!database) {
    throw new Error("Problem detected in Database");
  }
  return database.collection("users");
}
function getContestsCollection() {
  if (!database) {
    throw new Error("Problem detected in Database");
  }
  return database.collection("contests");
}

module.exports = {
  connectDB,
  getUsersCollection,
  getContestsCollection,
};
