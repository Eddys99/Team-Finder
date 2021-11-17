const { client } = require('./db');

function postAnnounce(hoster, hoster_lane, hoster_region, hoster_division, hoster_spoken_language, game_type, game_description) {
    client.query(`INSERT INTO team_posts(hoster, hoster_lane, hoster_region, hoster_division, hoster_spoken_language, description, game_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`, [hoster, hoster_lane, hoster_region, hoster_division, hoster_spoken_language, game_description, game_type ]);
}

module.exports = postAnnounce;