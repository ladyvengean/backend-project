import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const healthcheck = asyncHandler(async (req, res) => {

    res.status(200).json({
        status: "OK",
        message: "The server is healthy and running."
    });
});

export { healthcheck };

    