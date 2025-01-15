import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.js"






const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }

    ]),
    registerUser
)

//register lagaunga toh ye regusterUser method call ho jayega
export default router




