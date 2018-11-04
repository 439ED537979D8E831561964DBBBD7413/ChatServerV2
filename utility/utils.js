const nodemailer = require('nodemailer');

module.exports.sendEmail = function(email, message){

    let smtpConfig = {
        host: 'smtp.example.com',
        port: 587,
        secure: false, 
        auth: {
            user: 'username',
            pass: 'password'
        }
    };

    let message = {
        from: 'sender@server.com',
        to: email,
        subject: 'Password Reset Mail',
        text: message,
    };

    let transport = nodemailer.createTransport(smtpConfig);
    transport.sendMail(message, (err, response)=>{
        if(err){
            console.log("ERROR: "+err);
        }else{
            console.log("RESPONSE: "+response);
        }
    });

};