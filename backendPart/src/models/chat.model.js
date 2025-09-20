import mongoose from "mongoose";
 const chatSchema=new mongoose.Schema({
    chatName:{
        type:String,
        trim:true,
    },
    isGroupChat:{
        type:Boolean,
        default:false
     },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    newlyMessage:{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"Message"
        type:String,
        default:""
    },
    seenStatus:{
        type:Boolean,
    }
    

},{timestamps:true})

 export const Chat=mongoose.model("Chat",chatSchema)