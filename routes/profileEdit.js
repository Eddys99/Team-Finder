var express = require('express');
var router = express.Router();
const { client } = require('../database/db');

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
  if (division != '' && division_tier != '') {
      division = division + ' ' + division_tier;
      client.query(`UPDATE users SET division = $1 WHERE username = $2 `, [division, username]);
  }
  if (main_lane != '') {
      client.query(`UPDATE users SET main_lane = $1 WHERE username = $2 `, [main_lane, username]);
  }
  if (main_champs != '') {
      client.query(`UPDATE users SET main_champs = $1 WHERE username = $2 `, [main_champs, username]);
  }
  if (spoken_language != '') {
      client.query(`UPDATE users SET spoken_language = $1 WHERE username = $2 `, [spoken_language, username]);
  }
  if (region != '') {
      client.query(`UPDATE users SET region = $1 WHERE username = $2 `, [region, username]);
  }
  res.redirect('/profile');
});

module.exports = router;