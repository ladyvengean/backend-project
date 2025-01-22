import {Router} from "express"
import {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js"


import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()
router.use(verifyJWT)

router.route("/video/:videoId").get(getVideoComments)
router.route("/video/:videoId").post(addComment)
router.route("/:commentId").patch(updateComment)
router.route("/:commentId").delete(deleteComment)

export default router

