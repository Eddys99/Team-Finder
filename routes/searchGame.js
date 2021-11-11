var express = require('express');
var router = express.Router();
const { client } = require('../database/db');

router.get('/', function(req, res) {
  if (req.user) {
      res.render('searchGame', { user: req.user.username });
  } else {
      req.flash("message", "Please log in or register");
      res.redirect('/login');
  }
});

router.post('/', function(req, res) {
  const my_division = req.user.division;
  const my_language = req.user.spoken_language;
  const my_region = req.user.region;
  const { game_type } = req.body;
  if (!game_type) {
      req.flash('message', 'Please select your desired game type');
      res.redirect('/searchGame');
  } else if (game_type == 'Ranked') {
      client.query(`SELECT * FROM team_posts WHERE hoster_division = $1 AND game_type = $2 AND hoster_spoken_language = $3 AND hoster_region = $4;`,[my_division, game_type, my_language, my_region], function(err, results) {
          if (err) {
              throw err;
          }
          if (results.rows.length > 0) {
              res.render('searchGame', { items: results.rows, user: req.user.username });
          } else {
              res.render('searchGame', { message: "No games found" });
          }
      });
  } else if (game_type != 'Ranked' && game_type != '') {
      client.query(`SELECT * FROM team_posts WHERE game_type = $1 AND hoster_spoken_language = $2 AND hoster_region = $3;`,[game_type, my_language, my_region], function(err, results) {
          if (err) {
              throw err;
          }
          if (results.rows.length > 0) {
              res.render('searchGame', { items: results.rows, user: req.user.username });
          } else {
              res.render('searchGame', { message: "No games found" });
          }
      });
  }
});

module.exports = router;