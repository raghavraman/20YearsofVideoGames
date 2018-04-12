var express = require('express')
var router = express.Router();
var db = require('cypher-stream')('bolt://127.0.0.1:7687', 'neo4j', 'admin');

router.get('/neo', function(req, res) {
    res.render('neo', {
        activeNeo: 'active'
    });
});

//Writeyour route for the query
router.get('/neoquery1',function(req,res){
	//Writeyour neo4j  query
	resutlArray=[];
	db('MATCH (fact:fact), (game:GameDimension)WHERE fact.game_id = game.GameID RETURN game.Title AS label,fact.average_score AS value ORDER BY value DESC LIMIT 25')
	  .on('data', function (result){
	    resutlArray.push(result);
	  }).on('end',function(){
	  	res.send(resutlArray);
	  });
});

module.exports = router;