import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema({
     username:{
        type:String,required:true,unique:true,lowercase:true,trim:true,
        index:true
      },
     email:{
        type:String,required:true,unique:true
     },
     password:{
        type:String,required:true,
     },
     profilePic:{
      type:String,
      default:"https://static.vecteezy.com/system/resources/previews/026/619/142/original/default-avatar-profile-icon-of-social-media-user-photo-image-vector.jpg"
      },
     refreshToken:{
        type:String
      }
},{timestamps:true})

userSchema.pre("save",async function (next){
if(!this.isModified("password")) return next();
// 10 is no. of round that algorithm takes  to hash the password
 this.password=await bcrypt.hash(this.password,10)
 return next(); })

userSchema.methods.isPasswordCorrect=async function(password){
   return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
   return jwt.sign(
      {
         _id:this._id,
         username:this.username,
         email:this.email
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      }
   )
}

userSchema.methods.generateRefreshToken=function(){
  return jwt.sign(
      {
         _id:this._id
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
      }
   )
   
}


export const User=mongoose.model("User",userSchema)



