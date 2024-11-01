import express from 'express'
import mongoose from 'mongoose'
import doteenv from 'dotenv'
import authRoutes from "./routes/auth.route.js"
import cookieParser from 'cookie-parser';

doteenv.config()
const app= express()


app.use(express.json())
app.use(cookieParser());
app.use("/api/auth", authRoutes)






const connected= async ()=>{
    try{
        const connected= await mongoose.connect(process.env.DATABASE_URL)
        console.log(`connected to db : ${connected.connection.host}`)
    }  catch(e){
        console.log("eror", e.message)
    }
}
app.listen(3000, ()=>{
    console.log("listening on 3000")
    console.log(process.env.DATABASE_URL)
    connected()
})