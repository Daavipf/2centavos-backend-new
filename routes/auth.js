const express = require("express")
const router = express.Router()

const AuthController = require("../controllers/AuthController")

router.post("/register", AuthController.register)
router.post("/login", AuthController.login)
router.post("/forgotpassword", AuthController.forgotPassword)
router.post("/resetpassword/:token", AuthController.resetPassword)

module.exports = router
