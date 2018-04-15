var express = require('express')
var router = express.Router();
var db = require('cypher-stream')('bolt://127.0.0.1:7687', 'neo4j', 'admin');

router.get('/neo', function(req, res) {
    res.render('neo', {
        activeNeo: 'active'
    });
});


router.get('/neoquery1',function(req, res){
	//Writeyour neo4j  query
	var res1 =[];
	db('MATCH (fact:fact), (game:GameDimension)WHERE fact.game_id = game.GameID RETURN game.Title AS label,toint(fact.average_score) AS value ORDER BY value DESC LIMIT 25').on('data', function (result){
		 res1.push(result);
		 
	 }).on('end', function(){
		  console.log("done");
		 // console.log(res1);
		 res.send(res1);
	 });
});
	



//What are the games with score > 8 and EditorsChoice = Y?
	
router.get('/neoquery2',function(req, res){
	//Writeyour neo4j  query
	var res2 =[];
	db('MATCH (fact:fact), (game:GameDimension)WHERE fact.game_id = game.GameID AND toint( fact.average_score) > 8 AND  toint(fact.count_editor_choice) = 1 RETURN DISTINCT game.Title AS label,toint(fact.average_score) AS value ').on('data', function (result){
	     	res2.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.log(res1);
		 res.send(res2);
	 });
	
	
});
//What are the amount of games by each genre?


router.get('/neoquery3',function(req, res){
	//Writeyour neo4j  query
	var res3 =[];
	db('MATCH (game:GameDimension)RETURN DISTINCT game.Genre AS label, COUNT(game.GameID) AS value ORDER BY value').on('data', function (result){
	     	res3.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.log(res1);
		 res.send(res3);
	 });
	
	
});
//What is the average score rating by each genre?

router.get('/neoquery4',function(req, res){
	//Writeyour neo4j  query
	var res4 =[];
	db('MATCH (fact:fact), (game:GameDimension), (time:time_dimension)WHERE fact.game_id = game.GameID AND fact.time_id = time.time_id RETURN DISTINCT game.Genre AS label, AVG(TOFLOAT(fact.average_score)) AS value').on('data', function (result){
	     	res4.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.log(res1);
		 res.send(res4);
	 });
	
	
});
//What are the top 5 popular genres? editor's choice and average_rating  -doesnt make any sense to Neo4j

router.get('/neoquery5',function(req, res){
	//Writeyour neo4j  query
	var res5 =[];
	db('MATCH (fact:fact), (game:GameDimension)WHERE fact.game_id = game.GameID RETURN DISTINCT game.Genre AS label, AVG(TOFLOAT(fact.average_score)) AS value  ORDER BY value DESC LIMIT 5').on('data', function (result){
	     	res5.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res5);
	 });
	
	
});

//What are the top 5 popular genres based on average rating?
router.get('/neoquery6',function(req, res){
	//Writeyour neo4j  query
	var res6 =[];
	db('MATCH (fact:fact), (game:GameDimension)WHERE fact.game_id = game.GameID RETURN DISTINCT game.Genre AS label, AVG(TOFLOAT(fact.average_score)) AS value ORDER BY value DESC LIMIT 5').on('data', function (result){
	     	res6.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res6);
	 });
	
	
});

//What are the top 5 popular genres based on editor's choice?


router.get('/neoquery7',function(req, res){
	//Writeyour neo4j  query
	var res7 =[];
	db('MATCH (fact:fact), (game:GameDimension)WHERE fact.game_id = game.GameID RETURN DISTINCT game.Genre AS label, COUNT(fact.count_editor_choice) AS value LIMIT 5').on('data', function (result){
	     	res7.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res7);
	 });
	
	
});




//What are the average scores of genres by years?

//router.get('/neoquery8',function(req, res){
	//Writeyour neo4j  query
//	var res8 =[];
//	db('MATCH (fact:fact), (game:GameDimension), (time:time_dimension)WHERE fact.game_id = game.GameID AND fact.time_id = time.time_id RETURN DISTINCT game.Genre AS  Genre;, AVG(TOFLOAT(fact.average_score)) AS value, time.Year AS label ').on('data', function (result){
//	     	res6.push(result);
//		 
//	}).on('end', function(){
//		  console.log("done");
//		 // console.lg(res1);
//		 res.send(res8);
//	 });
//	
//	
//});

//How has the popularity of genre 'Adventure' has changed over the last 20 years? --

router.get('/neoquery9',function(req, res){
	//Writeyour neo4j  query
	var genre = req.query.genre;
	var res9 =[];
	db("MATCH (fact:fact), (game:GameDimension), (time:time_dimension) WHERE fact.game_id = game.GameID AND fact.time_id = time.time_id AND game.Genre = '"+genre+"' RETURN AVG(TOFLOAT(fact.average_score)) AS value, time.year AS label ").on('data', function (result){
	     	res9.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res9);
	 });
	
	
});
//Which are the top 5 popular platform based on average score rating?


router.get('/neoquery10',function(req, res){
	//Writeyour neo4j  query
	var res10 =[];
	db("MATCH (fact:fact), (game:GameDimension) WHERE fact.game_id = game.GameID RETURN DISTINCT game.Platform AS label, AVG(TOFLOAT(fact.average_score)) AS value ORDER BY value DESC LIMIT 5").on('data', function (result){
	     	res10.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res10);
	 });
	
	
});

//What is the most popular genre with respect to a platform?

router.get('/neoquery11',function(req, res){
	//Writeyour neo4j  query
	var platform = req.query.platform;
	var res11 =[];
	db("MATCH (fact:fact), (game:GameDimension) WHERE fact.game_id = game.GameID AND game.Platform = '"+platform+"' RETURN DISTINCT game.Genre AS label,COUNT(fact.game_id) AS value ORDER BY value DESC LIMIT 1").on('data', function (result){
	     	res11.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res11);
	 });
	
	
});

//Which platforms has the average rating of games of more than 7.0?

router.get('/neoquery12',function(req, res){
	//Writeyour neo4j  query
	var rating = req.query.rating;
	var res12 =[];
	db("MATCH (fact:fact), (game:GameDimension) WHERE fact.game_id= game.GameID WITH DISTINCT game.Platform AS label, AVG(TOFLOAT(fact.average_score)) AS value WHERE value > "+rating+" RETURN label, value ORDER BY value DESC").on('data', function (result){
	     	res12.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res12);
	 });
	
	
});

//What number of games are released on each platform annually?

router.get('/neoquery13',function(req, res){
	var platform = req.query.platform;
	//Writeyour neo4j  query
	var res13 =[];
	db("MATCH (fact:fact), (game:GameDimension), (time:time_dimension) WHERE fact.game_id = game.GameID AND fact.time_id = time.time_id AND game.Platform = '"+platform+"' RETURN DISTINCT time.year AS label, COUNT(fact.game_id) AS value ORDER BY label").on('data', function (result){
	     	res13.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res13);
	 });
	
	
});


//How many games were released in each year?

router.get('/neoquery14',function(req, res){
	//Writeyour neo4j  query
	var res14 =[];
	db("MATCH (fact:fact), (time:time_dimension) WHERE fact.time_id=time.time_id RETURN DISTINCT time.year AS label, COUNT(fact.game_id) AS value ORDER BY label")

	.on('data', function (result){
		res14.push(result);
		 
}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res14);
	 });
	

});

//How many high-rated games were released each year? (high-rated is rating >=8)	
router.get('/neoquery15',function(req, res){
	var rating = req.query.rating;
	//Writeyour neo4j  query
	var res15 =[];
	db("MATCH (fact:fact), (time:time_dimension) WHERE fact.time_id= time.time_id AND toint(fact.average_score) >= "+rating+" RETURN DISTINCT time.year AS label, COUNT(fact.game_id) AS value ORDER BY label").on('data', function (result){
	     	res15.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res15);
	 });
	
	
});

//Which is the year with the greatest average rating?

router.get('/neoquery16',function(req, res){
	//Writeyour neo4j  query
	var res16 =[];
	db("MATCH (fact:fact), (time:time_dimension)WHERE fact.time_id= time.time_id RETURN distinct time.year AS label, AVG(TOINT(fact.average_score)) AS value ORDER BY value desc LIMIT 1").on('data', function (result){
	     	res16.push(result);
		 
	}).on('end', function(){
		  console.log("done");
		 // console.lg(res1);
		 res.send(res16);
	 });
	
	
});



module.exports = router;
