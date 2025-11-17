import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const isUserLogin=asyncHandler(async (req,res,next) => {
const refreshToken=req.cookies?.refreshToken ||  req.headers?.Authorization?.split(" ")[1];
//  console.log(accessToken);
    const decodedData=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
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