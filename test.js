// var orm = require('orm');
//
// orm.connect("mysql://root:vubinhne@127.0.0.1:3306/MyFirstConnection", function(err, db){
//   if(err){
//     console.log("Something is wrong with the connection", err);
//     return ;
//   }
// });

var mysql      = require('mysql');

var host = 'localhost';
var port = 3306;
var user = 'root';
var password = 'vubinhne';

var connection = mysql.createPool({
    connectionLimit : 100,
    host     : host,
    port     : port,
    user     : user,
    password: password,
    database  	: 'timesheet',
    dateStrings : true,
    timezone: 'gmt'
});

connection.query('SET NAMES `UTF8`', function(err, message){
    // console.log(password);
	if (err)
		console.log(err);
	else
		console.log("UTF8 setted");
});

module.exports = connection;


// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'vubinhne',
//   database : 'mysql'
// });
//
// connection.connect(function(err, conn) {
//     if(err) {
//          console.log('MySQL connection error: ', err);
//          process.exit(1);
//     }
//     console.log('adb');
// });
