const transporter = require('./mailTransporter')
const User = require('../models/User')

module.exports = class MailAuthHelper{
  static async sendResetPasswordMail(user_email, token){
    const reset_link = `${process.env.FRONTEND_URL}/resetpassword/${token}`

    const message = {
      from: "davi.pferreira2705@gmail.com",
      to: user_email,
      subject: "Redefinição de senha da sua conta 2Centavos",
      html: `<p>Você solicitou a redefinição de senha. Acesse o link abaixo para redefinir sua senha:</p>
           <a href="${reset_link}">Redefinir Senha</a>`
    }

    await transporter.sendMail(message)
  }
}