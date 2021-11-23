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

function getListOfGames(my_username, my_division, my_language, my_region, game_type) {
    var queryString;
    var valueFields;
    if (game_type == 'Ranked') {
        queryString = `SELECT * FROM team_posts WHERE hoster_division = $1 AND game_type = $2 AND hoster_spoken_language = $3 AND hoster_region = $4 AND hoster != $5;`;
        valueFields = [my_division, game_type, my_language, my_region, my_username];
    } else {
        queryString = `SELECT * FROM team_posts WHERE game_type = $1 AND hoster_spoken_language = $2 AND hoster_region = $3 AND hoster != $4;`;
        valueFields = [game_type, my_language, my_region, my_username];
    }
    return new Promise(function(resolve, reject) {
        client.query(queryString, valueFields, function(err, results) {
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

function postAnnounce(hoster, hoster_lane, hoster_region, hoster_division, hoster_spoken_language, game_type, game_description) {
    client.query(`INSERT INTO team_posts(hoster, hoster_lane, hoster_region, hoster_division, hoster_spoken_language, description, game_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`, [hoster, hoster_lane, hoster_region, hoster_division, hoster_spoken_language, game_description, game_type ]);
}

function getUserPosts(username) {
    return new Promise(function (resolve, reject) {
        client.query(`SELECT * FROM team_posts WHERE hoster = $1`, [username], function (err, results) {
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

module.exports = { 
    deleteThisPost,
    getListOfGames,
    postAnnounce,
    getUserPosts
}