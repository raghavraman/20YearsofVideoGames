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

var gameTimeSchema = mongoose.Schema({

    time_id : Number,
    year : Number,
    month : Number,

});




var Fact = mongoose.model('fact',factSchema,'fact');
var Game = mongoose.model('game_dimension',gameDimeSchema,'game_dimension');
var Time = mongoose.model('time_dimension',gameTimeSchema,'time_dimension');



//ALL QUERIES GOES HERE

//1. -- What are the top 25 rated games in the past 20 years? --
router.get('/mongo',function(req,res){
    res.render('mongo',{activeMongoDB:"active"});
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

//2. -- What are the games with score>8, editor_choice=y --
router.get('/mongoquery2', function(req, res) {

    var resArray = [];
    Fact.aggregate([{ '$match': { 'average_score': {$gt: 8} } },
                    { '$match': { 'count_editor_choice': {$gte: 1} } },
                    { '$lookup': 
                        { 'localField': 'game_id', 
                          'from':'game_dimension',
                          'foreignField':'game_id',
                          'as':'y_8'
                        } 
                    },
                    {
                        '$unwind':"$y_8"
                    },
                    {
                        '$project':
                        {
                            'game_id': 1,
                            'label': '$y_8.title',
                            'value': 1,
                            'count_editor_choice': 1
                        }
                    }
                    ]).then(function(fact){
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});


//3. -- -What is the amount of games by each genre? --
router.get('/mongoquery3', function(req, res) {

    var resArray = [];
    Game.aggregate([{ '$group': { '_id': {'genre': '$genre'},
                                  'COUNT(game_id)': {'$sum': 1 }} },
                    {
                        '$project':
                        {
                            '_id': 'NumberInt(0)',
                            'label': '$_id.genre',
                            'value': '$COUNT(game_id)'
                        }
                    }
                    ]).then(function(fact){
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});


//4. -- -What is the amount of games by each platform? --
router.get('/mongoquery4', function(req, res) {

    var resArray = [];
    Game.aggregate([{ '$group': { '_id': {'platform': '$platform'},
                                  'COUNT(game_id)': {'$sum': 1 }} },
                    {
                        '$project':
                        {
                            '_id': 'NumberInt(0)',
                            'label': '$_id.platform',
                            'value': '$COUNT(game_id)'
                        }
                    }
                    ]).then(function(fact){
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});

//Getting timedout
//5. --What is the average score rating  by each genre? --
router.get('/mongoquery5', function(req, res) {

    var resArray = [];
    Fact.aggregate([
                    { '$lookup': 
                        { 'localField': 'game_id', 
                          'from':'game_dimension',
                          'foreignField':'game_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                    },
                    {
                        '$group':
                        {
                            '_id': '$data.genre',
                            'AVG(average_score)': { '$avg': '$average_score' }
                        }
                    },
                    {
                        '$project':
                        {
                            'label': '$_id',
                            'value': '$AVG(average_score)'
                        }
                    }
                    ]).limit(5).then(function(fact){
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});

//Getting timedout
//6.--What are the top 5 popular genres? (editor's choice and average rating both) --
router.get('/mongoquery6', function(req, res) {

    var resArray = [];
    Fact.aggregate([{ '$match': { 'count_editor_choice': {$gte: 1} } },
                    { '$lookup': 
                        { 'localField': 'game_id', 
                          'from':'game_dimension',
                          'foreignField':'game_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                    },
                    {
                       $group:
                        { '_id': {'genre': '$data.genre'},
                           "count(count_editor_choice)": 
                          {'$sum': 1 },
                          'AVG(average_score)': { '$avg': '$average_score' }
                          
                          }
                       },
                        
                    {
                        '$project':
                        {
                            '_id': 'NumberInt(0)',
                            'label': '$_id.genre',
                            'value': "$count(count_editor_choice)"
                        }
                    }, { '$sort': { 'AVG(average_score)': -1 } }
                    ]).limit(5).then(function(fact) {
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});

//Getting timedout
//7. --What are the top 5 popular genres based on average rating ? --

router.get('/mongoquery7', function(req, res) {

    var resArray = [];
    Fact.aggregate([
                    { '$lookup': 
                        { 'localField': 'game_id', 
                          'from':'game_dimension',
                          'foreignField':'game_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                    },
                    {
                       $group:
                        { '_id': '$data.genre',
                          'AVG(average_score)': { '$avg': '$average_score' }
                          
                          }
                       },
                        
                    {
                        '$project':
                        {
                            '_id': '$data.genre',
                            'label': '$_id',
                            'value': "$AVG(average_score)"
                        }
                    }, { '$sort': { 'AVG(average_score)': -1 } }
                    ]).limit(5).then(function(fact) {
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});

//Getting timedout
//-- 8. What are the top 5 popular genres based on editor's choice ? --

router.get('/mongoquery8', function(req, res) {

    var resArray = [];
    Fact.aggregate([{ '$match': { 'count_editor_choice': 1 } },
                    { '$lookup': 
                        { 'localField': 'game_id', 
                          'from':'game_dimension',
                          'foreignField':'game_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                    },
                    {
                       $group:
                        { '_id': '$data.genre',
                          "count(count_editor_choice)": 
                          { $sum: 1 }
                          }
                       },
                        
                    {
                        '$project':
                        {
                            '_id': '$data.genre',
                            'label': '$_id',
                            'value': "$count(count_editor_choice)"
                        }
                    }, { '$sort': { "count(count_editor_choice)" : -1 } }
                    ]).limit(5).then(function(fact) {
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});

//Getting timedout
//-- 9. Which platforms has the avg rating of games of more than 7.0?

router.get('/mongoquery9', function(req, res) {

    var resArray = [];
    Fact.aggregate([{ '$match': { "average_score": {'$gte': 7} } },
                    { '$lookup': 
                        { 'localField': 'game_id', 
                          'from':'game_dimension',
                          'foreignField':'game_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                    },
                    {
                       $group:
                        { '_id': '$data.platform',
                          'AVG(average_score)': { '$avg': '$average_score' }
                          
                          }
                       },
                        
                    {
                        '$project':
                        {
                            'label': '$_id',
                            'value': "$AVG(average_score)"
                        }
                    }
                    ]).then(function(fact) {
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});

//Getting timedout
//--10. What number of games are released on each platform annually?--

router.get('/mongoquery10', function(req, res) {

    var resArray = [];
    Fact.aggregate([
                    { '$lookup': 
                        { 'localField': 'game_id', 
                          'from':'game_dimension',
                          'foreignField':'game_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                    },
                    { "$lookup": {
                        "localField": "time_id",
                        "from": "time_dimension",
                        "foreignField": "time_id",
                        "as": "data2"
                    } },

                    {'$unwind': '$data2'},
                    {
                       $group:
                        { '_id': {'platform':'$data.platform', 'release_year' : '$data2.release_year'},
                            "count(game_id)": 
                          {
                            '$sum': 1
                            }
                        }
                       },
                    {
                        '$project':
                        {
                            'label': '$_id.platform',
                            "release_year" : "$_id.release_year",
                            'value': "$count(game_id)"
                        }
                    }
                    ]).then(function(fact) {
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});

//Getting timedout
//-- 11. How has the use of platform 'PC' changed annually over the bi-decennial? --
router.get('/mongoquery11', function(req, res) {

    var resArray = [];
    Fact.aggregate([
                    { '$lookup': 
                        { 'localField': 'game_id', 
                          'from':'game_dimension',
                          'foreignField':'game_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                        
                    },
                    { 
                        "$match" : {
                          '$and': [ {
                            'data.platform' : { '$eq': 'PC' }}]
                        }
                    },
                    { "$lookup": {
                        "localField": "time_id",
                        "from": "time_dimension",
                        "foreignField": "time_id",
                        "as": "data2"
                    } },

                    {'$unwind': '$data2'},
                    {
                       $group:
                        { '_id': {'platform':'$data.platform', 'release_year' : '$data2.release_year'},
                            "count(game_id)": 
                          {
                            '$sum': 1
                            }
                        }
                       },
                    {
                        '$project':
                        {
                            'label': '$_id.platform',
                            "release_year" : "$_id.release_year",
                            'value': "$count(game_id)"
                        }
                    }
                    ]).then(function(fact) {
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});


//-- 12. How many games were released in each year?--

router.get('/mongoquery12', function(req, res) {

    var resArray = [];
    Fact.aggregate([
                    { '$lookup': 
                        { 'localField': 'time_id', 
                          'from':'time_dimension',
                          'foreignField':'time_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                    },
                    {
                       $group:
                        { '_id': '$data.year',
                          "count(game_id)": 
                          {
                            '$sum': 1
                            }
                          }
                       },
                        
                    {
                        '$project':
                        {
                            '_id': '$data.year',
                            'label': '$_id',
                            'value': "$count(game_id)"
                        }
                    }
                    ]).then(function(fact) {
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});


//-- 13. How many high-rated games were released each year ?(high rated is rating >=8 --

router.get('/mongoquery13', function(req, res) {

    var resArray = [];
    Fact.aggregate([{ "$match": { "average_score": {'$gte': 8} } },
                    { '$lookup': 
                        { 'localField': 'time_id', 
                          'from':'time_dimension',
                          'foreignField':'time_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                    },
                    {
                       $group:
                        { '_id': '$data.year',
                          "count(game_id)": 
                          {
                            '$sum': 1
                            }
                          }
                       },
                        
                    {
                        '$project':
                        {
                            '_id': '$data.year',
                            'label': '$_id',
                            'value': "$count(game_id)"
                        }
                    }
                    ]).then(function(fact) {
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});

//-- 14. How many high-rated games were released each year with a positive editor choice?(high rated is rating >=8 --

router.get('/mongoquery14', function(req, res) {

    var resArray = [];
    Fact.aggregate([{ "$match": { "average_score": {'$gte': 8} } },
                    { "$match" : { "count_editor_choice" : 1}},
                    { '$lookup': 
                        { 'localField': 'time_id', 
                          'from':'time_dimension',
                          'foreignField':'time_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                    },
                    {
                       $group:
                        { '_id': '$data.year',
                          "count(game_id)": 
                          {
                            '$sum': 1
                            }
                          }
                       },
                        
                    {
                        '$project':
                        {
                            '_id': '$data.year',
                            'label': '$_id',
                            'value': "$count(game_id)"
                        }
                    }
                    ]).then(function(fact) {
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

});

//-- 15. what are the top 5 months that have the highest rated releases of all-time?

router.get('/mongoquery15', function(req, res) {

    var resArray = [];
    Fact.aggregate([{ "$match": { "average_score": {'$gte': 8} } },
                    { '$lookup': 
                        { 'localField': 'time_id', 
                          'from':'time_dimension',
                          'foreignField':'time_id',
                          'as':'data'
                        } 
                    },
                    {
                        '$unwind':"$data"
                    },
                    {
                       '$group':
                        { 
                          '_id' : { 'year' : '$data.year' , 'month' : '$data.month'},
                           "count(game_id)": 
                          {
                            '$sum': 1
                            }
                          }
                       },
                        
                    {
                        '$project':
                        {
                            'month': '$_id.month',
                            'label': '$_id.month',
                            'value': "$count(game_id)"
                        }
                    }
                    ]).limit(5).then(function(fact) {
    
        var resArray = [];
        fact.forEach(function(u) {
            resArray.push({'label':u.label,'value':u.value});
        });
        res.send(resArray);
    }).catch(function(error) {
        console.error(error);
    });

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

var gameTimeSchema = mongoose.Schema({

    time_id : Number,
    year : Number,
    month : Number,

});
var successful_year_by_average_rating_schema=mongoose.Schema({
    Year : Number,
    Average_Score : Number

});

var top25GameSchema=mongoose.Schema({
    label : String,
    Value : Number
});
var popular_platforms_by_avg_rate_Schema=mongoose.Schema({
platform : String,
avg_score : Number
});

var popular_genre_by_avg_rate_Schema= mongoose.Schema({
genre : String,
avg_score : Number
    });

var popular_genre_by_avg_rate_editor_choice_Schema = mongoose.Schema({
    genre : String,
    avg_score : Number
});


var SuccesfulYear= mongoose.model('successful_year_by_average_rating',successful_year_by_average_rating_schema,'successful_year_by_average_rating');
var top25game = mongoose.model('top25games',top25GameSchema,'top25games');
var popular_platforms_by_avg_rates = mongoose.model('popular_platforms_by_avg_rate',popular_platforms_by_avg_rate_Schema,'popular_platforms_by_avg_rate');
var popular_genre_by_avg_rates = mongoose.model('popular_genre_by_avg_rate',popular_genre_by_avg_rate_Schema,'popular_genre_by_avg_rate');
var popular_genre_by_avg_rate_editor_choices = mongoose.model('popular_genre_by_avg_rate_editor_choice',popular_genre_by_avg_rate_editor_choice_Schema,'popular_genre_by_avg_rate_editor_choice');



// query 1 : top 25 games
router.get('/mongoPerform1', function(req, res) {
var start = new Date().getTime();
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
          var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});

//view1 top 25 games

router.get('/mongoPerformV1', function(req, res) {
var start = new Date().getTime();
    var resArray = [];
    top25game.find({}).limit(25).then(function(top25games){
    
        var resArray = [];
        top25games.forEach(function(u) {
            
            resArray.push({'label':u.label,'value':u.Value});
        });
        var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});

//query2

//top 5 platforms
router.get('/mongoPerform2', function(req, res) {
var start = new Date().getTime();
    var resArray = [];
Fact.aggregate([ 

{ "$lookup": {
    "localField": "game_id",
    "from": "game_dimension",
    "foreignField": "game_id",
    "as": "data"
} } ,

{$unwind: '$data'},
 {
   $group:
    { 
      _id: '$data.platform',
       "AVG(average_score)" : {
                    "$avg" : "$average_score"
                }
      }
   },
   { 
            "$project" : {

                "platform" : "$data.platform", 
                "AVG(average_score)" : "$AVG(average_score)"
            } },
            { 
            "$sort" : {
                 "AVG(average_score)"  : -1
            }
        }
]).limit(5).then(function(fact){
    
        var resArray = [];
        fact.forEach(function(u) {
            
            resArray.push({'label':u.label,'value':u.value});
        });
        var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});


//view2
router.get('/mongoPerformV2', function(req, res) {
var start = new Date().getTime();
    var resArray = [];
    popular_platforms_by_avg_rates.find({}).limit(5).then(function(popular_platforms_by_avg_rate){
    
        var resArray = [];
        popular_platforms_by_avg_rate.forEach(function(u) {
           
            resArray.push({'label':u.platform,'value':u.avg_score});
        });
         var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});


//query3
//top 5 genres
router.get('/mongoPerform3', function(req, res) {
var start = new Date().getTime();
    var resArray = [];
Fact.aggregate([ 

{ "$lookup": {
    "localField": "game_id",
    "from": "game_dimension",
    "foreignField": "game_id",
    "as": "data"
} } ,

{$unwind: '$data'},
 {
   $group:
    { 
      _id: '$data.genre',
       "AVG(average_score)" : {
                    "$avg" : "$average_score"
                }
      }
   },
   { 
            "$project" : {

                "genre" : "$data.genre", 
                "AVG(average_score)" : "$AVG(average_score)"
            } },
            { 
            "$sort" : {
                 "AVG(average_score)"  : -1
            }
        }
]).limit(5).then(function(fact){
    
        var resArray = [];
        fact.forEach(function(u) {
            
            resArray.push({'label':u.label,'value':u.value});
        });
        var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});


//view3
router.get('/mongoPerformV3', function(req, res) {
var start = new Date().getTime();
    var resArray = [];
    popular_genre_by_avg_rates.find({}).limit(5).then(function(popular_genre_by_avg_rate){
    
        var resArray = [];
        popular_genre_by_avg_rate.forEach(function(u) {
            resArray.push({'label':u.platform,'value':u.avg_score});
        });
         var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});

//query4

router.get('/mongoPerform4', function(req, res) {
var start = new Date().getTime();
    var resArray = [];
Fact.aggregate([ 
{ "$match": { "count_editor_choice": {$gte: 1} } },
{ "$lookup": {
    "localField": "game_id",
    "from": "game_dimension",
    "foreignField": "game_id",
    "as": "data"
} } ,

{$unwind: '$data'},
 {
   $group:
    { 
      _id: '$data.genre',
       "AVG(average_score)" : {
                    "$avg" : "$average_score"
                }
      }
   },
   { 
            "$project" : {
                "_id" : "$data.genre",
                "genre" : "$_id", 
                "avg_score" : "$AVG(average_score)"
            } },
            { 
            "$sort" : {
                 "AVG(average_score)"  : -1 } }]).limit(5).then(function(fact){
    
        var resArray = [];
        fact.forEach(function(u) {
            
            resArray.push({'label':u.label,'value':u.value});
        });
        var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});


//view4

router.get('/mongoPerformV4', function(req, res) {
var start = new Date().getTime();
    var resArray = [];
    popular_genre_by_avg_rate_editor_choices.find({}).limit(5).then(function(popular_genre_by_avg_rate_editor_choice){
    
        var resArray = [];
        popular_genre_by_avg_rate_editor_choice.forEach(function(u) {
            resArray.push({'label':u.gere,'value':u.avg_score});
        });
         var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});



//query5
router.get('/mongoPerform5', function(req, res) {
var start = new Date().getTime();
    var resArray = [];
Fact.aggregate([ 

{ "$lookup": {
    "localField": "time_id",
    "from": "time_dimension",
    "foreignField": "time_id",
    "as": "data"
} } ,

{$unwind: '$data'},
 {
   $group:
    { 
      _id: '$data.year',
       "AVG(average_score)" : {
                    "$avg" : "$average_score"
                }
      }
   },
   { 
            "$project" : {

                "_id" : "$data.year",
                "Year" : "$_id", 
                "Average_Score" : "$AVG(average_score)"
            } },
            { 
            "$sort" : {
                 "AVG(average_score)"  :-1
            }
        }
]).limit(5).then(function(fact){
    
        var resArray = [];
        fact.forEach(function(u) {
            
            resArray.push({'label':u.label,'value':u.value});
        });
        var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});

//view5
router.get('/mongoPerformV5', function(req, res) {
var start = new Date().getTime();
    var resArray = [];
    SuccesfulYear.find({}).limit(1).then(function(successful_year_by_average_rating){
    
        var resArray = [];
        successful_year_by_average_rating.forEach(function(u) {
            resArray.push({'label':u.Year,'value':u.Average_Score});
        });
      var elapsed = new Date().getTime() - start;
            var answer = { "fact" : elapsed };
        res.send(answer);
    }).catch(function(error) {
        console.error(error);
    });

});

module.exports = router;