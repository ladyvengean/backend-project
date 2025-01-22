import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {Apierror, ApiError} from "../utils/Apierror.js"
import {Apiresponse, ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const {videoId} = req.params
    //TODO: create playlist
    if(!name){
        throw new Apierror(400, "name is required")
    }
    if(!videoId || !mongoose.isValidObjectId(videoId)){
        throw new Apierror(400,"invalid id")
    }

    const neww = await Playlist.create({
        video: videoId,
        owner: req.user._id,
        name : name,
        description: description,
    })
    res.status(200).json(new Apiresponse(200, {neww} ,"successfully created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!userId || !mongoose.isValidObjectId(userId)){
        throw new Apierror(400,"invalid id")
    }
    const playlists = await Playlist.find({owner: userId})
    const count = await Playlist.countDocuments({owner: userId})

    res.status(200).json(new Apiresponse(200,{count, playlists}, "successfully fetched"))
    


})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!playlistId || !mongoose.isValidObjectId(playlistId)){
        throw new Apierror(400,"invalid id")
    }
    const play = await Playlist.findById(playlistId)

    res.status(200).json(200, {play}, "got it")
    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) {
        throw new Apierror(400, "Invalid playlist ID or video ID");
    }
    const play = await Playlist.findByIdAndUpdate(
        playlistId, 
        { $push: { videos: videoId } }, 
        { new: true } 
    );
    

    if (!play) {
        throw new Apierror(404, "Playlist not found");
    }

    res.status(200).json(new Apiresponse(200, {play}, "done"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!mongoose.isValidObjectId(playlistId) || !mongoose.isValidObjectId(videoId)) {
        throw new Apierror(400, "Invalid playlist ID or video ID");
    }

    const play = await Playlist.findByIdAndUpdate(
        playlistId, 
        { $pull: { videos: videoId } }, 
        { new: true } 
    )
    if (!play) {
        throw new Apierror(404, "Playlist not found");
    }

    res.status(200).json(new Apiresponse(200, {play}, "done"))


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!playlistId){
        throw new Apierror(400, "invalid id")
    }
    const playlistTobeDeleted = await Playlist.findByIdAndDelete(playlistId)

    if(!playlistTobeDeleted){
        throw new Apierror(404, "not found")
    }
    res.status(200).json(new Apiresponse(200, {}, "deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    const playlistTobeUpdated = await Playlist.findByIdAndUpdate(
        playlistId,
        {name : name,
        description: description},
        {new : true}
    )
    if (!playlistTobeUpdated) {
        throw new Apierror(404, "Playlist not found");
    }

    res.status(200).json(new Apiresponse(200, {playlistTobeUpdated}, "done "))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}