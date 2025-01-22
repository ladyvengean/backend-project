import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {Apierror, ApiError} from "../utils/Apierror.js"
import {Apiresponse, ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId ||!mongoose.isValidObjectId(videoId)){
        throw new Apierror(400,"invalid id")
    }
    const skip = (page - 1) * limit
    const comments = await Comment.find({ video: videoId })
        .skip(skip)
        .limit(Number(limit))
        
    const count = await Comment.countDocuments({ video: videoId });

    if(comments.length ===0){
        throw new Apierror(404, "no comments found");
    }
    res.status(200).json(new Apiresponse(200, {count, comments}, "successfully retreived"))
    



    

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body
    
    if(!videoId || !mongoose.isValidObjectId(videoId)){
        throw new Apierror(400,"invalid id")
        
    }

    if (!content?.trim()) {
        throw new Apierror(400, "Content is required");
    }
    
    const newComment = await Comment.create({
        content: content,
        owner: req.user._id,
        video: videoId

    })
    res.status(200).json(200, {newComment}, "commented")

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {newContent}= req.body
    if (!newContent?.trim()) {
        throw new Apierror(400, "New content cannot be empty");
    }
    
    if(!commentId ||!mongoose.isValidObjectId(commentId)){
        throw new Apierror(400, "invalid commentId")
    }
    const com = await Comment.findById(commentId)
    if (!com) {
        throw new Apierror(404, "Comment not found");
    }
    
    com.content  = newContent
    await com.save()
    // const updatedComment = await Comment.findByIdAndUpdate(
    //     commentId, 
    //     { content: newContent },
    //     { new: true } 
    // );
    res.status(200).json(new Apiresponse(200, {com}, "updated comment"))



})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params
    if(!commentId ||!mongoose.isValidObjectId(commentId)){
        throw new Apierror(400, "invalid commentId")
    }

    const com  = await Comment.findByIdAndDelete(commentId)
    if(!com){
        throw new Apierror(404, "comment not fount")
    }
    res.status(200).json(new Apiresponse(200, {}, "successfully deleted"))


})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
    }