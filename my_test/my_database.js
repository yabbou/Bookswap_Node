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

            if (query.pass === query.pass_conf && query.email === query.email_conf) {
                var sqlInsert = "INSERT INTO book (Title, Category, `ISBN_10`,`ISBN-13`, Professor) VALUES (?)";
                var VALUES = [query.title, query.cat, query.isbn, 0000000000000, query.prof];

                con.query(sqlInsert, [VALUES], function (err, result) {
                    if (err) throw err;
                    console.log("Added to the Database.");
                    displayBooks(res);
                });
            } else {
                console.log("Unsuccessful upload... please try again.");
            };
        };
    });
    
    displayBooks(res);

}).listen(3000);

function displayBooks(res) {
    var sql = "SELECT * FROM book";
    con.query(sql, function (err, result) {
        if (err)
            throw err;
        console.log("Database Shown");
        if (result) {
            res.write("<table border=1><tr><th>Title</th><th>Major</th><th>ISBN-10</th><th>Prof</th></tr >");
            for (var book of result) {
                res.write("<tr>" +
                    "<td>" + book.Title + "</td>" +
                    "<td>" + book.Category + "</td>" +
                    "<td>" + book.ISBN_10 + "</td>" +
                    "<td>" + book.Professor + "</td>" +
                    "</tr>");
            }
            res.write("</table>");
        }
    });
}

