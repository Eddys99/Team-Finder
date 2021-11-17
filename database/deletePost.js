const { client } = require('./db');

function deleteThisPost(id_of_post, username) {
    return new Promise(function(resolve, reject) {
        client.query(`SELECT * FROM team_posts WHERE id_post = $1 and hoster = $2`, [id_of_post, username], function(err, results) {
            if (err) {
                throw err;
            }
            if (results.rows.length > 0) {
                client.query(`DELETE FROM team_posts WHERE id_post = $1`, [id_of_post]);
                resolve(1);
            } else {
                resolve(0);
            }
        });
    });
}

module.exports = deleteThisPost;