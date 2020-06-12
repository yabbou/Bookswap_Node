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

// homepage and book listings
app.get(['/', '/home'], (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/books', (req, res) => {
    try {
        var allBooks = [];
        getBooks(allBooks, res);
    }
    catch (error) {
        console.log('Error with database!');
    }
});

// add
app.get(['/sell'], (req, res) => {
    res.render('sell.pug', { title: 'Sell Book' });
});

app.post('/sell_action', (req, res) => { addBook(req, res); });

// misc
app.get(['/contact'], (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

app.post('/contact_action', (req, res) => {
    sendConfimationEmail(req.body.email);
    console.log(req.name);
    res.render('contact_confirmation', {
        title: 'Confirmation',
        name: req.body.name,
        number: req.body.phoneNumber

    });
});

app.get(['/account'], (req, res) => {
    res.render('account', { title: 'My Account' });
});

// todo: impl...

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

// todo: implement thsee

// heavy-lifters 
function sendConfimationEmail(email) {
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

function getBooks(books, res) {
    var con = mysql.createConnection({
        host: "localhost",
        username: "root",
        password: "",
        database: "bookswap",

    });

    con.connect(function (err) {
        var books = [];
        if (err) throw err;
        else {
            console.log("Connected!");
        }
        var sql = "select * from book";
        con.query(sql, function (err, result, fields) {
            if (err) {
                console.log("err");
                throw err;
            }
            for (var i = 0; i < result.length; i++) {
                var Book = {
                    'title': result[i].TITLE,
                    'isbn': result[i].ISBN,
                    'prof': result[i].PROF,
                    'cat': result[i].CAT
                }
                books.push(Book);
            }
            for (var i = 0; i < books.length; i++) {
                console.log(books[i]);
            }
            console.log("Done...");

            res.render('/books', {
                title: 'Books',
                list: books
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