import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const isUserLogin=asyncHandler(async (req,res,next) => {
const accessToken=req.cookies?.accessToken ||  req.headers?.authorization?.split(" ")[1];
//  console.log(accessToken);
    const decodedData=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    if(!decodedData){
        return res.status(401).json(new ApiError(401,"Unauthorized user access the data"))
    }
    // console.log(decodedData);
    const user=await User.findById(decodedData._id).select("-password -refreshToken")
    // console.log(user);
    req.user=user;
    next();
}
)

export {isUserLogin}