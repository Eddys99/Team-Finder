function postAnnounceFields(game_type, hoster_lane, hoster_region, hoster_division, hoster_spoken_language) {
    if(!game_type || !hoster_lane || !hoster_region || !hoster_division || !hoster_spoken_language) {
        return 0;
    } else {
        return 1;
    }
}

module.exports = postAnnounceFields;