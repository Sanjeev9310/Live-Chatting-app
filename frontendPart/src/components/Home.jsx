import React, { createContext, useEffect, useRef, useState } from 'react'
import "./chat.css"
import axios from "axios"
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import GroupCreationModal from './GroupCreationModal.jsx'
import socket from "./socket.js";
import { backendUrl } from '../constantApi.js'
import ChatPage from './ChatPage.jsx'
// import io from "socket.io-client";

const Home = () => {
  const navigate=useNavigate();
  const location=useLocation();
  const [refreshToken,setAccessToken]=useState();
  const [modalStatus,setModalStatus]=useState(false);
  const [data,setData]=useState([]);
  const [chatData,setChatData]=useState([]);
  const [searchdata,setsearchData]=useState([]);
  const [input,setInput]=useState("");
  const [status,setStatus]=useState(false);
  const [messageStatus,setMessageStatus]=useState(true);

  const [chat,setChat]=useState({});
  const [chatStatus,setChatStatus]=useState(false);
  // const [currentChat,setCurrentChat]=useState("");
 
  const [typeMessage,settypeMessage]=useState("");
  const [chatTitleStatus,setChatTitleStatus]=useState(false);

  const [profileStatus,setProfileStatus]=useState(false);

  const [allMessages,setAllMessages]=useState([]);

  const [seenStatus,setSeenStatus]=useState(false);
  const sideBarRef=useRef();
  
  // whenever user login it display data of logged in user like username and password along with the chat details that present at first index
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
      
       axios.post(`${backendUrl}/api/v/message/fetch-all-message`,
       {chatId:currentChat._id},
       {
        headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${refreshToken}`
            },
        withCredentials:true 
       }
      ).then((res)=>{
        setAllMessages(res.data);
        // setChatStatus(true);
        // setChatTitleStatus(true);
      }).catch((err)=>{
        console.log("Error: while fetching messages",err.message);
      })
        }
      }).catch((err)=>{
        console.log("Error:error while fetching chats",err.message);
      });

     
  },[]);
 
  useEffect(()=>{
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
     });
     
    //  chatTitleStatus(true);
     return ()=> socket.off("receive-message");
  },[chat?._id])

  const handleAllUser=async(e)=>{
    setInput(e.target.value);
    if(input.length===1){
      setStatus(false);
    }
    else{
    const response=await axios.get(`${backendUrl}/api/v/chat/fetch-allUser`,
    {   
    params:{input},
    headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${refreshToken}`
            },
    withCredentials:true   
    }
    );
    console.log(response.data);
    setsearchData(response.data);
    setStatus(true);
  }
}
 const handleLogout=async()=>{
     localStorage.clear();
     await axios.post(`${backendUrl}/api/v/user/logout`,
      {},
        {
           headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${refreshToken}`
            },
          withCredentials:true
        }
     )
     console.log("user being logout");
     navigate("/login");
    //  window.alert("User logged out");
  }

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
 

const handleMessageSend=async(chatId,content)=>{
  if(!content.trim()) return;
  const newMsg={
    sender:{_id:data[0]._id},
    messageContent:content,
    chat:chatId
  }
  settypeMessage("");
  setAllMessages(prev=>[...prev,newMsg]);
  socket.emit("send-message",newMsg);
  // setMessageStatus(true);
}         

return (
    <>
    <div className='chat-section'>
       <div className='chat-navbar flex justify-between items-center'>
        <div className='search-bar-section flex gap-1'>
          <input onChange={handleAllUser} className="input" placeholder='Search for user' value={input}/>
        <div className="search-field">
            <img className="search-icon" src="search.png"/>
            <span className='app-name'>Sampark Banaye</span>
        </div>
        </div>
        
        <div className='login-user-detail'>
          <div className='username flex gap-2'>
            <img className="dp" src={data && data[0]?.profilePic}/>
            <span className='text-[15px] font-bold'>{data && data[0]?.username}</span>
          </div>
          <button onClick={handleLogout} className='logout-btn'>Logout</button>
        </div>
       </div>
      
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


    <div className='chat-body-section'>
          <ChatPage chatData={chatData} modalStatus={modalStatus} setModalStatus={setModalStatus} data={data} setMessageStatus={setMessageStatus} setChatTitleStatus={setChatTitleStatus}setChatStatus={setChatStatus} setAllMessages={setAllMessages}setChatData={setChatData}/>
          {/* <div className="message-page" style={{display:chatStatus?"block":"none"}}> */}
          <div className="message-page" style={{display:messageStatus?"block":"none"}}>
           <div className='chat-page-window'>
            {
             chat && chat.users && ( 
              // const otherUser=!value.isGroupChat?value.users.find((u)=>u._id!==data[0]._id).username:null;
             <div>
            <img className="arrow-left" src="arrow.png" onClick={()=>setMessageStatus(false)} />
            <div className="message-person" onClick={()=>setProfileStatus(true)}>
             <img className='chat-dp' src={chat.isGroupChat?chat.groupAdmin.profilePic:chat.users[1].profilePic}/>
             <p>{chat.isGroupChat?chat.chatName:chat.users.find((u)=>u._id!==data[0]._id).username}</p>
             </div>
             </div>
             )
            }
          
               {/* <div className='message-window' style={{display:chatTitleStatus?"block":"none"}}> */}
                <div className='message-window' >
                <ul className='list-of-message list-none flex flex-col gap-y-1 m-0 p-0' >
                {
                  allMessages && allMessages.map((v,i)=>(
                    <div key={i} className={`msg-div flex ${v.sender?._id==data[0]._id?"sent-div":"received-div"}`}>
                    <img className="user-photo" src={v.sender?.profilePic}/>
                    <div className={`msg-tab ${v.sender?._id==data[0]._id?"sent":"received"}`}  key={i}>
                      {v.messageContent}</div>
                    </div>
                  ))
                }
                </ul>
              </div>
              
              <div className='message-enter-section' style={{display:chatData?.length!==0?"block":"none"}}>
                <div className='msg-typing-area'>
                  <input type="text" className="w-full" onChange={(e)=>settypeMessage(e.target.value)} placeholder='Type your message here' value={typeMessage}/>
                  <img onClick={()=>handleMessageSend(chat._id,typeMessage)} className="send-icon" src="send-message.png"/>
                </div>
              </div>
                
          </div>
          </div> 
    </div>     


           
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
    <GroupCreationModal modalStatus={modalStatus} chatData={chatData} setChatData={setChatData}/>
  </div>
     </>
  )
}

export default Home