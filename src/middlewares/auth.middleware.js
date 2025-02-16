import { Apierror } from "../utils/Apierror.js";

import {asyncHandler} from "../utils/asyncHandler.js"

import jwt from "jsonwebtoken"
import User from "../models/user.models.js"
 

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Token from cookies:", req.cookies?.accessToken);
        // console.log("Token from Authorization header:", req.header("Authorization"));

        if (!token) {
            throw new Apierror(401, "Unauthorized request - No token provided");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", decodedToken);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        console.log("User found in DB:", user);

        if (!user) {
            throw new Apierror(401, "Invalid Access Token - User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        throw new Apierror(401, error?.message || "Invalid access token");
    }
});
