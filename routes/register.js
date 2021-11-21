var express = require('express');
var router = express.Router();
var checkFields = require('../validator/register/registrationFieldsCheck');
var registrationAccount = require('../database/register/registrationAccountStore');
const bcrypt = require('bcrypt');

router.get('/', function(req, res) {
  if (req.user) {
      res.redirect('/profile');
  } else {
      res.render('register');
  }
});

router.post('/', async function(req, res) {
    let { email, username, password, password2 } = req.body;
    if (checkFields(email, username, password, password2) == 0) {
        let hashedPassword = await bcrypt.hash(password, 10);
        registrationAccount(email, username, hashedPassword).then((response) => {
            if (response == 1) {
                req.flash('message', 'You have registered succesfully.');
                res.redirect('/login');
            } else {
                res.render('register', { message: 'Email or Username already used.'});
            }
        });
    } else {
        res.render('register', { errors: checkFields(email, username, password, password2) });
    }
});

module.exports = router;