import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });

  const userRegister=asyncHandler(async (req,res) => {
         const {username,email,password}=req.body;
         // console.log(req.body);
         const pic=req.file;
         // console.log(pic);
         if([username,email,password].some((field)=>field?.trim()==="")){
            return res.status(400).json(new ApiError(401,"All field are required").toJSON());
         }
         if(!pic){
           return res.status(400).json(new ApiError(401,"Image is not selected").toJSON());
         }
         const image=await cloudinary.uploader.upload(pic?.path,{
            folder:"chatApp Profile picture"
         })

         const existedUser=await User.findOne(
            {
                $or:[{username},{email}]
            }
          )
          
         if(existedUser){
            console.log(existedUser);
            return res.status(400).json(new ApiError(400,"This User is already exist").toJSON());
         }
         const user=await User.create({
            username,
            email,
            password,
            profilePic:image.secure_url
         })
         console.log(user);
          return res.status(201).json(new ApiResponse(201,user,"User register Successfully"));
      })     

      
const userLogin=asyncHandler(async(req,res)=>{
   const {email,password}=req.body;
   console.log(req.body);
   const existedUser=await User.findOne({email})
   // console.log(existedUser);
   if(!existedUser){
         return res.status(400).json(new ApiError(400,"Invalid credentials").toJSON());
    }
   const isPassword=await existedUser.isPasswordCorrect(password);
   console.log(isPassword);
   if(!isPassword){
      // console.log(new ApiError(400,"password is Invalid").toJSON());
      return res.status(400).json(new ApiError(400,"Password is Invalid").toJSON());
   }
   const accessToken=await existedUser.generateAccessToken();
   const refreshToken=await existedUser.generateRefreshToken();
   existedUser.refreshToken=refreshToken;
   await existedUser.save({validateBeforeSave:false});
   
   const user=await User.find(existedUser._id).select("-password");
   // console.log(user);
   const options={
      httpOnly:true,
      secure:true,
      sameSite:"none"
   }
   console.log(user);   
   return res.status(201).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(201,user,"User login successfully"));
}) 





const userLogout=asyncHandler(async (req,res)=>{
   // console.log(req.user._id);
   await User.findByIdAndUpdate(req.user._id,
      {
         $set:{
         refreshToken:undefined
         }
      },
      {
         new:true
      }
   )
   // console.log(user);
   const options={
      httpOnly:true,
      secure:true,
      sameSite:"none"
   }
   return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken",options).json(new ApiResponse(200, {}, "User logged Out"))

            
})

export {userRegister,userLogin,userLogout}