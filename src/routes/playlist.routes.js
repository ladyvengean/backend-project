import {Router} from "express"
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
    
} from "../controllers/playlist.controller.js"


import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()
router.use(verifyJWT)

router.post("/", createPlaylist);


router.get("/user/:userId", getUserPlaylists);


router.get("/:playlistId", getPlaylistById);


router.patch("/:playlistId/video/:videoId", addVideoToPlaylist);


router.delete("/:playlistId/video/:videoId", removeVideoFromPlaylist);


router.patch("/:playlistId", updatePlaylist);


router.delete("/:playlistId", deletePlaylist);

export default router;