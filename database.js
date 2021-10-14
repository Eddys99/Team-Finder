const { Client } = require('pg');
const connectionString = 'postgresql://postgres:admin@localhost:5432/postgres';

const client = new Client({
    connectionString,
});
client.connect();

client.query('SELECT * FROM Users', (err, result) => {
    if (!err) {
        console.log(result.rows);
    } else {
        console.log('Nu stiu ce are');
    }
  client.end();
})