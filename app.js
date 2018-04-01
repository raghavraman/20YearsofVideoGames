var express = require("express"),
    bodyParser = require("body-parser"),
    exphbs = require('express-handlebars')
    session = require('express-session');


//Create app and use body-parser
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Allow cross orgin requests
app.use(function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.engine('handlebars', exphbs({ defaultLayout: 'main',helpers: require(__dirname+"/js/helper.js").helpers }));
app.set('view engine', 'handlebars');
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));

app.set('views', __dirname + '/views');



app.use(require('./routes'));


app.listen(process.env.PORT || 3000);