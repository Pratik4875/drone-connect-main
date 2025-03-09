const {MongoClient}= require("mongodb")
require("dotenv").config()
const connString = process.env.MONGODB_URI;
const client = new MongoClient(connString)

let db;
async function mongo_db_connect(){
    let conn;
    try{
        conn = await client.connect()
        db = conn.db("droneconnect")
    }
    catch(e){
        console.error(e)
    }

    return db;

}

function get_db(){
    return db
}
module.exports = {mongo_db_connect,get_db}
