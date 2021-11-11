const { Client } = require('pg');
const connectionString = 'postgresql://postgres:admin@localhost:5432/postgres';

const client = new Client({
    connectionString,
});
client.connect();

module.exports = { client };