var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');

// Routes
var home = require('./routes/home');
var register = require('./routes/register');
var login = require('./routes/login');
var logout = require('./routes/logout');
var profile = require('./routes/profile');
var userProfile = require('./routes/userProfile');

var app = express();

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', home);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/profile', profile);
app.use('/user', userProfile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
