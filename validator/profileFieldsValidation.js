var updateField = require('../database/profileFieldsUpdate');

function validateFields(division, division_tier, main_lane, main_champs, spoken_language, region, username) {
    if (division != '' && division_tier != '') {
        var field = 'division';
        division = division + ' ' + division_tier;
        updateField(field, division, username);
    }
    if (main_lane != '') {
        var field = 'main_lane';
        updateField(field, main_lane, username);
    }
    if (main_champs != '') {
        var field = 'main_champs';
        updateField(field, main_champs, username);
    }
    if (spoken_language != '') {
        var field = 'spoken_language';
        updateField(field, spoken_language, username);
    }
    if (region != '') {
        var field = 'region';
        updateField(field, region, username);
    }
}

module.exports = validateFields;