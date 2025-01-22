import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/ayncHandler.js";


const healthcheck = asyncHandler(async (req, res) => {

    res.status(200).json({
        status: "OK",
        message: "The server is healthy and running."
    });
});

export { healthcheck };

    