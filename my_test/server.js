var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var mysql = require('mysql');
const bodyParser = require('body-parser');
const port = process.env.port || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public/styles.css'));

app.get(['/', '/home'], (req, res) => {
    res.render('home', {
        title: 'Home'
    });
});

 /**
  * Send them to contact page
  */
 app.get('/contact', (req, res) =>{
        res.render('contact',{
            title: 'Contact us'
        });
 });

  /**
   * Recieved the contact page. Send them to comfirmation page and process the data
   */
app.post('/contact_action', (req, res) => {
    //Send them a confirmation email
    sendEmail(req.body.email);
    console.log(req.name);
    res.render('confirmation', {
        title: 'Confirmation',
        name: req.body.name,
        number: req.body.phoneNumber

    });
});
//   /**
//    * Send them to class listing page
//    */
//   app.get('/classes', (req, res) =>{
//        //get the class listing
//        try{
//            var allClasses = [];
//            getClasses(allClasses,res);
//        }
//        catch(error){
//            console.log('error with database.!');
//        }      
//   });


//    /**
//     * Get form to add a class
//     */
//app.get('/add_class', (req, res) =>{
//    res.render('add',{
//        title: 'Add Class'
//    })
//});

//    /**
//     * Add the class to database
//     */
//app.post('/add_class', (req, res) => {
//    
//    addClass(req, res);
//
//});


const server = app.listen(port, () => {
    console.log(`Express running -> PORT ${server.address().port}`);
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })


/**
 * Method to send them a confirmation email.
 * @param {} emailAdd 
 */
function sendEmail(emailAdd){
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'YOURGMAILUSERNAME@gmail.com',
            pass: 'YOURGMAILPASSWORD'
        }
    });

    var mailOptions = {
        from: 'YOURGMAILUSERNAME@gmail.com', 
        to: emailAdd,
        subject: 'Phone call Confirmation', 
        html: 'Hi there! <br> This is a confirmation email for your requested phone call <br> One of our dedicated advisors will be calling you shortly.<br>Looking forward to speaking with you, <br>The New College'
    };

    transport.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }
         else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function getClasses(classes, res){
    var con = mysql.createConnection({
        host: "localhost",
        username: "root",
        password: "YOURSQLPASSWORD",
        database: "newcollege",

    });

    con.connect(function(err){
        //var classes = [];
        if(err) throw err;
        else{
            console.log("connected!");
        }
        var sql = "select * from class";
        con.query(sql, function(err, result, fields){
            if (err){
                console.log("error here");
                console.log("err");
                throw err;
            } 
            for(var i = 0; i < result.length; i++){
                var Class = {
                    'name':result[i].CLASS_NAME,
                    'start':result[i].CLASS_START,
                    'day':result[i].CLASS_DAY,
                    'begin':result[i].CLASS_TIME_BEGIN,
                    'end':result[i].CLASS_TIME_END
                }
                classes.push(Class);
            }
            for(var i = 0; i < classes.length; i++){
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

function addClass(req, res ){
    var con = mysql.createConnection({
        host: "localhost",
        usernmae: "root",
        password: "YOURSQLPASSWORD", 
        database: "newcollege"
    });

    con.connect(function(err){
        if(err) throw err;
        else{
            console.log("Connected...")
        }
        var sql = "INSERT INTO `class`( `CLASS_NAME`, `CLASS_START`, `CLASS_DAY`, `CLASS_TIME_BEGIN`," + 
        " `CLASS_TIME_END`) VALUES ('" + req.body.name+"','"+ req.body.start_date +"','" +  req.body.day + "','" +  req.body.start_time + "','" + req.body.end_time + "')";
        console.log("sql query: " + sql);
        con.query(sql, function (error, results, fields) {
            if (error) throw error;
            res.redirect('/classes');
          });
    });
}