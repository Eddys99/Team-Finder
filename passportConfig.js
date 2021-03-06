const LocalStrategy = require('passport-local').Strategy;
const { client } = require('./database/db');
const bcrypt = require('bcrypt');

function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        client.query(`SELECT * FROM users WHERE email = $1`, [email], function(err, results) {
            if (err) {
                throw err;
            }
            if (results.rows.length > 0) {
                const user = results.rows[0];
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Password is incorrect" });
                    }
                });
            } else {
                return done(null, false, { message: "Email is not registered" });
            }
        });
    };

    passport.use(
        new LocalStrategy({
            usernameField: "email",
            passwordField: "password"
        }, authenticateUser )
    );
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        client.query(`SELECT * FROM users WHERE id = $1`, [id], function(err, results) {
            if (err) {
                throw err;
            }
            return done(null, results.rows[0]);
        });
    });
}

module.exports = initialize;