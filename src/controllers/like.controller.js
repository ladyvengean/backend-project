import mongoose, {isValidObjectId, mongo} from "mongoose"
import {Like} from "../models/like.model.js"
import {Apierror, ApiError} from "../utils/Apierror.js"
import {Apiresponse, ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!videoId || !mongoose.isValidObjectId(videoId)){
        throw new Apierror(400, "invalid video id")
    }
    //check if a like document exist with the user id and video id
    const existed = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if(existed){
        await existed.remove();
        res.status(200).json(new Apiresponse(200,{}, "unliked"))
    }
    else{
        await Like.create({video: videoId, likedBy: req.user._id})
        res.status(200).json(new Apiresponse(200,{}, "liked" ))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!commentId){
        throw new Apierror(400,"invalid id")
    }
    const existedLikeOnComment = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id

    })
    if(existedLikeOnComment){
        existedLikeOnComment.remove();
        res.status(200).json(new Apiresponse(200, {} ,"unliked"))
    }
    else{
        await Like.create({commend: commentId, likedBy: req.user._id})
        res.status(200).json(new Apiresponse(200,{}, "liked" ))
    }


})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!tweetId || !mongoose.isValidObjectId(tweetId)){
        throw new Apierror(400,"invalid id")
    }
    const existedLikeOnTweet = await Like.findOne({
        tweet : tweetId,
        likedBy: req.user._id
    })
    if(existedLikeOnTweet){
        await existedLikeOnTweet.remove();
        res.status(200).json(new Apiresponse(200, {} ,"unliked"))
    }
    else{
        await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
        res.status(200).json(new Apiresponse(200,{}, "liked" ))

    }
}
)

    const getLikedVideos = asyncHandler(async (req, res) => {
        //TODO: get all liked videos
        //basically count the existed liked videos in like model
        const {videoId} = req.params
        if (!videoId || !mongoose.isValidObjectId(videoId)) {
            throw new Apierror(400, "Invalid or missing video ID");
        }
        const likedVideos = await Like.find({video: videoId})
        const count = likedVideos.length;
        if(likedVideos.length === 0){
            throw new Apierror(404, "no liked videos found")
        }
        res.status(200).json(new Apiresponse(200, {count, likedVideos}, "successfully retreived liked videos"))

    })

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}