const TokenManager = require('../helpers/TokenManager')
const getToken = require('../helpers/getToken')
const check = require('../helpers/helpers_checagem')
const Post = require('../models/Post')

module.exports = class PostsController {
  static async writeNewPost(req, res) {
    const entries = {
      text: req.body.text
    }

    if(check.temCampoVazio(entries)){
      return res.status(422).json({ message: "Post vazio" })
    }
    const token = getToken(req)
    if(!token){
      return res.status(403).json({ message: "Acesso negado" })
    }

    try{
      const user = await TokenManager.getUserByToken(token)
      //console.log(req.user)
      const post_info = {
        text: entries.text,
        author: user
      }
      const post = new Post(post_info)
      //console.log(post)
      await post.save()
      return res.status(201).json({message:"Post enviado.", post})
    }
    catch(err){
      return res.status(500).json({message:"Erro do servidor"})
    }
  }

  static async readAllPosts(req, res){
    try{
      const posts = await Post.find().sort({createdAt: 'descending'})
      return res.status(200).json(posts)
    }
    catch(err){
      return res.status(500).json({message:"Erro do servidor"})
    }
  }

  static async readPost(req, res){
    const post_id = req.params.id
    if(!post_id){
      return res.status(422).json({message:"Requisição inválida. Nenhum post encontrado"})
    }
    try{
      const post = await Post.findById(post_id)
      if(!post){
        return res.status(404).json({message:"Post não encontrado"})
      }
      return res.status(200).json(post)
    }
    catch(err){
      return res.status(500).json({message:"Erro do servidor"})
    }
  }

  static async readPostsByUser(req, res){
    const user_id = req.params.id
    try{
      const posts = await Post.find({"author.id":user_id})
      return res.status(200).json(posts)
    }
    catch(err){
      return res.status(500).json({message:"Erro do servidor"})
    }
  }

  static async deletePost(req, res){
    const token = req.cookies.token
    const post_id = req.params.id
    const logged_user = TokenManager.getUserByToken(token, res)

    try{
      const post = await Post.findById(post_id)
      if(!post){
        return res.status(404).json({message:"Post não encontrado"})
      }
      if(logged_user.id == post.author.id){
        await Post.findByIdAndDelete(post_id)
        return res.status(200).json({ message:"Post excluído" })
      }
      return res.status(403).json({ message:"Acesso negado" })
    }
    catch(err){
      return res.status(500).json({message:"Erro do servidor"})
    }
  }

  static async updateLike(req,res){
    const postId = req.params.id
    const {liked} = req.body
    const token = getToken(req)
    if(!token){
      return res.status(403).json({message:"Não autorizado"})
    }
    const user = await TokenManager.getUserByToken(token)
    
    try {
      const post = await Post.findById(postId)
      if (!post){
        return res.status(404).json({message:"Post não encontrado"})
      }

      if(liked){
        post.likes.push(user.id)
      }else {
        await post.likes.pull(user.id)
      }
  
      await post.save()
      return res.status(200).json({ likes: post.likes.length})
    } catch (error) {
      return res.status(500).json({message:error.message})
    }
    
  }
}
