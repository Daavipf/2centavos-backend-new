const User = require("../models/User")
const check = require("../helpers/helpers_checagem")
const TokenManager = require("../helpers/TokenManager")
const bcrypt = require("bcryptjs")
const crypto = require('crypto')
const MailAuthHelper = require("../helpers/mailAuthHelper")

module.exports = class AuthController {
  static async register(req, res) {
    const entries = {
      username: req.body.username,
      realname: req.body.realname,
      email: req.body.email,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
    }

    if (check.temCampoVazio(entries)) {
      return res.status(422).json({ message: "Preencha todos os campos" })
    }
    if (await User.findOne({ username: entries.username })) {
      return res.status(422).json({ message: "Escolha outro nome de usuário" })
    }
    if (await User.findOne({ email: entries.email })) {
      return res.status(422).json({ message: "Escolha outro endereço de e-mail" })
    }
    if (check.comparaSenha(entries.password, entries.confirm_password)) {
      return res.status(422).json({ message: "As senhas não conferem" })
    }

    const salt = await bcrypt.genSalt(10)
    entries.password = await bcrypt.hash(entries.password, salt)

    try {
      const user = new User(entries)
      await user.save()
      return res.status(201).json({ message: "Usuário registrado com sucesso" })
    } catch (err) {
      return res.status(500).json({ message: "Erro do servidor. Contate o suporte" })
    }
  }

  static async login(req, res) {
    const entries = {
      email: req.body.email,
      password: req.body.password,
    }

    if (check.temCampoVazio(entries)) {
      return res.status(422).json({ message: "Preencha todos os campos" })
    }

    try {
      const user = await User.findOne({ email: entries.email })
      if (!user) {
        return res.status(404).json({ message: "Login inválido, tente novamente." })
      }
      if (!(await bcrypt.compare(entries.password, user.password))) {
        return res.status(401).json({ message: "Login inválido, tente novamente." })
      }

      const token = TokenManager.generateToken(user)
      return res.status(200).json({message: "Login realizado com sucesso", token: token})

    } catch (err) {
      return res.status(500).json({ message: "Erro do servidor. Contate o suporte" })
    }
  }

  static async forgotPassword(req,res){
    const entries = {
      email: req.body.email
    }

    if (check.temCampoVazio(entries)){
      return res.status(422).json({ message: "Preencha todos os campos" })
    }
    const user = await User.findOne({email: entries.email})
    if (!user){
      return res.status(404).json({ message: "Não existe usuário com este e-mail" })
    }

    const token = crypto.randomBytes(32).toString('hex')
    try {
      await MailAuthHelper.sendResetPasswordMail(user.email, token)
      user.resettoken = token
      user.tokenexpires = Date.now() + 3600000
      await user.save()
      return res.status(200).json({message:"E-mail enviado. Cheque sua caixa de entrada"})
    } catch (error) {
      return res.status(500).json({message:"Houve uma falha no envio do e-mail"})
    }
  }

  static async resetPassword(req,res){
    const {token} = req.params
    const entries = {
      new_password: req.body.new_password,
      confirm_new_password: req.body.confirm_new_password
    }
    if (check.temCampoVazio(entries)){
      return res.status(422).json({message:"Preencha todos os campos"})
    }
    const user = await User.findOne({resettoken: token})
    if (!user || user.tokenexpires < Date.now()){
      return res.status(403).json({message:"Token expirado ou inválido"})
    }
    if (!check.comparaSenha(entries.new_password, entries.confirm_new_password)) {
      return res.status(422).json({ message: "As senhas não conferem" })
    }
    
    try {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(entries.new_password, salt)
      user.resettoken = undefined
      user.tokenexpires = undefined
      await user.save()
      return res.status(201).json({message:"Senha redefinida com sucesso"})
    } catch (error) {
      return res.status(500).json({message:"Houve um erro, contate o suporte"})
    }
  }
}
