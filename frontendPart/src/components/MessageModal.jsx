import React from 'react'
import socket from "./socket.js";
import { useLocation, useNavigate } from 'react-router';
import "./chat.css"

const MessageModal = ({allMessages,setAllMessages,profileStatus,setProfileStatus,chat,chatData,typeMessage,settypeMessage,data,selectedChat,setChatData,onBack}) => {
  const location=useLocation();
  const navigate=useNavigate();
  const handleMessageSend=async(chatId,content)=>{
    if(!content.trim()) return;
    const newMsg={
      sender:{_id:data[0]._id},
      messageContent:content,
      chat:chatId
    }
    settypeMessage("");
    setAllMessages(prev=>[...prev,newMsg]);
    setChatData((prev)=>prev.map((chatItem)=>chatItem._id===chatId?{
      ...chatItem,newlyMessage:content,seenStatus:true
     }:chatItem
    )
  )
    socket.emit("send-message",newMsg);
    // setMessageStatus(true);
  }    

  return (
      <div className='flex flex-col overflow-hidden md:p-[5px] border-[3px] border-[rgb(57,130,255)] rounded bg-[rgb(207,222,227)] h-[90vh] relative p-1'>
          {/* <div className='chat-page-window'> */}
            <div className='message-person flex gap-[0.65rem]'>
               <img onClick={onBack} className="md:hidden w-[1rem] h-[1rem] mt-2 cursor-pointer" src="arrow.png"/>
         
            {
             chat && chat.users && ( 
              // const otherUser=!value.isGroupChat?value.users.find((u)=>u._id!==data[0]._id).username:null;
             
             <div className="flex gap-2" onClick={()=>setProfileStatus(true)}>
             <img className='chat-dp' src={chat.isGroupChat?chat.groupAdmin.profilePic:chat.users[1].profilePic}/>
             <p>{chat.isGroupChat?chat.chatName:chat.users.find((u)=>u._id!==data[0]._id).username}</p>
             </div>
             )
            }
            </div>
            
            <div className="message-window overflow-auto h-[82%]">
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
              
            <div className='absolute bottom-0 w-full pb-2' style={{display:chatData?.length!==0?"block":"none"}}>
                <div className='msg-typing-area'>
                  <input type="text" className="w-full h-[2rem] sm:h-[1.5rem]" onChange={(e)=>settypeMessage(e.target.value)} placeholder='Type your message here' value={typeMessage}/>
                  <img onClick={()=>handleMessageSend(chat._id,typeMessage)} className="w-[1.6rem]" src="send-message.png"/>
                </div>
              </div>
                
          {/* </div> */}
      </div>
  )
}

export default MessageModal
