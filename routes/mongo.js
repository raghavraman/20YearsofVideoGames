var db = require('../db');
var express = require('express')
var router = express.Router();

//Get all projects
router.get('/mongo', function(req, res) {
    res.render('mongo', {
        activeMongoDB: 'active'
    });
});


module.exports = router;