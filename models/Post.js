const mongoose = require('../db/conn')

const postSchema = new mongoose.Schema({
  text: { type: String, required: true },
  comments: Array,
  likes: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
  author: Object
}, {timestamps:true})

const Post = mongoose.model("Post", postSchema)

module.exports = Post
