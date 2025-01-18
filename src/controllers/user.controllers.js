import { response } from "express";
import { asyncHandler } from "../utils/ayncHandler.js"
import {Apierror} from "../utils/Apierror.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

import {Apiresponse} from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken
        const refreshToken = user.generateRefreshToken

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
        return {accessToken, refreshToken}

        
    } catch (error) {
        throw new Apierror(500,"Something went wrong while generating access and refresh tokens")
        
    }
}

const registerUser = asyncHandler( async (req, res) => {
    //get user deatils from frontend
    //validation- not empty
    //check if user already exist: username and email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object- create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return response
    const {fullname, email, username, password} = req.body
    //console.log("email ", email);  
    

    if (
        [fullname,email,username,password].some((field) => field?.trim()==="")
    ) {
        throw new Apierror(400,"All fields are necessary")
    }

    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })
    if (existedUser) {
        throw new Apierror(409,"User with email or username already exists")
        
    }

    

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
        
    }

    if (!avatarLocalPath) {
        throw new Apierror(400,"Avatar file is required")

        
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new Apierror(400,"Avatar file is required")
        
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new Apierror(500,"something went wrong while registering")
    } 


    return res.status(201).json(
        new Apiresponse(200, createdUser, "User registered Successfully")
    )

    
    
    // res.status(200).json(
    //     {
    //         message:"heheheehe"
    //         }
    // )



    
})


const loginUser = asyncHandler(async(req,res) => {
    //req body se data lao
    //username or email
    //find the user
    //password check
    //acess and refresh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!(username || email)) {
        throw new Apierror(400, "username or email is required")
        
    }
    const user= await User.findOne({
        $or: [{username}, {email}]


    })
    if (!user) {
        throw new Apierror(404, "User does not exist")
        
    }

    const isPasswordValid = await user.isPasswordCorrect (password)
    if (!isPasswordValid) {
        throw new Apierror(401, "Password incorrect")
        
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new Apiresponse(
            200,
            {
                user: loggedInUser, accessToken,refreshToken
            }, 
            "User Logged In successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new Apiresponse(200,{},"User logged Out"))


})

const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new Apierror(401,"unauthorized request")
    }
    
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new Apierror(401,"Invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new Apierror(401,"Refresh token is expired or used")
    
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken",newRefreshToken, options)
        .json(
            new Apiresponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new Apierror(401, error?.message || "Invalid refresh token")
        
    }


})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}

