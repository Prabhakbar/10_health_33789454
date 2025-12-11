const express = require("express");
const router = express.Router();

router.get('/list', function(req, res, next) {
    const sqlquery = `
        SELECT a.*, u.username 
        FROM activities a 
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY activity_date DESC
    `;

    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("listactivities.ejs", { activities: result });
    });
});

// Show search form
router.get('/search', function(req, res, next) {
    res.render("searchactivities.ejs");
});

router.get('/search-result', function(req, res, next) {
    const searchText = '%' + req.query.search_text + '%';
    const sqlquery = `
        SELECT a.*, u.username 
        FROM activities a 
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.activity_type LIKE ?
        ORDER BY activity_date DESC
    `;

    db.query(sqlquery, [searchText], (err, result) => {
        if (err) {
            return next(err);
        }
        res.render("listactivities.ejs", { activities: result });
    });
});

module.exports = router;
