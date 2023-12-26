const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport');

const sendEmail = async (email, subject, html, text) => {
    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'localhost',
        port: 465,
        secure: true,
        auth: {
            user: 'sakshamjbj@gmail.com',
            pass: 'uecu vavd fvem unjq'
        }
    }));

    transporter.sendMail({
        from: 'sakshamjbj@gmail.com',
        to: email,
        subject,
        text,
        html
    }, (err, info) => {
        if (err) {
            return { mailSent: false, error: err }
        }
    });
}

module.exports = sendEmail; 