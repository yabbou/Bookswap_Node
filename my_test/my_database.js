var http = require('http');
var fs = require('fs');
var url = require('url');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookswap"
});
con.connect(function (err) {
    if (err) { throw err; }
    console.log("Connected!");
});

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    res.writeHead(200, { 'Content-type': 'text/html' });
    fs.readFile("./books.html", function (err, data) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }
        res.write(data);
        if (q.pathname === "/books") {
            var query = q.query;
            res.write("Name= " + query.fname + " " + query.lname);
            res.write("<br>Username= " + query.uname);
            res.write("<br>Password= " + query.pass);
            res.write("<br>Email= " + query.email);
            res.write("<br>Profession= " + query.job);
            res.write("<br>Flip Out Type= " + query.fo_type + "<br><br>");
            if (query.pass === query.pass_conf && query.email === query.email_conf) {
                var sql2 = "INSERT INTO users(id, username, password, email, first_name,"
                    + " last_name, profession, fo_type, date_joined, authorization)"
                    + " VALUES (NULL, \'" + query.uname + "\', \'" + query.pass +
                    "\', \'" + query.email + "\', \'" + query.fname + "\', \'" +
                    query.lname + "\', \'" + query.job + "\', \'" + query.fo_type +
                    "\', CURRENT_TIMESTAMP, 'reg')";
                con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("Added to the Database ");
                });
            } else {
                console.log("Passwords or Emails Don't Match");
            };
        };
    });
    var sql = "SELECT * FROM users";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Database Shown");
        
        if (result) {
            for (var i of result) {
                res.write("ID: " + i.id + "<br>Username: " + i.username +
                    "<br>Password: " + i.password + "<br>Email: " + i.email +
                    "<br>First Name: " + i.first_name + "<br>Last Name: " + i.last_name +
                    "<br>Profession: " + i.profession + "<br>Flip Out Type: " +
                    i.fo_type + "<br><br>");
            };
        };
    });
}).listen(3000);
