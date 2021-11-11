var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    if (req.user) {
        req.logOut();
        req.flash("message", "You logged out.");
        res.redirect('/login');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;