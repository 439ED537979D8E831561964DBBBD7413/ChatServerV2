const nodemailer = require('nodemailer');

module.exports.sendEmail = function(email, message){

    let smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: false, 
        auth: {
            user: 'himanshu10nain@gmail.com',
            pass: 'Nainhimanshu386'
        }
    };

    let message = {
        from: '"no-reply"<himanshu10nain@gmail.com>',
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
