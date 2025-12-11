// Create a new router
const express = require("express")
const router = express.Router()

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); 
    } 
}

// Handle routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/activities/add', function(req, res, next) {
    res.render('addactivity.ejs');
});

router.post('/activityadded', function (req, res, next) {
    const sqlquery = `
        INSERT INTO activities 
        (user_id, activity_type, duration_minutes, distance_km, activity_date, notes) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const userId = req.session.userId || 1; 

    const newrecord = [
        userId,
        req.body.activity_type,
        req.body.duration_minutes,
        req.body.distance_km,
        req.body.activity_date,
        req.body.notes,
    ];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            return next(err);
        }

        res.render('activityadded.ejs', {
            activityType: req.body.activity_type
        });
    });
});


router.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
          return res.redirect('./')
        }
        res.send('you are now logged out. <a href='+'./'+'>Home</a>');
        })
    })

module.exports = router
