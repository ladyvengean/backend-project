import {Router} from "express"

import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controller.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()
router.use(verifyJWT)

router.route("/video/:videoId").patch(toggleVideoLike)
router.route("/comment/:commentId").patch(toggleCommentLike)

router.route("/tweet/:tweetId").patch(toggleTweetLike)

router.route("/video/:videoId").get(getLikedVideos)








