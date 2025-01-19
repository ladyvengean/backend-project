import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/Apierror.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const pageNumber = parseInt(page,10)
    const limitNumber = parseInt(limit,10)
    const skip = (pageNumber-1)*limitNumber
    const filter = {}
    if(query){
        filter.title = {$regex: query, $options: "i"}
    }
    if(userId){
        filter.user = userId
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortType === "asc"? 1: -1

    try {
        const videos = await Video.find(filter).skip(skip).limit(limitNumber).sort(sortOptions)

        const totalvideos = await Video.countDocuments(filter);
        const totalPages = Math.ceil(totalVideos / limitNumber);

        
        return res.status(200).json(new Apiresponse(200,{videos, totalVideos, totalPages, page: pageNumber, limit: limitNumber }, "videos fetched"))
        
    } catch (error) {
        throw new Apierror(500, "some error in fetching those")
        
    }

    
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const videoFile = req.file?.path
    if(!videoFile){
        throw new Apierror(400, "video file is necessary to move forward")

    }
    const video = await uploadOnCloudinary(videoFile)
    if(!video.url){
        throw new Apierror(404, "Error while uploading on cloudinary")

    }
    const newVid = await Video.create({title, description, videoUrl: video.url})

    
    return res.status(200).json(new Apiresponse(200, {newVid}, "video has been updated"));


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId || !mongoose.isValidObjectId(videoId)){
        throw new Apierror(400, "invalid videoId" )
    }

    //now we have the videoid
    const gotVideo = await Video.findById(videoId)
    if(!gotVideo){
        throw new Apierror(404, "video not found")
    }
    return res.status(200).json(new Apiresponse(200, {gotVideo}, "found video suncessfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description
    const {title, description} = req.body
    

    

    if(!videoId || !mongoose.isValidObjectId(videoId)){
        throw new Apierror(400, "invalid video Id")
    }
    //now we have the videoid
    const video = await Video.findById(videoId)
    //now we have the video
    if(!video){
        throw new Apierror(404, "video not found")
    }
    if(title){
        video.title = title

    }
    
    if(description){
        video.description = desciption
    }
    await video.save()
    return res.status(200).json(new Apiresponse(200, {video} , "video details updated sucessfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!videoId){
        throw new Apierror(400,"invalid id")
    }
   
    const video = await Video.findByIdAndDelete(videoId)
    if(!video){
        throw new Apierror(404,"video not found")
    }
    res.status(200).json(new Apiresponse(200, {}, "successfully deleted"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new Apierror(400,"invalid id")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new Apierror(404, "video not found")
    }
    video.isPublished = !video.isPublished
    await video.save()
    res.status(200).json(new Apiresponse(200, {isPublished: video.isPublished}, "changed publish status"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}