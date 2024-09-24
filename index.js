require(`dotenv`).config()
const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(express.json())
app.use(express.static("tmp"))
app.use(cookieParser())
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));

const auth = require("./routes/auth")
app.use("/auth", auth)
const user = require("./routes/user")
app.use("/user", user)
const posts = require("./routes/posts")
app.use("/posts", posts)

app.listen(process.env.PORT, () => {
  console.log(`App rodando na porta ${process.env.PORT}`)
})
