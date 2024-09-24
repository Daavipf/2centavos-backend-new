const mongoose = require("../db/conn")

const userSchema = new mongoose.Schema({
  realname: {type: String, required:true},
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilepicture: {type: String, default: ""},
  bio: {type: String, default: ""},
  savedposts: Array,
  resettoken: {type: String, default: undefined},
  tokenexpires: {type: Date, default: undefined}
}, {timestamps:true})

const User = mongoose.model("User", userSchema)

module.exports = User
