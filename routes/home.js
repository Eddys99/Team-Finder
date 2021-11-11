var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.user) {
      res.render('home', { user: req.user.username });
  } else {
      res.redirect('/login');
  }
});

module.exports = router;
