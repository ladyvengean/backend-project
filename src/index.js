//require('dotenv').config({path: './env'})

import express from "express";
//const app = express()
import {app} from './app.js'

import dotenv from "dotenv"

import connectDB from "./db/index.js";



dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) =>{
    console.log("mongo db connection failed", err);

})




/*
import express from "express";
const app = express()

//function connectDB(){}

//connectDB()

//other approach by iffe
;(async ()=>{
    try {
        await  mongooose.connect(`${process.env.
            MONGODB_URI}/${DB_NAME}`)
            app.on("error", (error) => {
                console.log("application not able to talk to database")
                throw error 
            })

            app.listen(process.env.PORT, () => {
                console.log(`App is listening on port ${process.env.PORT}`)
            })
        
    } catch (error) {
        console.error("ERROR: ",error)
        
    }
})()
*/    

