import mongoose from "mongoose";
 const messageSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    messageContent:{
        type:String,
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    }

},{timestamps:true})

 export const Message=mongoose.model("Message",messageSchema)