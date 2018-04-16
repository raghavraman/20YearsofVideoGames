var mongoose = require('mongoose'),     //mongo
    fs = require('fs'),                 //mongo
var mysqldb = require('../db');
var express = require('express')
var router = express.Router();
var db = require('cypher-stream')('bolt://127.0.0.1:7687', 'neo4j', 'admin');
 

router.get('/analysis', function (req, res) {
  res.render('analysis',{activeAnaly:"active"});
})

router.get('/performmysql1', function(req, res) {
	var start = new Date().getTime();
	mysqldb.query("SELECT G.title AS label, F.average_score AS value FROM game_dimension G, fact F WHERE F.game_id = G.game_id GROUP BY G.title, F.average_score, F.game_id ORDER BY F.average_score DESC LIMIT 25", function(err, results, feilds) {
         if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
        }
		var elapsed = new Date().getTime() - start;
		var answer ={"result":elapsed};
        res.send(answer);
    }); 
});

router.get('/performmysqlV1', function(req, res) {
	var start = new Date().getTime();
	mysqldb.query("SELECT title, avg_rating FROM GameVSscore LIMIT 25", function(err, results, feilds) {
         if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
        }
		var elapsed = new Date().getTime() - start;
		var answer ={"result":elapsed};
        res.send(answer);
    }); 
});

router.get('/performmysql2', function(req, res) {
	var start = new Date().getTime();
	mysqldb.query("SELECT G.genre, AVG(F.average_score) AS Average_Score FROM game_dimension G, fact F WHERE G.game_id = F.game_id GROUP BY G.genre ORDER BY Average_Score DESC LIMIT 5", function(err, results, feilds) {
         if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
        }
		var elapsed = new Date().getTime() - start;
		var answer ={"result":elapsed};
        res.send(answer);
    }); 
});

router.get('/performmysqlV2', function(req, res) {
	var start = new Date().getTime();
	mysqldb.query("SELECT genre, avg_rating FROM GenreVSScore LIMIT 5", function(err, results, feilds) {
         if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
        }
		var elapsed = new Date().getTime() - start;
		var answer ={"result":elapsed};
        res.send(answer);
    }); 
});


router.get('/performmysql3', function(req, res) {
	var start = new Date().getTime();
	mysqldb.query("SELECT G.platform, AVG(F.average_score) AS Average_Score FROM game_dimension G, fact F WHERE G.game_id = F.game_id GROUP BY G.platform ORDER BY Average_Score DESC LIMIT 5", function(err, results, feilds) {
         if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
        }
		var elapsed = new Date().getTime() - start;
		var answer ={"result":elapsed};
        res.send(answer);
    }); 
});

router.get('/performmysqlV3', function(req, res) {
	var start = new Date().getTime();
	mysqldb.query("SELECT platform, avg_rating FROM PlatformVSScore LIMIT 5", function(err, results, feilds) {
         if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
        }
		var elapsed = new Date().getTime() - start;
		var answer ={"result":elapsed};
        res.send(answer);
    }); 
});



router.get('/performmysql4', function(req, res) {
    var start = new Date().getTime();
    mysqldb.query("SELECT G.genre, COUNT(F.count_editor_choice) AS number_of_editor_choices FROM game_dimension G, fact F WHERE G.game_id = F.game_id AND F.count_editor_choice = 1 GROUP BY G.genre ORDER BY number_of_editor_choices DESC LIMIT 5", function(err, results, feilds) {
         if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
        }
        var elapsed = new Date().getTime() - start;
        var answer ={"result":elapsed};
        res.send(answer);
    }); 
});

router.get('/performmysqlV4', function(req, res) {
    var start = new Date().getTime();
    mysqldb.query("SELECT genre, Editor_choices FROM GenreVSEditor_Choice LIMIT 5", function(err, results, feilds) {
         if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
        }
        var elapsed = new Date().getTime() - start;
        var answer ={"result":elapsed};
        res.send(answer);
    }); 
});



router.get('/performmysql5', function(req, res) {
    var start = new Date().getTime();
    mysqldb.query("SELECT  AVG(F.average_score) AS avg_score FROM fact F, time_dimension T WHERE F.time_id = T.time_id GROUP BY T.year HAVING avg_score = (SELECT MAX(avg_score) FROM(SELECT AVG(F.average_score) AS avg_score FROM fact F, time_dimension T WHERE F.time_id = T.time_id GROUP BY T.year) AS T2)", function(err, results, feilds) {
         if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
        }
        var elapsed = new Date().getTime() - start;
        var answer ={"result":elapsed};
        res.send(answer);
    }); 
});

router.get('/performmysqlV5', function(req, res) {
    var start = new Date().getTime();
    mysqldb.query("SELECT year, avg_rating FROM yearvsscore WHERE avg_rating = (SELECT MAX(avg_rating) FROM yearvsscore)", function(err, results, feilds) {
         if (err) {
            console.error(err);
            res.statusCode = 500;
            res.send({
                result: 'error',
                err:    err.code
            });
        }
        var elapsed = new Date().getTime() - start;
        var answer ={"result":elapsed};
        res.send(answer);
    }); 
});

router.get('/neoPerform1',function(req, res){
    var start = new Date().getTime();
    var res1 =[];
    db('MATCH (fact:fact), (game:GameDimension)WHERE fact.game_id = game.GameID RETURN game.Title AS label,toint(fact.average_score) AS value ORDER BY value DESC LIMIT 25').on('data', function (result){
         res1.push(result);
         
     }).on('end', function(){
          var elapsed = new Date().getTime() - start;
            var answer ={"result":elapsed};
         // console.log(res1);
         res.send(answer);
     });
});



//What are the top 5 popular genres based on average rating?
router.get('/neoPerform2',function(req, res){
    //Writeyour neo4j  query
    var start = new Date().getTime();
    var res6 =[];
    db('MATCH (fact:fact), (game:GameDimension)WHERE fact.game_id = game.GameID RETURN DISTINCT game.Genre AS label, AVG(TOFLOAT(fact.average_score)) AS value ORDER BY value DESC LIMIT 5').on('data', function (result){
            res6.push(result);
         
    }).on('end', function(){
          var elapsed = new Date().getTime() - start;
            var answer ={"result":elapsed};
         // console.lg(res1);
         res.send(answer);
     });
    
    
});

//What are the top 5 popular genres based on editor's choice?


router.get('/neoPerform3',function(req, res){
    //Writeyour neo4j  query
    var start = new Date().getTime();
    var res7 =[];
    db('MATCH (fact:fact), (game:GameDimension)WHERE fact.game_id = game.GameID RETURN DISTINCT game.Genre AS label, COUNT(fact.count_editor_choice) AS value LIMIT 5').on('data', function (result){
            res7.push(result);
         
    }).on('end', function(){
          
          var elapsed = new Date().getTime() - start;
            var answer ={"result":elapsed};
         // console.lg(res1);
         res.send(answer);
     });
    
    
});

//Which are the top 5 popular platform based on average score rating?


router.get('/neoPerform4',function(req, res){
    //Writeyour neo4j  query
    var start = new Date().getTime();
    var res10 =[];
    db("MATCH (fact:fact), (game:GameDimension) WHERE fact.game_id = game.GameID RETURN DISTINCT game.Platform AS label, AVG(TOFLOAT(fact.average_score)) AS value ORDER BY value DESC LIMIT 5").on('data', function (result){
            res10.push(result);
         
    }).on('end', function(){
          var elapsed = new Date().getTime() - start;
            var answer ={"result":elapsed};
         // console.lg(res1);
        res.send(answer);
     });
    
    
});

//Which is the year with the greatest average rating?

router.get('/neoPerform5',function(req, res){
    //Writeyour neo4j  query
    var start = new Date().getTime();
    var res16 =[];
    db("MATCH (fact:fact), (time:time_dimension)WHERE fact.time_id= time.time_id RETURN distinct time.year AS label, AVG(TOINT(fact.average_score)) AS value ORDER BY value desc LIMIT 1").on('data', function (result){
            res16.push(result);
         
    }).on('end', function(){
          var elapsed = new Date().getTime() - start;
            var answer ={"result":elapsed};
         // console.lg(res1);
         res.send(answer);
     });
    
    
});

//--using views--------------------------------------------------views------------------------------------------------------------------------------------------------
//What are the top 25 rated games in the past 20 years?

router.get('/neoPerformV1',function(req, res){
    //Writeyour neo4j  query
    var start = new Date().getTime();
    var res16 =[];
    db("MATCH (view:GameVSscore)RETURN view.Title AS label, view.AverageScore AS value LIMIT 25").on('data', function (result){
            res16.push(result);
         
    }).on('end', function(){
          var elapsed = new Date().getTime() - start;
            var answer ={"result":elapsed};
         // console.lg(res1);
         res.send(answer);
     });
    
    
});


//What are the top 5 popular genres based on average rating?

router.get('/neoPerformV2',function(req, res){
    //Writeyour neo4j  query
    var start = new Date().getTime();
    var res17 =[];
    db("MATCH (view:gvGenreScore) RETURN view.Genre AS label, view.AverageScore AS value LIMIT 5").on('data', function (result){
            res17.push(result);
         
    }).on('end', function(){
          var elapsed = new Date().getTime() - start;
            var answer ={"result":elapsed};
         // console.lg(res1);
         res.send(answer);
     });
    
    
});

//What are the top 5 popular genres based on editor's choice?

router.get('/neoPerformV3',function(req, res){
    //Writeyour neo4j  query
    var res18 =[];
    var start = new Date().getTime();
    db("MATCH (view:GenreVSEditor_Choice)RETURN view.Genre AS label, view.Editor_choice AS value LIMIT 5").on('data', function (result){
            res18.push(result);
         
    }).on('end', function(){
          var elapsed = new Date().getTime() - start;
            var answer ={"result":elapsed};
         // console.lg(res1);
        res.send(answer);
     });
    
});

//Which are the top 5 popular platform based on average score rating?

router.get('/neoPerformV4',function(req, res){
    //Writeyour neo4j  query
    var start = new Date().getTime();
    var res19 =[];
    db("MATCH (view:GenreVSEditor_Choice)RETURN view.Genre AS label, view.Editor_choice AS value LIMIT 5").on('data', function (result){
            res19.push(result);
         
    }).on('end', function(){
          
          var elapsed = new Date().getTime() - start;
            var answer ={"result":elapsed};
         // console.lg(res1);
         res.send(answer);
     });
    
    
});


//Which is the year with the greatest average rating?--using views

router.get('/neoPerformV5',function(req, res){
    //Writeyour neo4j  query
    var start = new Date().getTime();
    var res21 =[];
    db("MATCH (view:tvYearScore)RETURN view.year AS label, AVG(TOINT(view.AverageScore)) AS value order by value DESC LIMIT 1").on('data', function (result){
            res21.push(result);
         
    }).on('end', function(){
          
          var elapsed = new Date().getTime() - start;
            var answer ={"result":elapsed};
         // console.lg(res1);
         res.send(answer);
     });
    
    
});
//--mongo------

// query 1 : top 25 games
router.get('/mongoPerform1', function(req, res) {
var start = new Date().getTime();
    Fact.aggregate([{ '$sort': { 'average_score': -1 } },
                    { '$lookup': 
                        { 'localField': 'game_id', 
                          'from':'game_dimension',
                          'foreignField':'game_id',
                          'as':'top25'
                        } 
                    },
                    {
                        '$unwind':"$top25"
                    },
                    {
                        '$project':
                        {
                            'label':'$top25.title',
                            'value':"$average_score"
                        }
                    }
                    ]).limit(25).then(function(fact){
    
        var resArray = [];
        fact.forEach(function(u) {
             var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        });
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});

//view1 top 25 games

router.get('/mongoPerformV1', function(req, res) {
var start = new Date().getTime();
    top25game.find({}).limit(25).then(function(top25games){
    
        var resArray = [];
        top25games.forEach(function(u) {
            var elapsed = new Date().getTime() - start;
            var answer = { "top25games" : elapsed };
        });
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});



module.exports = router;
