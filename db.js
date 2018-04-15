var mysql_npm = require('mysql');
var settings = require('./settings.json');
var db;

//- Create the connection variable
var connection = mysql_npm.createPool(settings["db"]);

//- Establish a new connection
connection.getConnection(function(err){
    if(err) {
        // mysqlErrorHandling(connection, err);
        console.log("\n\t *** Cannot establish a connection with the database. ***");

        connection = reconnect(connection);
    }else {
        console.log("\n\t *** New connection established with the database. ***")
    }
});

module.exports = connection;