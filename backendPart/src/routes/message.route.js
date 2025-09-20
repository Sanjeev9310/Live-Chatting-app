import express from "express"
import { fetchAllMessages, sendnewMessage } from "../controllers/message.controller.js";
import { isUserLogin } from "../middleware/auth.middleware.js";

const messageRouter=express.Router()

messageRouter.post("/access-message",isUserLogin,sendnewMessage);
messageRouter.post("/fetch-all-message",isUserLogin,fetchAllMessages);




export {messageRouter}
