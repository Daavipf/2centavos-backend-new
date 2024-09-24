const jwt = require("jsonwebtoken");
const getToken = require('./getToken');
const User = require('../models/User');

module.exports = class TokenManager {
  // Gerar token a partir dos dados do usuário
  static generateToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      realname: user.realname,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' }); // Pode definir um tempo de expiração, se necessário
    return token;
  }

  // Recuperar usuário pelo token
  static async getUserByToken(token, res) {
    try {
      // Verifica o token
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      if (!verified) {
        return res.status(400).json({ message: "Token inválido" });
      }

      // Busca o usuário no banco
      const user = await User.findById(verified.id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      // Retorna o usuário
      return user;
    } catch (error) {
      return res.status(400).json({ message: "Houve um erro na sua solicitação" });
    }
  }

  // Middleware para verificar o token
  static verifyToken(req, res, next) {
    const token = getToken(req);
    if (!token) {
      return res.status(403).json({ message: "Acesso negado, token não fornecido" });
    }

    try {
      // Verifica o token e adiciona os dados ao request
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      req.user = verified;
      next();
    } catch (error) {
      res.status(403).json({ message: "Acesso negado, token inválido" });
    }
  }
};
