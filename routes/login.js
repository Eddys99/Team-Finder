var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/', function(req, res) {
  if (req.user) {
      res.redirect('/profile');
  } else {
      res.render('login');
  }
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

module.exports = router;
