var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.user) {
      res.render('profile', { 
          user: req.user.username, 
          division: req.user.division,
          lanes: req.user.main_lane,
          champs: req.user.main_champs,
          language: req.user.spoken_language,
          region: req.user.region
      });
  } else {
      req.flash("message", "Please log in or register");
      res.redirect('/login');
  }
});

module.exports = router;