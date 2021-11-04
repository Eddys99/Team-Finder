const express = require('express');
const app = express();
const { client } = require('./database');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

//PASSPORT
const initializePassport = require('./passportConfig');
const { render } = require('pug');
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());


//GET
app.get('/', function(req, res) {
    if (req.user) {
        res.render('home', { user: req.user.username });
    } else {
        res.redirect('/login');
    }
});

app.get('/register', function(req, res) {
    if (req.user) {
        res.redirect('/profile');
    } else {
        res.render('register');
    }
});

app.get('/login', function(req, res) {
    if (req.user) {
        res.redirect('/profile');
    } else {
        res.render('login');
    }
});

app.get('/profile', function(req, res) {
    if (req.user) {
        res.render('profile', { 
            user: req.user.username, 
            division: req.user.division,
            lanes: req.user.main_lanes,
            champs: req.user.main_champs,
            language: req.user.spoken_language,
            region: req.user.region
        });
    } else {
        req.flash("message", "Please log in or register");
        res.redirect('/login');
    }
});

app.get('/logout', function(req, res) {
    req.logOut();
    req.flash("message", "You logged out.");
    res.redirect('/login');
});

app.get('/profile/edit', function(req, res) {
    if (req.user) {
        res.render('editProfile');
    } else {
        req.flash("message", "Please log in or register");
        res.redirect('/login');
    }
});

app.get('/hostGame', function(req, res) {
    if (req.user) {
        res.render('hostGame', { user: req.user.username });
    } else {
        req.flash("message", "Please log in or register");
        res.redirect('/login');
    }
});

app.get('/searchGame', function(req, res) {
    if (req.user) {
        res.render('searchGame', { user: req.user.username });
    } else {
        req.flash("message", "Please log in or register");
        res.redirect('/login');
    }
});

//POST
app.post('/register', async function(req, res) {
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

app.post('/profile/edit', function(req, res) {
    const username = req.user.username;
    let { division, division_tier, main_lanes, main_champs, spoken_language, region} = req.body;
    if (division != '' && division_tier != '') {
        division = division + ' ' + division_tier;
        client.query(`UPDATE users SET division = $1 WHERE username = $2 `, [division, username]);
    }
    if (main_lanes != '') {
        client.query(`UPDATE users SET main_lanes = $1 WHERE username = $2 `, [main_lanes, username]);
    }
    if (main_champs != '') {
        client.query(`UPDATE users SET main_champs = $1 WHERE username = $2 `, [main_champs, username]);
    }
    if (spoken_language != '') {
        client.query(`UPDATE users SET spoken_language = $1 WHERE username = $2 `, [spoken_language, username]);
    }
    if (region != '') {
        client.query(`UPDATE users SET region = $1 WHERE username = $2 `, [region, username]);
    }
    res.redirect('/profile');
});

app.post('/hostGame', function(req, res) {
    const username = req.user.username;
    const host_division = req.user.division;
    const { game_type, game_description } = req.body;
    if(!game_type) {
        req.flash('message', 'Please select game mode');
        res.redirect('/hostGame');
    } else {
        client.query(`INSERT INTO team_posts(hoster, team_division, game_type, description)
        VALUES ($1, $2, $3, $4)`, [username, host_division, game_type, game_description]);
        req.flash('message', 'Done !');
        res.redirect('/hostGame');
    }
});

app.post('/searchGame', function(req, res) {
    const my_division = req.user.division;
    const { game_type } = req.body;
    if (!game_type) {
        req.flash('message', 'Please select your desired game type');
        res.redirect('/searchGame');
    } else if (game_type == 'Ranked') {
        client.query(`SELECT * FROM team_posts WHERE team_division = $1 AND game_type = $2;`,[my_division, game_type], function(err, results) {
            if (err) {
                throw err;
            }
            res.render('searchGame', { items: results.rows, user: req.user.username });
        });
        console.log(1);
    } else if (game_type != 'Ranked' && game_type != '') {
        client.query(`SELECT * FROM team_posts WHERE game_type = $1;`,[game_type], function(err, results) {
            if (err) {
                throw err;
            }
            res.render('searchGame', { items: results.rows, user: req.user.username });
        });
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
