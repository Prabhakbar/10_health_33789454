// Create a new router
const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt')
const saltRounds = 10

const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {

        // If on university server, redirect there
        if (req.headers.host.includes("doc.gold.ac.uk")) {
            return res.redirect("/usr/435/users/login");
        }

        // Otherwise you're on localhost
        return res.redirect("/users/login");
    }
    next();
};

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', 
        [check('email').isEmail(), 
     check('username').isLength({ min: 5, max: 20})],
     check('password').isLength({ min: 8 })  
     ,
    function (req, res, next) {
const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./register')
    }
    else { 
    // saving data in database
    const plainPassword = req.body.password;

    // Hash the password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Handle any error from bcrypt
        if (err) {
            return next(err);
        }

        let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";
        
        let newrecord = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword  // Use the new hashed password
        ];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return next(err); // Pass the database error along
            }

            let response_message = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
            
            response_message += ' Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword

            // Only send the response ONCE
            res.render('registersuccess.ejs', {
                first: req.body.first,
                last: req.body.last,
                email: req.body.email
            });
 

        });
    });
}
});

router.get('/list', redirectLogin, function (req, res, next) {
        // Query to fetch non-sensitive user data (no hashedPassword)
        let sqlquery = "SELECT first_name, last_name, email, username FROM users"; 

        // Execute the query using the injected 'db' object
        db.query(sqlquery, (err, result) => {
            if (err) {
                return next(err);
            }
            res.render('listusers.ejs', { users: result }); 
        });
    });

    router.get('/login', function (req, res, next) {
    // Renders the 'login.ejs' file.
    res.render('login.ejs'); 
})

router.post('/loggedin', function (req, res, next) {
    const { username, password } = req.body;

    const sqlquery = "SELECT id, hashedPassword FROM users WHERE username = ?";

    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            return next(err);
        }

        if (result.length === 0) {
            // No such user
            return res.send('Login Failed: Invalid username or password.');
        }

        const user = result[0];               
        const hashedPassword = user.hashedPassword;

        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error("Bcrypt comparison error:", err);
                return next(err);
            }

            if (!isMatch) {
                return res.send('Login Failed: Invalid username or password.');
            }

            req.session.userId = user.id;
            req.session.username = username;

            res.render('loginsuccess.ejs', { username });
        });
    });
});


router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }

        res.clearCookie('connect.sid');

        // Send message or redirect
        res.send('You have been logged out. <a href="/">Return to Home</a>');
    });
});

module.exports = router
