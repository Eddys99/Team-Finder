const { client } = require('../db');

function storeAccountInDatabase(email, username, hashedPassword) {
    return new Promise(function (resolve, reject) {
        client.query(`SELECT * FROM users WHERE email = $1 OR username = $2`, [email, username],
            function (err, results) {
                if (err) {
                    throw err;
                }
                if (results.rows.length > 0) {
                    resolve(0);
                } else {
                    client.query(`INSERT INTO users (email, username, password) VALUES ($1, $2, $3) 
                    RETURNING id, password`, [email, username, hashedPassword],
                        function (err,results) {
                            if (err) {
                                throw err;
                            } else {
                                resolve(1);
                            }
                        }
                    );
                }
            }
        );
    });
}

module.exports = storeAccountInDatabase;