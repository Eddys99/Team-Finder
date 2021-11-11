var express = require('express');
var router = express.Router();
const { client } = require('../database/db');

router.get('/', function(req, res) {
  if (req.user) {
      res.render('hostGame', { user: req.user.username });
  } else {
      req.flash("message", "Please log in or register");
      res.redirect('/login');
  }
});

router.post('/', function(req, res) {
  const hoster = req.user.username;
  const hoster_lane = req.user.main_lane;
  const hoster_region = req.user.region;
  const hoster_division = req.user.division;
  const hoster_spoken_language = req.user.spoken_language;
  const { game_type, game_description } = req.body;
  if(!game_type || !hoster_lane || !hoster_region || !hoster_division || !hoster_spoken_language) {
      req.flash('message', 'Please select game mode or complete your profile informations');
      res.redirect('/hostGame');
  } else {
      client.query(`INSERT INTO team_posts(hoster, hoster_lane, hoster_region, hoster_division, hoster_spoken_language, description, game_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, [hoster, hoster_lane, hoster_region, hoster_division, hoster_spoken_language, game_description, game_type ]);
      req.flash('message', 'Done !');
      res.redirect('/hostGame');
  }
});

module.exports = router;