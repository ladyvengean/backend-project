import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";


const router = Router()

router.route("/register").post(registerUser)

//register lagaunga toh ye regusterUser method call ho jayega
export default router




