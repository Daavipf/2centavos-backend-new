const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host:'smtp.sendgrid.net',
  port: 465,
  secure: true,
  auth:{
    user: process.env.MAIL_SERVICE_USER,
    pass: process.env.MAIL_SERVICE_PASSWORD
  }
})

module.exports = transporter