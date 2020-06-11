var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var mysql = require('mysql');

const port = process.env.port || 3000;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.listen(port, () => {
    console.log(`Express running -> PORT 3000`);
});

app.get(['/', '/home'], (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get(['/sell'], (req, res) => {
    res.render('sell_book.html');
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

/**
 * Method to send them a confirmation email.
 * @param {} email 
 */
function sendEmail(email) {
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'YOURGMAILUSERNAME@gmail.com',
            pass: 'YOURGMAILPASSWORD'
        }
    });

    var mailOptions = {
        from: 'YOURGMAILUSERNAME@gmail.com',
        to: email,
        subject: 'Phone call Confirmation',
        html: 'Hi there! <br> This is a confirmation email for your requested phone call <br> One of our dedicated advisors will be calling you shortly.<br>Looking forward to speaking with you, <br>The New College'
    };

    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// todo: implement thsee

function getBooks(classes, res) {
    var con = mysql.createConnection({
        host: "localhost",
        username: "root",
        password: "YOURSQLPASSWORD",
        database: "newcollege",

    });

    con.connect(function (err) {
        //var classes = [];
        if (err) throw err;
        else {
            console.log("connected!");
        }
        var sql = "select * from class";
        con.query(sql, function (err, result, fields) {
            if (err) {
                console.log("error here");
                console.log("err");
                throw err;
            }
            for (var i = 0; i < result.length; i++) {
                var Class = {
                    'name': result[i].CLASS_NAME,
                    'start': result[i].CLASS_START,
                    'day': result[i].CLASS_DAY,
                    'begin': result[i].CLASS_TIME_BEGIN,
                    'end': result[i].CLASS_TIME_END
                }
                classes.push(Class);
            }
            for (var i = 0; i < classes.length; i++) {
                console.log(classes[i]);
            }
            console.log("done looping");
            //return classes;
            res.render('classes', {
                title: 'Class listing',
                list: classes
            });
        });

    });

}

function addBook(req, res) {
    var con = mysql.createConnection({
        host: "localhost",
        usernmae: "root",
        password: "YOURSQLPASSWORD",
        database: "newcollege"
    });

    con.connect(function (err) {
        if (err) throw err;
        else {
            console.log("Connected...")
        }
        var sql = "INSERT INTO `class`( `CLASS_NAME`, `CLASS_START`, `CLASS_DAY`, `CLASS_TIME_BEGIN`," +
            " `CLASS_TIME_END`) VALUES ('" + req.body.name + "','" + req.body.start_date + "','" + req.body.day + "','" + req.body.start_time + "','" + req.body.end_time + "')";
        console.log("sql query: " + sql);
        con.query(sql, function (error, results, fields) {
            if (error) throw error;
            res.redirect('/classes');
        });
    });
}