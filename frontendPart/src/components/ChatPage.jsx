import React from 'react'
import "./chat.css"
import { backendUrl } from '../constantApi'
import axios from 'axios'
import { useNavigate } from 'react-router'

const ChatPage = ({chatData,modalStatus,setModalStatus,data,setMessageStatus,setChatTitleStatus,setChatStatus,setAllMessages,refreshToken,chat,setChat,selectedChat}) => {
  const navigate=useNavigate();
    const handleClickForExistedChat=async (value) =>{
      // setChat({});
      setMessageStatus(true)
      setChatTitleStatus(false);
      setChatStatus(false);
      setAllMessages([]);
       const existedChat=await axios.put(`${backendUrl}/api/v/chat/seen-message-status`,
      {chatId:value?._id},
      {
       headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${refreshToken}`
            },
        withCredentials:true 
      }
     )
    console.log(existedChat.data);
    setChat(existedChat.data);
    
    const response=await axios.post(`${backendUrl}/api/v/message/fetch-all-message`,
        {chatId:value?._id},
       {
        headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${refreshToken}`
            },
        withCredentials:true 
       }
      )

    setChatStatus(true);
    setChatTitleStatus(true);
    setAllMessages(response.data);    
 }
  return (
       <div className='w-[98vw] h-[85vh] border-blue-500 border-3 rounded overflow-y-auto mx-1 bg-[rgb(196,230,249)]'>
            <div className='flex justify-between p-2  bg-[rgb(209,222,233)] '>
              <h5>Chats</h5>
              <div className='create-group' onClick={()=>!modalStatus?setModalStatus(true):setModalStatus(false)}>
                  <p>Group Chat</p>   
                  <img className="plus-icon" src="plus.png"/>
              </div>
            </div>

            <div>
               <ul className='list-none m-0 p-0'>
           { chatData && chatData.map((value)=>{
              const otherUser=!value.isGroupChat?value.users.find((u)=>u._id!==data[0]._id):null;
            return (
              <li key={value._id}>
              <div className="pl-[10px] flex gap-[0.7rem] hover:bg-[rgb(111,239,130)]" onClick={()=>{
                handleClickForExistedChat(value)
                selectedChat(value)
              }}
               >
              <img src={value.isGroupChat?value.groupAdmin.profilePic:otherUser.profilePic} className='search-dp' />
              <div className='flex flex-col w-max h-min '>
                  <p>{value.isGroupChat?value.chatName:otherUser.username}</p>
                  <p style={{fontWeight:value.seenStatus===false?700:300}}>{value && value.newlyMessage}</p>
              </div>
              </div>
              </li>
            )
           })
          }
          </ul>
          </div>
    </div>
  )
}

export default ChatPage
