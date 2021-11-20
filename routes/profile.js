var express = require('express');
var router = express.Router();
var getMyPosts = require('../database/userPosts');
var deleteThisPost = require('../database/deletePost');
var profileFieldsValidation = require('../validator/profileFieldsValidation');

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

//Edit profile
router.get('/edit', function(req, res) {
    if (req.user) {
        res.render('editProfile');
    } else {
        req.flash("message", "Please log in or register");
        res.redirect('/login');
    }
});

router.post('/edit', function(req, res) {
    const username = req.user.username;
    let { division, division_tier, main_lane, main_champs, spoken_language, region} = req.body;
    profileFieldsValidation(division, division_tier, main_lane, main_champs, spoken_language, region, username);
    res.redirect('/profile');
});

//Edit posts
router.get('/editPosts', function(req, res) {
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

router.post('/editPosts', function(req, res) {
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