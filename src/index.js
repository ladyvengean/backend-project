//require('dotenv').config({path: '/.env'})
import dotenv from "dotenv"


import mongoose from "mongoose";

import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()




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

