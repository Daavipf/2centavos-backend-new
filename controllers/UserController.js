const TokenManager = require('../helpers/TokenManager')
const getToken = require('../helpers/getToken')

module.exports = class UserController {
  static async viewUser(req, res){
    const token = getToken(req)

    if(!token){
      return res.status(403).json({ message: "Acesso negado" })
    }
    const user = await TokenManager.getUserByToken(token, res)
    //console.log(user)
    return res.status(200).json(user)
  }
}
