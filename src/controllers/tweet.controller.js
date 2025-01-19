import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {Apierror, ApiError} from "../utils/Apierror.js"
import {Apiresponse, ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if (!content || content?.trim() === "") {
        throw new Apierror(400, "cant tweet blank space")
        
    }
    const tweet = await Tweet.create({content});
    if(!tweet){
        throw new Apierror(500, "did not get the content")
    }
    return res.status(201).json(new Apiresponse(201, tweet, "Tweet sent sucessfully"))


})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    if(!userId || !mongoose.isValidObjectId(userId)){
        throw new Apierror(400, "invalid userId")
    }

    const isUserPresent = await User.findById(userId)
    if(!isUserPresent){
        throw new Apierror(404, "user not found")
    }

    //now the user is there so fetchinf her tweets
    const tweets = await User.find({user : userId})
    const tweetcount  = tweets.length;
    res.status(200).json(new Apiresponse(200, {tweets,tweetcount}, "User tweets fetched successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetid } = req.params
    const {newContent} = req.body

    //cheking by if if that tweet exist in the tweet model
    if(!tweetid || !mongoose.isValidObjectId(tweetid)){
        throw new Apierror(400, "invalid tweetid")
    }

    const tweet = await Tweet.findById(tweetid);
    if(!tweet){
        throw new Apierror(404, "tweet not found")
    }
    //now we have the tweet
    tweet.content = newContent
    await tweet.save();
    //return it also
    return res.status(200).json(new Apiresponse(200, tweet, "updated sucessfully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetid} = req.params
    if(!tweetid || !mongoose.isValidObjectId(tweetid)){
        throw new Apierror(400, "inavlid tweetid")
    }
    const tweet = await Tweet.findById(tweetid)
    //now we have the tweet
    await Tweet.findByIdAndDelete(tweetid)
    res.status(204).json(new Apiresponse(204, {}, "tweet deleted sucessfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}