var mongoose = require('mongoose'),
  	fs = require('fs'),
  	express = require('express'),
	router = express.Router();

mongoose.Promise = require('bluebird');

//Database connection - Here TEST is the database name-  change it as per your need
mongoose.connect('mongodb://localhost/adbms');

//GETTING THE CONNECTION
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MONGO");
});


var factSchema = mongoose.Schema({

	game_id : Number,
	time_id : Number,
	average_score : Number,
	count_editor_choice : Number
});

var gameDimeSchema = mongoose.Schema({

	game_id : Number,
	title : String,
	genre : String,
	platform: String

});

var Fact = mongoose.model('fact',factSchema,'fact');
var Game = mongoose.model('game_dimension',gameDimeSchema,'game_dimension');



//ALL QUERIES GOES HERE


router.get('/mongo',function(req,res){
    res.render('mongo',{activeMongo:"active"});
});


router.get('/mongoquery1', function(req, res) {

    var resArray = [];
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
        	resArray.push({'label':u.label,'value':u.value});
    	});
    	res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});

module.exports = router;