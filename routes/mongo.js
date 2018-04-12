var mongoose = require('mongoose'),
  	fs = require('fs'),
  	express = require('express'),
	router = express.Router();

mongoose.Promise = require('bluebird');

//Database connection - Here TEST is the database name-  change it as per your need

//CREATE A MODEL FOR COLLECTION - used as an object of each collections
// var Rating = mongoose.model('ratings', ratingSchema);

//THis url will display the follwowing result of the mongo query
router.get('/mongoquery1', function(req, res) {
	// console.log("QUERY 1  - Average Rating of each movie")
	// Rating.aggregate([{ $group: { _id: '$movieID', avg: { $avg: "$rating" } } }]).limit(20)
 //    .then(function(ratings) {
 //       	res.send(ratings);
 //    }).catch(function(error) {
 //        console.error(error);
 //    });

});


module.exports = router;