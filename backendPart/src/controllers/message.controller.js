import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const sendnewMessage=asyncHandler(async(req,res)=>{
    const {messageContent,chatId}=req.body;
    console.log(messageContent,chatId);
    if(!req.body){
        return res.status(401).json(new ApiError(400,"please send the required details").toJSON());
    }
    const newMessage=await Message.create({
        sender:req.user._id,
        messageContent,
        chat:chatId
    })
    var message=await Message.findById(newMessage._id).populate("sender","-password -refreshToken")
    .populate("chat")
    
    message=await User.populate(message,
     {
        path:"chat.users",
        select:"username profilePic"
    })

    await Chat.findByIdAndUpdate(chatId,{
        newlyMessage:messageContent
      }
    )
    // console.log(message);
    // console.log(newMessage);

    // const populatedMessage=await Message.findById(newMessage._id)
    return res.status(200).send(message);
})


const fetchAllMessages=asyncHandler(async (req,res) => {
    const {chatId}=req.body;
    if(!req.body){
        res.status(400).json(new ApiError(400,"unable to fetch messages").toJSON());
    }
    const data=await Message.find({chat:chatId}).populate("sender","username profilePic").populate("chat")
   return res.status(200).send(data);
})

export {sendnewMessage,fetchAllMessages}