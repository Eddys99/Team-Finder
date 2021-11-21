var express = require('express');
var router = express.Router();
var listOfGames = require('../database/game posts/listOfGamesPosts');
var postAnnounceFieldsValidation = require('../validator/game posts/postAnnounceFields');
var postGameAnnounce = require('../database/game posts/postHostGame');

router.get('/', function(req, res) {
  if (req.user) {
      res.render('home', { user: req.user.username });
  } else {
      res.redirect('/login');
  }
});

router.get('/hostGame', function(req, res) {
  if (req.user) {
      res.render('hostGame', { user: req.user.username });
  } else {
      req.flash("message", "Please log in or register");
      res.redirect('/login');
  }
});

//Host Game
router.post('/hostGame', function(req, res) {
  const hoster = req.user.username;
  const hoster_lane = req.user.main_lane;
  const hoster_region = req.user.region;
  const hoster_division = req.user.division;
  const hoster_spoken_language = req.user.spoken_language;
  const { game_type, game_description } = req.body;
  if (postAnnounceFieldsValidation(game_type, hoster_lane, hoster_region, hoster_division, hoster_spoken_language) == 1) {
    postGameAnnounce(hoster, hoster_lane, hoster_region, hoster_division, hoster_spoken_language, game_type, game_description);
    req.flash('message', 'Done !');
    res.redirect('/hostGame');
  } else {
    req.flash('message', 'Please select game mode or complete your profile informations');
    res.redirect('/hostGame');
  }
});

//Search Game
router.get('/searchGame', function(req, res) {
  if (req.user) {
      res.render('searchGame', { user: req.user.username });
  } else {
      req.flash("message", "Please log in or register");
      res.redirect('/login');
  }
});

router.post('/searchGame', function(req, res) {
    const my_username = req.user.username;
    const my_division = req.user.division;
    const my_language = req.user.spoken_language;
    const my_region = req.user.region;
    const { game_type } = req.body;
    if (!game_type) {
        req.flash('message', 'Please select your desired game type');
        res.redirect('/searchGame');
    } else {
        listOfGames(my_username, my_division, my_language, my_region, game_type).then((response) => {
            if (response == 0) {
                res.render('searchGame', { message: "No games found", user: req.user.username });
            } else {
                res.render('searchGame', { items: response, user: req.user.username });
            }
        });
    }
});

module.exports = router;
