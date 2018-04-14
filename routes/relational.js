var db = require('../db');
var express = require('express')
var router = express.Router();

router.get('/relational',function(req,res){
    res.render('mysql',{activeRelational:"active"});
});

//What are the top 25 rated games in the past 20 years?
router.get('/mysqlquery1', function(req, res) {

    db.query("SELECT G.title AS label, F.average_score AS value FROM game_dimension G, fact F WHERE F.game_id = G.game_id GROUP BY G.title, F.average_score, F.game_id ORDER BY F.average_score DESC LIMIT 25", function(err, results, feilds) {
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

//What are the games with score>8, editor_choice=y 
router.get('/mysqlquery2', function(req, res) {

    db.query("SELECT G.title AS label, F.average_score AS value, F.count_editor_choice AS editor_choice FROM game_dimension G, fact F WHERE F.game_id = G.game_id AND F.average_score > 8 AND F.count_editor_choice = 1", function(err, results, feilds) {
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


router.get('/mysqlquery3', function(req, res) {

    db.query("SELECT genre as label, count(game_id) as value FROM game_dimension GROUP BY genre", function(err, results, feilds) {
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

router.get('/mysqlquery4', function(req, res) {

    db.query("SELECT G.genre as label, AVG(F.average_score) AS value FROM game_dimension G, fact F WHERE G.game_id = F.game_id GROUP BY G.genre", function(err, results, feilds) {
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

router.get('/mysqlquery5', function(req, res) {

    db.query("SELECT G.genre as label, AVG(F.average_score) AS value, COUNT(F.count_editor_choice) AS number_of_editor_choices FROM game_dimension G, fact F WHERE G.game_id = F.game_id AND F.count_editor_choice = 1 GROUP BY G.genre LIMIT 5", function(err, results, feilds) {
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
//--What are the top 5 popular genres based on editor's choice ? --
router.get('/mysqlquery6', function(req, res) {

    db.query("SELECT G.genre as label, AVG(F.average_score) AS value FROM game_dimension G, fact F WHERE G.game_id = F.game_id GROUP BY G.genre LIMIT 5", function(err, results, feilds) {
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


// // -- What are the average scores of genres by years? --
// router.get('/mysqlquery7', function(req, res) {

//     db.query("SELECT T.year label, G.genre, AVG(F.average_score) as value AS Average_Score FROM game_dimension G, time_dimension T, fact F WHERE F.time_id = T.time_id AND G.game_id = F.game_id GROUP BY T.year, G.genre", function(err, results, feilds) {
//          if (err) {
//                 console.error(err);
//                 res.statusCode = 500;
//                 res.send({
//                     result: 'error',
//                     err:    err.code
//                 });
//             }
            
//             res.send(results);
//         }); 
// });


//How has the popularity of genre 'Adventure' has changed over the last 20 years? --

router.get('/mysqlquery8', function(req, res) {

    var genre = req.query.genre;
    db.query("SELECT T.year label, G.genre, AVG(F.average_score) AS value FROM game_dimension G, time_dimension T, fact F WHERE F.time_id = T.time_id AND G.game_id = F.game_id AND G.genre = '"+genre+"' GROUP BY T.year, G.genre", function(err, results, feilds) {
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

//--What is the most popular genre with respect to a platform? --
router.get('/mysqlquery9', function(req, res) {

    var platform = req.query.platform;
    db.query("SELECT G.platform, G.genre as label, COUNT(F.game_id) as value FROM game_dimension G, fact F WHERE F.game_id = G.game_id AND G.platform = '"+platform+"'GROUP BY G.platform, G.genre", function(err, results, feilds) {
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

//Which platforms has the avg rating of games of more than 7.0?
router.get('/mysqlquery10', function(req, res) {

    var rating = req.query.rating;
    db.query("SELECT G.platform as label, AVG(F.average_score) as value FROM game_dimension G, fact F WHERE G.game_id = F.game_id GROUP BY G.platform HAVING value > "+rating, function(err, results, feilds) {
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

//What number of games are released on each platform annually?--

router.get('/mysqlquery11', function(req, res) {

    var platform = req.query.platform;
    db.query("SELECT T.year as label, COUNT(F.game_id) as value FROM game_dimension G, time_dimension T, fact F WHERE F.time_id = T.time_id AND G.game_id = F.game_id and G.platform = '"+platform+"' GROUP BY T.year, G.platform", function(err, results, feilds) {
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

// How many games were released in each year?--

router.get('/mysqlquery12', function(req, res) {

    db.query("SELECT T.year as label, COUNT(F.game_id) AS value FROM time_dimension T, fact F WHERE F.time_id = T.time_id GROUP BY T.year", function(err, results, feilds) {
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

// How many games were released each year more than a particular rating?(high rated is rating >=8 --



router.get('/mysqlquery13', function(req, res) {

    var rating = req.query.rating;
    db.query('SELECT T.year as label, COUNT(F.game_id) AS value FROM time_dimension T, fact F WHERE F.time_id = T.time_id AND F.average_score >= '+rating+' GROUP BY T.year', function(err, results, feilds) {
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
router.get('/mysqlquery14', function(req, res) {

    db.query("SELECT G.genre as label, AVG(F.average_score) AS value FROM game_dimension G, fact F WHERE G.game_id = F.game_id GROUP BY G.genre LIMIT 5", function(err, results, feilds) {
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
router.get('/mysqlquery15', function(req, res) {

    db.query("SELECT G.genre as label, AVG(F.average_score) AS value FROM game_dimension G, fact F WHERE G.game_id = F.game_id GROUP BY G.genre LIMIT 5", function(err, results, feilds) {
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
router.get('/mysqlquery16', function(req, res) {

    db.query("SELECT G.genre as label, AVG(F.average_score) AS value FROM game_dimension G, fact F WHERE G.game_id = F.game_id GROUP BY G.genre LIMIT 5", function(err, results, feilds) {
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
router.get('/mysqlquery17', function(req, res) {

    db.query("SELECT G.genre as label, AVG(F.average_score) AS value FROM game_dimension G, fact F WHERE G.game_id = F.game_id GROUP BY G.genre LIMIT 5", function(err, results, feilds) {
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