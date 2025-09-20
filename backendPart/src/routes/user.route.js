import express from "express"
import { userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { isUserLogin } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
// import { Router } from "express"
const userRouter=express.Router();

userRouter.post('/register',upload.single("pic"),userRegister)
userRouter.post("/login",userLogin);
userRouter.post("/logout",isUserLogin,userLogout);

export {userRouter};