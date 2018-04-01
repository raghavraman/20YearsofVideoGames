var db = require('../db');
var express = require('express')
var router = express.Router();

router.get('/relational',function(req,res){
    res.render('relational',{activeRelational:"active"});
});


router.get('/relquery1', function(req, res) {

    db.query("SELECT G.genre as name, AVG(F.average_score) AS Freq FROM game_dimension G, fact F WHERE G.game_id = F.game_id GROUP BY G.genre", function(err, results, feilds) {
         if (err) {
                console.error(err);
                res.statusCode = 500;
                res.send({
                    result: 'error',
                    err:    err.code
                });
            }
            
            res.send(results);
        }); 
});



module.exports = router;