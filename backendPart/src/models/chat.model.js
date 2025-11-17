import mongoose from "mongoose";
 const chatSchema=new mongoose.Schema({
    chatName:{
        type:String,trim:true,
    },
    isGroupChat:{
        type:Boolean,default:false
     },
    users:[{
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    }],
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    },
    newlyMessage:{
        type:String,default:""
    },
    seenStatus:{
        type:Boolean,default:false
    }
},{timestamps:true})

export const Chat=mongoose.model("Chat",chatSchema)