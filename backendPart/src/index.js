import mongoose from "mongoose";
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {userRouter} from "./routes/user.route.js";
import {chatRouter} from "./routes/chat.route.js";
import { messageRouter } from "./routes/message.route.js";
import {Server} from "socket.io";
import {createServer} from "node:http";
import { Message } from "./models/message.model.js";
import { User } from "./models/user.model.js";
import { Chat } from "./models/chat.model.js";

dotenv.config({path:"./.env"})
const app=express();
app.use(cors({
    origin: "http://localhost:5173",
    methods:["GET","POST","PUT"],
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }
));
const server=createServer(app);
const io=new Server(server,{
   cors:{
      origin:"http://localhost:5173",
      methods:["GET","POST","PUT"],
      credentials:true
   }
});
const dbConnection=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/chatapp`);
        console.log("Database connection has done",connectionInstance.connection._connectionString);}
    catch (error){
       console.log("Error: MongoDb connection Error",error.message)
       process.exit(1); }
}
dbConnection()

app.use("/api/v/user",userRouter);
app.use("/api/v/chat",chatRouter);
app.use("/api/v/message",messageRouter);

io.on("connection",(socket)=>{
    console.log("user connected",socket.id);

    socket.on("send-message",async(data)=>{
        const newMsg=await Message.create({
            sender:data.sender,
            messageContent:data.messageContent,
            chat:data.chat
       });

    var message=await newMsg.populate("sender","username profilePic")
    // message=await User.populate(message,
    //      {
    //         path:"chat.users",
    //         select:"username profilePic"
    //     });
    
        await Chat.findByIdAndUpdate(data.chat,
            {
                $set:{
                    newlyMessage:data.messageContent,
                    seenStatus:false
                  }
            },
            {
                new:true,
            }
        )

        console.log("message received",message);
        socket.to(data.chat).emit("receive-message",message);
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id);
    })

    socket.on("join-chat",(chatId)=>{
        socket.join(chatId);
    })
});

server.listen(process.env.PORT,()=>console.log(`App running at port ${process.env.PORT}`))
