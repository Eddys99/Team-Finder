const { client } = require('../database/db');

function checkFields(email, username, password, password2) {
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
        return errors;
    }
    return 0;
}

module.exports = checkFields;