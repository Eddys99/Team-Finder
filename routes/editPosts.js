var express = require('express');
var router = express.Router();
var getMyPosts = require('../database/userPosts');
var deleteThisPost = require('../database/deletePost');

router.get('/', function(req, res) {
    if (req.user) {
        const username = req.user.username;
        getMyPosts(username).then((posts) => {
            if (posts == 0) {
                res.render('editPosts', { message: 'No posts yet.', user: req.user.username });
            } else {
                res.render('editPosts', { items: posts, user: req.user.username });
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
        deleteThisPost(id_of_post, username).then((response) => {
            if (response == 1) {
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