var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    res.writeHead(200, {'Content-type': 'text/html'});

    fs.readFile('./contact_us.html', function (err, data) {
        res.writeHead(200, {'Content-type': 'text/html'});
        if (err) {
            return res.end(err);
        }
        res.write(data);
    });

    // fs.readFile('./styles.css', function (err, data) { //edit
    //     res.writeHead(200, {'Content-type': 'text/css'});
    //     if (err) {
    //         return res.end(err);
    //     }
    //     res.write(data); //not write...
    // });

    if (q.pathname == "/form") {
        var query = q.query;

        console.log("Pathname: " + q.pathname);
        console.log(query);

        res.write("Name: " + query.nameEntry);
        res.write("<br>Email: " + query.emailEntry);
        res.write("<br>Message: " + query.msgEntry);

        sendEmail(query.nameEntry, query.emailEntry, query.msgEntry);
        res.write("<h3>Message sent!</h3>");
    }

}).listen(8080);

function sendEmail(name, email, message) {
    var nodemailer = require('nodemailer');
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bookswap2020@gmail.com',
            pass: 'lcmphp5780'
        }
    });

    var mailOptions = {
        from: 'bookswap2020@gmail.com',
        to: 'bookswap2020@gmail.com',
        subject: 'Node form test',
        html:
                '<h3>From: ' + name + '</h3>' +
                '<h3>Email Address: ' + email + '</h3>' +
                '<h2>Message:</h2><p>' + message + '</p>'
    };

    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent! ' + info.response);
        }
    });
}