// https://www.youtube.com/watch?v=n8fVC5UFRjA

require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendMail(to, sub, msg) {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: sub,
    html: msg
  }, (err, info) => {
    if (err) {
      console.error("Error sending mail:", err);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = { sendMail };