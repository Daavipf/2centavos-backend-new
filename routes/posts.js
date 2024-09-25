const express = require("express")
const router = express.Router()
const TokenManager = require('../helpers/TokenManager')
const PostsController = require("../controllers/PostsController")

router.post('/write', TokenManager.verifyToken, PostsController.writeNewPost)
router.get('/readall', PostsController.readAllPosts)
router.get('/read/:id', PostsController.readPost)
router.get('/readbyuser/:id', PostsController.readPostsByUser)
router.delete('/delete/:id', TokenManager.verifyToken, PostsController.deletePost)
router.post('/updatelike/:id', TokenManager.verifyToken, PostsController.updateLike)

module.exports = router
