const dotenv=require("dotenv")
dotenv.config();
const express= require("express")
const app = express()
const cors= require("cors")
const userRouter= require("./routes/user.routes")
const projectRouter= require("./routes/project.routes")
const adminRoutes= require("./routes/admin.routes")
const cookieParser=require("cookie-parser")
const connectToDb = require("./config/db")
connectToDb()

app.use(cors({
    origin: 'http://localhost:5173',  // The frontend URL
    credentials: true,               // Allow cookies (JWT token) to be sent with requests
  }));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("hello world")
})

app.use("/users",userRouter)
// app.use("/project",projectRouter)
app.use('/admin', adminRoutes);


module.exports=app