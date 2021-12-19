const { client } = require('./db');

function updateProfileFields(field, fieldValue, username) {
    client.query(`UPDATE users SET ${field} = $1 WHERE username = $2 `, [fieldValue, username],
        function(err, results) {
            if (err) {
                throw err;
            }
        }
    );
}

module.exports = updateProfileFields;