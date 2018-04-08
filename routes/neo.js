var express = require('express')
var router = express.Router();
var db = require('cypher-stream')('bolt://127.0.0.1:7687', 'neo4j', 'admin');

router.get('/neo', function(req, res) {
    res.render('neo', {
        activeNeo: 'active'
    });
});

//Writeyour route for the query
router.get('/query1',function(req,res){
	//Writeyour neo4j  query
	db('MATCH (n:Person) RETURN n LIMIT 25')
	  .on('data', function (result){
	    res.send(result.n);
	  });
});

module.exports = router;