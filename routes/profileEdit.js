var express = require('express');
var router = express.Router();
var profileFieldsValidation = require('../validator/profileFieldsValidation');

router.get('/', function(req, res) {
  if (req.user) {
      res.render('editProfile');
  } else {
      req.flash("message", "Please log in or register");
      res.redirect('/login');
  }
});

router.post('/', function(req, res) {
  const username = req.user.username;
  let { division, division_tier, main_lane, main_champs, spoken_language, region} = req.body;
  profileFieldsValidation(division, division_tier, main_lane, main_champs, spoken_language, region, username);
  res.redirect('/profile');
});

module.exports = router;