const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
}));

module.exports.send = (options) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: options.mailto,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error, process.env.MAIL_USER, process.env.MAIL_PASS);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};
