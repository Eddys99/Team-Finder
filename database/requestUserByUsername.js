const { client } = require('./db');

function getUserByUsername(username) {
    return new Promise(function(resolve, reject) {
        client.query(`SELECT * FROM users WHERE username = $1`, [username], function (err, results) {
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

module.exports = getUserByUsername;