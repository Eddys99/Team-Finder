var express = require('express');
var router = express.Router();
const { client } = require('../database/db');

router.get('/', function(req, res) {
  if (req.user) {
      const username = req.user.username;
      client.query(`SELECT * FROM team_posts WHERE hoster = $1`, [username], function (err, results) {
          if (err) {
              throw err;
          }
          if (results.rows.length > 0) {
              res.render('editPosts', { items: results.rows , user: req.user.username });
          } else {
              res.render('editPosts', { message: 'No posts yet' , user: req.user.username });
          }
      });
  } else {
      res.redirect('/login');
  }
});

router.post('/', function(req, res) {
    const username = req.user.username;
    const { id_of_post } = req.body;
    if (id_of_post != '') {
        client.query(`SELECT * FROM team_posts WHERE id_post = $1 and hoster = $2`, [id_of_post, username], function(err, results) {
            if (err) {
                throw err;
            }
            if (results.rows.length > 0) {
                client.query(`DELETE FROM team_posts WHERE id_post = $1`, [id_of_post]);
                req.flash('message', 'Post deleted !')
                res.redirect('/profile/editPosts');
            } else {
                req.flash('message', 'Post not found !');
                res.redirect('/profile/editPosts');
            }
        });
    } else {
        req.flash('message', 'Please introduce the ID of post');
        res.redirect('/profile/editPosts');
    }
});

module.exports = router;