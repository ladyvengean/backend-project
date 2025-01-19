import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus

} from "../controllers/tweet.controller.js"

const router = Router()
import {verifyJWT} from "../middlewares/auth.middleware.js"

router.use(verifyJWT)

router.route("/").post(publishAVideo)

router.route("/users/:userId").get(getAllVideos)

router.route("/:videoId").get(getVideoById).patch(updateVideo).delete(deleteVideo)
router.route("/:videoId/toggle").patch(togglePublishStatus)

