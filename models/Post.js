const mongoose = require('../db/conn')

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  comments: Array,
  likes: {type: Number, default: 0},
  author: Object
}, {timestamps:true})

const Post = mongoose.model("Post", postSchema)

module.exports = Post
