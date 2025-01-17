var express = require('express');
var app = express();
var mysql = require('mysql');
var methods = require('./methods');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.port || 3000;
const server = app.listen(port, () => { console.log(`Express running -> PORT ${server.address().port}`); });

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use('/favicon.ico', express.static('img/favicon.ico'));

// homepage and book listings
app.get(['/', '/home'], (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/books', (req, res) => {
    try {
        getBooks(res);
    }
    catch (error) {
        console.log('Error with database!');
    }
});

app.post('/browse_action', (req, res) => {
    console.log(req.body);
    var con = initConnection();

    con.connect(function (err) {
        if (err) throw err;
        else {
            console.log("Connected!");
        }

        var b = req.body.browse;
        var sql = "select * from book where title like '%" + b + "%'";
        console.log(sql);

        con.query(sql, function (err, result) {
            if (err) {
                console.log("err");
                throw err;
            }

            var books = getBooksLoop(result);
            res.render('books', { specificTitle: b, list: books });
        });
    });

});

// add
app.get('/sell', (req, res) => {
    res.render('sell.pug', { title: 'Sell Book' });
});

app.post('/sell_action', (req, res) => { addBook(req, res); });

// misc
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

app.post('/contact_action', (req, res) => {
    methods.sendEmail(req.body.nameEntry, req.body.emailEntry, req.body.msgEntry);
    console.log(req.body);

    res.render('contact_confirmation', {
        title: 'Confirmation',
        name: req.body.nameEntry,
        email: req.body.emailEntry,
        msg: req.body.msgEntry
    });
    // res.redirect('/contact'); //not here, and after few moments
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

app.get('/account', (req, res) => {
    res.render('account', { title: 'My Account' });
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
    res.redirect('/home'); //after seconds...
})

function getBooksLoop(result) {
    var updated = [];
    for (var i = 0; i < result.length; i++) {
        var Book = {
            'title': result[i].Title,
            'isbn': result[i].ISBN_10,
            'prof': result[i].Professor,
            'cat': result[i].Category
        };
        updated.push(Book);
        console.log(Book);
    }

    console.log("Done books...\n");
    return updated;
}

function getBooks(res) {
    var con = initConnection();

    con.connect(function (err) {
        if (err) throw err;
        else {
            console.log("Connected!");
        }

        var sql = "select * from book";
        con.query(sql, function (err, result) {
            if (err) {
                console.log("err");
                throw err;
            }
            var books = getBooksLoop(result);
            res.render('books', { specificTitle: 'All Books', list: books });
        });
    });

}

function addBook(req, res) {
    var con = initConnection();

    con.connect(function (err) {
        if (err) throw err;
        else {
            console.log("Connected...")
        }

        var query = req.body;
        var sqlInsert = "INSERT INTO book (Title, Category, `ISBN_10`,`ISBN_13`, Professor, Image) VALUES (?)";
        var VALUES = [query.title, query.cat, query.isbn, 0000000000000, query.prof, '/public/img/no-image.png']; //yes?

        console.log("sql: " + sqlInsert + VALUES);
        con.query(sqlInsert, [VALUES], function (error) {
            if (error) throw error;

            console.log("Added to the Database.");
            res.redirect('/books');
        });

        //also into booksAvailable () VALUES (?) ...
        //also into professor () VALUE ...
        //also into major () VALUE ...

    });
}

function initConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "bookswap"
    });
}
