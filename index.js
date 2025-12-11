// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2');
var session = require ('express-session')

const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express()
const port = 8000


// Create an input sanitizer
app.use(expressSanitizer());

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))
// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

app.locals.shopData = { shopName: "HealthTrack" };

const db = mysql.createPool({
    host: 'localhost',
    user: 'health_app',
    password: 'qwertyuiop',
    database: 'health',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

    
// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

const activitiesRoutes = require('./routes/activities');
app.use('/activities', activitiesRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))



