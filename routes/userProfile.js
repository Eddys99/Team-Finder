var express = require('express');
var router = express.Router();
var getUser = require('../database/requestUserById');

router.get('/:id', function(req, res) {
    if (req.user) {
        let id = req.params.id;
        getUser(id).then((response) => {
            res.render('userProfile', { reqUser: response, myUser: req.user.username });
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;