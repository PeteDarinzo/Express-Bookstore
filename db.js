/** Database config for database. */


const { Client } = require("pg");
const { DB_URI } = require("./config");

// let db = new Client({
//   connectionString: DB_URI
// });

const client = new Client(DB_URI);

// db.connect();

client.connect();

// module.exports = db;

module.exports = client;