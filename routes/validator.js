var express = require('express');
var router = express.Router();
const { client } = require('../database/db');
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
  let errors = [];
  if (!email || !username || !password || !password2) {
      errors.push({ message: "Please enter all fields." });
  }
  if (password.length < 5) {
      errors.push({ message: "Password should be at least 5 characters." });
  }
  if (password != password2) {
      errors.push({ message: "Passwords do not match." });
  }
  if (errors.length > 0) {
      res.render('register', { errors });
  } else {
      let hashedPassword = await bcrypt.hash(password, 10);
      client.query(`SELECT * FROM users WHERE email = $1 OR username = $2`, [email, username],
          function (err, results) {
              if (err) {
                  throw err;
              }
              if (results.rows.length > 0) {
                  errors.push({ message: "Email or Username already used." });
                  res.render('register', { errors });
              } else {
                  client.query(`INSERT INTO users (email, username, password)
                      VALUES ($1, $2, $3)
                      RETURNING id, password`, [email, username, hashedPassword],
                      function (err,results) {
                          if (err) {
                              throw err;
                          }
                          req.flash('message', "You are now registered! Please log in.");
                          res.redirect('/login');
                      }
                  )
              }
          }
      );
  }
});

module.exports = router;