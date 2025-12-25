import React, { createContext, useEffect, useRef, useState } from 'react'
import "./chat.css"
import axios from "axios"
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import GroupCreationModal from './GroupCreationModal.jsx'
import socket from "./socket.js";
import { backendUrl } from '../constantApi.js'
import ChatPage from './ChatPage.jsx'
import MessageModal from './MessageModal.jsx'
import Navbar from './Navbar.jsx'
// import io from "socket.io-client";

const Home = () => {
  const navigate=useNavigate();
  const location=useLocation();
  const [refreshToken,setAccessToken]=useState();
  const [modalStatus,setModalStatus]=useState(false);
  const [data,setData]=useState([]);
  const [chatData,setChatData]=useState([]);
  const [searchdata,setSearchData]=useState([]);
  const [input,setInput]=useState("");
  const [status,setStatus]=useState(false);
  const [messageStatus,setMessageStatus]=useState(null);

  const [chat,setChat]=useState({});
  const [chatStatus,setChatStatus]=useState(false);
  // const [currentChat,setCurrentChat]=useState("");
  const [selectedChat,setSelectedChat]=useState(null);
 
  const [typeMessage,settypeMessage]=useState("");
  const [chatTitleStatus,setChatTitleStatus]=useState(false);

  const [profileStatus,setProfileStatus]=useState(false);

  const [allMessages,setAllMessages]=useState([]);

  const [seenStatus,setSeenStatus]=useState(false);
  const sideBarRef=useRef();
  
  // whenever user login it display data of logged in user like username and password along with the chat details that present at first index
  //   useEffect(()=>{
  //   function setVH(){
  //     const vh=window.innerHeight * 0.01;
  //     document.documentElement.style.setProperty("--vh",`${vh}px`);
  //   }
  //   setVH();
  //   window.addEventListener("resize",setVH);
  //   return ()=> window.removeEventListener("resize",setVH);
  // },[]);

  useEffect(()=>{
       const userData=JSON.parse(localStorage.getItem("userinfo"));
       setData(userData);
       const token=localStorage.getItem("refreshToken");
       setAccessToken(token);

       axios.get(`${backendUrl}/api/v/chat/fetch-chatData`,
        {
         headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${refreshToken}`
          },
        withCredentials:true
        }
      ).then((res)=> {
        setChatData(res.data);
        if(res.data.length>0){
          let currentChat=res.data[0];
           setChat(currentChat);
        }
<<<<<<< HEAD
  }).catch((err)=>{
    console.error("Error while fetching list of chat" || err.message);
  })
    },[]);
  
    useEffect(()=>{
=======
      }).catch((err)=>{
        console.log("Error:error while fetching chats",err.message);
      });
 },[chatData]);
 
  useEffect(()=>{
>>>>>>> f76665bbf565e5b2a4c67803e46f4ea6e948ab84
     function handleClickOutside(e){
          if(sideBarRef.current && !sideBarRef.current.contains(e.target)){
            setStatus(false);
            setInput("");
          }
        }
          document.addEventListener("mousedown",handleClickOutside);
          return ()=>{
            document.removeEventListener("mousedown",handleClickOutside);
          };
        }
      ,[]);
    
  useEffect(()=>{
     if(chat?._id){
      socket.emit("join-chat",chat._id);
     }
  },[chat?._id]);

  useEffect(()=>{
      socket.on("receive-message",(data)=>{
      setAllMessages((prev)=>[...prev,data]);
      console.log(allMessages);
      setChatData((prev)=>prev.map((chatItem)=>{
        if(chatItem._id!==data.chatId) return chatItem;
        const isOpen=chat && chat._id===data.chatId;
        return {...chatItem,newlyMessage:data.messageContent,seenStatus:isOpen?true:false}
      }
     ));
    })
    return ()=> socket.off("receive-message");
  },[socket,setAllMessages])



const handleClick=async(user) =>{
      setInput("");
      setAllMessages([]);
      setStatus(false);
      setChatStatus(false);
      setChatTitleStatus(false);


      
      const singleChat=await axios.post(`${backendUrl}/api/v/chat/access-chat`,
          {
            userId:user._id,
          },
          {
           headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${refreshToken}`
            },
          withCredentials:true
          }
        )
        setChat(singleChat.data);
        console.log("new chat will shown here")
        console.log(singleChat);
      
      const response=await axios.post(`${backendUrl}/api/v/message/fetch-all-message`,
        {chatId:singleChat.data._id},
       {
        headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${refreshToken}`
            },
        withCredentials:true 
       }
      )
      console.log(response.data);
   const allChat=await axios.get(`${backendUrl}/api/v/chat/fetch-chatData`,
      {
        headers:{
              Authorization:`Bearer ${refreshToken}`
            },
        withCredentials:true,
       
      }
    )
        setChatData(allChat.data);
        setAllMessages(response.data || []);
        setChatTitleStatus(true);
        setChatStatus(true);
    }     

return (
    <>
    <div className='flex flex-col'>
       <div className='view-profile-section' style={{display:profileStatus?"block":"none"}}>
          <div className='flex justify-start gap-3'>
             <img src="arrow.png" className="arrow-left" onClick={()=>setProfileStatus(false)}/>
            <p className=''>Profile Details</p>
          </div>
           
            <div className='profile-photo'>
              {chat && chat.users && (
                <>
                <img src={chat?.isGroupChat?chat.groupAdmin.profilePic:chat.users[1].profilePic} className='profile-dp'/>
                <p className='profile-name'>{chat.isGroupChat?chat.chatName:chat.users[1].username}</p>
                </>
              )}
            </div>
            <div>
              {
                chat && chat.isGroupChat && chat.users && (
                  <>
                 <ul className="chat-users-list">
                  {
                    chat.users.filter((u)=>u._id!==data[0]._id).map((value,key)=>(
                      <div className='chat-user-list' key={key}>
                       <img src={value.profilePic} className='users-dp'/>
                       <li key={key}>{value.username}</li>
                       </div>
                    ))
                  }
                   
                 </ul>
                 </>
                )
              }
            </div>
           </div>
      <Navbar data={data} setSearchData={setSearchData} input={input} setInput={setInput} setStatus={setStatus} refreshToken={refreshToken}/>
      
        {/* Search user that you want to start chat with them  */}
      <div className="popup-box" ref={sideBarRef} style={{display:status?"block":"none"}}> 
           <ul className='list-none m-0 p-0'>
           {  searchdata.map((user,index)=>(
              <li key={index}>
              <div onClick={()=>handleClick(user)} className="result-item user-data flex gap-2">
              <img src={user.profilePic} className='search-dp' />
              <p>{user.username}</p>
              </div>
              </li>
             ))
           }
              
           </ul>
       </div>

    <div className='flex h-screen w-full overflow-hidden relative'>
       {/* left section part of Application */}
      <div className={`w-full mt-2 h-[70vh] ${selectedChat?"hidden md:block":"block"}`}>
          <ChatPage chatData={chatData} modalStatus={modalStatus} setModalStatus={setModalStatus} data={data} setMessageStatus={setMessageStatus}  setChatTitleStatus={setChatTitleStatus} setChatStatus={setChatStatus} setAllMessages={setAllMessages} setChatData={setChatData} refreshToken={refreshToken} chat={chat} setChat={setChat} selectedChat={(chat)=>setSelectedChat(chat)}/>
      
      </div>
      {/* Right sectin part of Application */}
      <div className={`flex flex-col flex-1 my-2 h-[70vh]  ${selectedChat?"block":"hidden"} md:block`}>
        {
          selectedChat && (
             <MessageModal allMessages={allMessages} setAllMessages={setAllMessages} profileStatus={profileStatus} setProfileStatus={setProfileStatus} chat={chat} chatData={chatData} typeMessage={typeMessage} settypeMessage={settypeMessage} data={data} setSelectedChat={setSelectedChat} selectedChat={selectedChat} onBack={()=>{
              setSelectedChat(null)
              setChat({})
             }} setChatData={setChatData}/>
          )
        }
      </div>     
    </div> 
    <GroupCreationModal modalStatus={modalStatus} chatData={chatData} setChatData={setChatData}/>    
</div>
  
     </>
  )
}

export default Home
