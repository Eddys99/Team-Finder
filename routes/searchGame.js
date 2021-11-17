var express = require('express');
var router = express.Router();
var listOfGames = require('../database/listOfGamesPosts');

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
    } else {
        listOfGames(my_division, my_language, my_region, game_type).then((response) => {
            if (response == 0) {
                res.render('searchGame', { message: "No games found", user: req.user.username });
            } else {
                res.render('searchGame', { items: response, user: req.user.username });
            }
        });
    }
});

module.exports = router;