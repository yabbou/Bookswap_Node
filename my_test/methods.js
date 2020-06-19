
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
        to: 'bookswap2020@gmail.com', //to myself, but could also send confim to them as well...
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
module.exports.sendEmail = sendEmail;