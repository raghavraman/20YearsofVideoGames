var db = require('../db');
var express = require('express')
var router = express.Router();

//Get all projects
router.get('/neo', function(req, res) {
    res.render('neo', {
        activeNeo: 'active'
    });
});


module.exports = router;