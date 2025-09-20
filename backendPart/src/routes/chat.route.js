import express from "express"
import { isUserLogin } from "../middleware/auth.middleware.js";
import { accessChat, addInGroup, createGroupChat, fetchChats, fetchMatchUser, fetchSingleUser, removeUserFromGroup, renameGroupName, seenMessageStatus, singleChat} from "../controllers/chat.controller.js";
import { sendnewMessage } from "../controllers/message.controller.js";

const chatRouter=express.Router();

chatRouter.post("/access-chat",isUserLogin,accessChat)
chatRouter.get("/single-chat",isUserLogin,singleChat)

chatRouter.get("/fetch-allUser",fetchMatchUser)
chatRouter.get("/fetch-chatData",isUserLogin,fetchChats)
chatRouter.get("/fetch-singleUser",fetchSingleUser);
chatRouter.post("/create-groupChat",isUserLogin,createGroupChat)
chatRouter.put("/rename-groupName",isUserLogin,renameGroupName)
chatRouter.route("/remove-groupUser").put(isUserLogin,removeUserFromGroup)
chatRouter.route("/add-userInGroup").put(isUserLogin,addInGroup)
chatRouter.route("/seen-message-status").put(isUserLogin,seenMessageStatus)


export {chatRouter}