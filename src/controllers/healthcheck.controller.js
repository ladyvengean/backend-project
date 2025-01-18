import {ApiError} from "../utils/Apirrror.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/ayncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
})

export {
    healthcheck
    }
    