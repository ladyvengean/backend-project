import {Router} from "express";

//import controllers 
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js"

const router = new Router()
import {verifyJWT} from "../middlewares/auth.middleware.js"

router.use(verifyJWT)

router.route("/:videoId").patch(toggleSubscription)
router.route("/:channelId").get(getUserChannelSubscribers)
router.route("/:subscriberId").get(getSubscribedChannels)



