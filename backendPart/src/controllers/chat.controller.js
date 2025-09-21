import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { ApiError } from "../utils/apiError.js";
// import {useNavigate} from "react-router-dom";
// import { ApiResponse } from "../utils/apiResponse.js";
const accessChat=asyncHandler(async (req,res) => {
    const {userId}=req.body
    console.log(userId);
    // const registerUser=await User.findById({_id:userId});
     var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            { users:userId},
            { users:req.user._id}
        ],
    }).populate("users","-password -refreshToken")
//     .populate("newlyMessage") 
    
//    isChat=await User.populate(isChat,
//     {   
//         path:"newlyMessage.sender",
//         select:"username email profilePic",
//     });
    
  if(isChat.length>0){
    console.log(isChat);
    return res.status(200).send(isChat);
   } 
  else{
    const chatData={
        chatName:"",
        isGroupChat:false,
        users:[req.user._id,userId]
    }
    try {
        const createdchatData=await Chat.create(chatData)
        // console.log(createdchatData);
        const fullchatData=await Chat.findById({_id:createdchatData._id}).populate("users","-password -refreshToken")
        // .populate("newlyMessage")
        console.log(fullchatData);       
        return res.status(200).send(fullchatData);    
    } 
    catch (error) {
        res.status(500)
        .json(new ApiError(500,"chat not accessible"))
        
    }
}
})

const singleChat=asyncHandler(async (req,res) => {
        const {chatId}=req.body;
        const chatData=await Chat.findById(chatId); 
        res.status(200).send(chatData);   
 })

const fetchMatchUser=asyncHandler(async (req,res) => {
    // const navigate=useNavigate();

        const keyword=req.query.input?{
        $or:[
            {
                username:{  $regex:req.query.input, $options:'i' },
            },
            {
                email:{  $regex:req.query.input, $options:'i'  },
            },
        ]
    }:{};
       const response=await User.find(keyword)
    //    .find({ _id: {$ne:req.user._id}});
    //    console.log(response);
       return res.status(201).send(response);
   
});

const fetchChats=asyncHandler(async (req,res) => {
    
     try {
        console.log(req.user);
        const results=await Chat.find({users:req.user._id})
        .populate("users","-password -refreshToken")
        .populate("groupAdmin","-password -refreshToken")
        .sort({updatedAt:-1})
        // .populate("newlyMessage")
        
       //   console.log(results);
       if(results.length===0){
         return res.status(400).json(new ApiError(400,"no chat found").toJSON());
       }
   
        // const populatedResults=await User.populate(results,
        //    {
        //    path:"newlyMessage.sender",
        //    select:"username email profilePic",
        //    })
            // console.log(populatedResults);
            console.log(results);
            res.status(200).json(results);
    }
      
     catch (error) {
        console.log("Error in fetching chats:",error.message);
     }
    })
const seenMessageStatus=asyncHandler(async (req,res) => {
    const {chatId}=req.body;
    const chat=await Chat.findByIdAndUpdate(chatId,
        {
            $set:{
                seenStatus:true
            }
        },
        {
            new:true
        }
    ).populate("users","username profilePic")
   console.log(chat);
   return res.send(chat);
    
})


const fetchSingleUser=asyncHandler(async(req,res)=>{
     const {userId}=req.body;
     const user=await User.findById(userId);
     return res.status(200).send(user);
})

const createGroupChat=asyncHandler(async (req,res) => {
    const {chatName,usersId}=req.body
    console.log(req.body);
    // const users=JSON.parse(usersId)
    // console.log(users);
    if(usersId.length>1){
        usersId.push(req.user._id);
     }
     
    else{
     throw new ApiError("400","Select atleast 2 member to make a group chat")
    }
    const groupChat=await Chat.create({
        chatName:chatName,
        isGroupChat:true,
        users:usersId,
        groupAdmin:req.user._id
    });
     
     const populatedChat=await Chat.find(groupChat._id).populate("users","-password -refreshToken")
    .populate("groupAdmin","-password -refreshToken")
    // .then(async(results)=>{
    //     results=await User.populate(results,{   
    //     path:"newlyMessage.sender",
    //     select:"username email profilePic",
    // })
      console.log(populatedChat);
      return res.status(200).send(populatedChat);
    })
    // .populate("newlyMessage")
    
  


const renameGroupName=asyncHandler(async(req,res) => {
    const newName=req.body.name;
    const {groupId}=req.body

    const renameGroupChat=await Chat.findByIdAndUpdate(groupId,
        {  
        $set:{
           chatName:newName
          }
        },
        {
        new:true
        }
    )
    return res.status(200).send(renameGroupChat)
})

const removeUserFromGroup=asyncHandler(async(req,res)=>{
    // const newName=req.body.name;
    const {groupId,userId}=req.body;
    
    const removeGroupChat=await Chat.updateOne({_id:groupId},
        {
            $pull:{
                users:userId
            }
        },
        {
            new:true
        }
    )
      if(!removeGroupChat){
        throw new ApiError(400,"Group not found!!");
      }  
      return res.status(200).send(removeGroupChat);
})
const addInGroup=asyncHandler(async(req,res)=>{
     const {groupId,userId}=req.body;
    
     const addGroupChat=await Chat.updateOne({_id:groupId},
        {
            $push:{
                users:userId
            }
        },
        {
            new:true
        }
    )
      if(!addGroupChat){
        throw new ApiError(400,"Group not found!!");
      }  
      return res.status(200).send(addGroupChat);
})

export {
    accessChat,
    singleChat,
    fetchChats,
    seenMessageStatus,
    createGroupChat,
    renameGroupName,
    removeUserFromGroup,
    addInGroup,
    fetchMatchUser,
    fetchSingleUser
}