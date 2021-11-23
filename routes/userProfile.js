var express = require('express');
var router = express.Router();
var getUser = require('../database/requestUserByUsername');

router.get('/:username', function(req, res) {
    if (req.user) {
        let username = req.params.username;
        getUser(username).then((response) => {
            res.render('userProfile', { reqUser: response, myUser: req.user.username });
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;