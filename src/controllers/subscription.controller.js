import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscriptions.model.js"
import {ApiError} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!channelId || !mongoose.isValidObjectId(channelId)){
        throw new Apierror(400, "invalid channel id")
    }

    const subscription = await Subscription.findOne({subscriber: req.user._id, channel: channelId})
    ///Subscription.findOne():
    // This is a Mongoose method that searches for a single document in the Subscription collection that matches the specified query. 
    // It returns the first document that matches the criteria, or null if no document is found.
    if(subscription){
        await subscription.remove()
        return res.status(200).json(new Apiresponse(200, {subscription:false},"unsubscribed"))

    }
    const newSubscription = await Subscription({subscriber: req.user._id, channel: channelId})
    return res.status(200).json(new Apiresponse(200, { subscribed: true }, "Subscribed"));

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!channelId || !mongoose.isValidObjectId(channelId)){
        throw new Apiresponse(400, "invalid channelid")
    }
    const channel = await Subscription.findById(channelId)
    if(!channel){
        throw new Apierror(400, "channel not found")
    }
    const subscription = await Subscription.find({channel: channelId})
    const count = subscription.length
    res.status(200).json(new Apiresponse(200,{subscription, count}, "found"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!subscriberId || !mongoose.isValidObjectId(subscriberId)){
        throw new Apierror(400,"invalid id ")
    }
    
    

    const subscriptions = await Subscription.find({subscriber: subscriberId})

    if (!subscriptions || subscriptions.length === 0) {
        throw new Apierror(400, "user not found or no subscriptions");
    }

    

    const count =  subscriptions.length
    res.status(200).json(new Apiresponse(200,{subscriptions, count}, "found"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}