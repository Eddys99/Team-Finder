const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.get('/login', function(req, res) {
    res.render('login');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));