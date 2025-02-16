import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true   
}));

app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes

import userRouter from './routes/user.routes.js'
import wasteReportRouter from "./routes/wasteReport.routes.js";
import collectorRouter from "./routes/collector.routes.js";


//routes declarartion
app.use("/api/v1/users", userRouter)
app.use("/api/v1/waste-report", wasteReportRouter);
app.use("/api/v1/collectors", collectorRouter);


// app._router.stack.forEach((middleware) => {
//     if (middleware.route) {
//         console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
//     } else if (middleware.name === 'router') {
//         middleware.handle.stack.forEach((handler) => {
//             if (handler.route) {
//                 console.log(`${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
//             }
//         });
//     }
// });





export { app }




