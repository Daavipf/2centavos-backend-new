const express = require("express")
const router = express.Router()
const tm = require('../helpers/TokenManager')
const PostsController = require("../controllers/PostsController")

router.post('/write', tm.verifyToken, PostsController.writeNewPost)
router.get('/readall', PostsController.readAllPosts)
router.get('/read/:id', PostsController.readPost)
router.get('/readbyuser/:id', PostsController.readPostsByUser)
router.delete('/delete/:id', tm.verifyToken, PostsController.deletePost)

module.exports = router
