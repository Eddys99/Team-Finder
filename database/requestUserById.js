const { client } = require('./db');

function getUserById(id) {
    return new Promise(function(resolve, reject) {
        client.query(`SELECT * FROM users WHERE id = ${id}`, function (err, results) {
            if (err) {
                throw err;
            }
            if (results.rows.length > 0) {
                resolve(results.rows);
            } else {
                resolve(0);
            }
        });
    });
}

module.exports = getUserById;