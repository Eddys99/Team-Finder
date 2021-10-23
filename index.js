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
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());


//GET
app.get('/', function(req, res) {
    res.render('home');
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/profile', function(req, res) {
    res.render('profile', { user: req.user.username });
});

app.get('/logout', function(req, res) {
    req.logOut();
    req.flash("succesMsg", "You logged out.");
    res.redirect('/login');
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
        res.render('register', { errors: errors  });
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
                            req.flash('succesMsg', "You are now registered! Please log in.");
                            res.redirect('/login');
                        }
                    )
                }
            }
        );
    }
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
