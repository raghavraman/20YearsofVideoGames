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


var Fact = mongoose.model('fact',factSchema,'fact');

router.get('/mongoquery1', function(req, res) {

    Fact.find().limit(20).then(function(fact){
    	console.log(fact);
    	res.send(fact);
    }).catch(function(error) {
        console.error(error);
    });

});

module.exports = router;