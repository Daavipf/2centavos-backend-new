module.exports = class Checagem {
  static temCampoVazio(obj) {
    for (const campo in obj) {
      if (!obj[campo] || obj[campo] == "") {
        return true;
      }
    }
    return false;
  }

  static comparaSenha(senha, confirma_senha){
    if (senha != confirma_senha){
      return false
    }
    return true
  }
};
