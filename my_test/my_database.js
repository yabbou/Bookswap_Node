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

    fs.readFile("./sell_book.html", function (err, data) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            return res.end("404 Not Found");
        }

        res.write(data);
        if (q.pathname === "/sell") {
            var query = q.query;

            res.write("Title= " + query.title);
            res.write("<br>Category= " + query.cat);
            res.write("<br>ISBN-10= " + query.isbn);
            res.write("<br>Professor= " + query.prof);

            if (query.pass === query.pass_conf && query.email === query.email_conf) { //??
                var sqlInsert = "INSERT INTO book (Title, Category, ISBN-10, Professor) VALUES ?";
                var VALUES = [query.title, query.cat, query.isbn, query.prof];

                con.query(sqlInsert, [VALUES], function (err, result) {
                    if (err) throw err;
                    console.log("Added to the Database.");
                });
            } else {
                console.log("Unsuccessful upload... please try again.");
            };
        };
    });

    // var sql = "SELECT * FROM book";
    // con.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Database Shown");

    //     if (result) {
    //         console.log(result);
    //         for (var book of result) {
    //             console.log(book);

    //             book.forEach(element => {
    //                 res.write(element);
    //             });
    //         }
    //     }
    // }
   
    

}).listen(3000);
