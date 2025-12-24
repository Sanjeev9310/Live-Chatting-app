import React from 'react'
import "./chat.css"
import { backendUrl } from '../constantApi'

const ChatPage = ({chatData,modalStatus,setModalStatus,data,setMessageStatus,setChatTitleStatus,setChatStatus,setAllMessages,setChatData}) => {
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
      // if(Object.keys(chat).length===0){
    
    setChatStatus(true);
    setChatTitleStatus(true);
    setAllMessages(response.data);
    const allChat=await axios.get(`${backendUrl}/api/v/chat/fetch-chatData`,
      {
        headers:{
              Authorization:`Bearer ${refreshToken}`
            },
        withCredentials:true,
       
      }
    )
     setChatData(allChat.data);
     
 }
  return (
       <div className='chat-body flex flex-col'>
            <div className='chat-heading flex justify-between p-2'>
              <h5>Chats</h5>
              <div className='create-group' onClick={()=>!modalStatus?setModalStatus(true):setModalStatus(false)}>
                  <p>Group Chat</p>   
                  <img className="plus-icon" src="plus.png"/>
              </div>
            </div>

            <div className='chat-page'>
               <ul className='list-none m-0 p-0'>
           {chatData && chatData.map((value)=>{
              const otherUser=!value.isGroupChat?value.users.find((u)=>u._id!==data[0]._id):null;
            return (
              <li key={value._id}>
              <div onClick={handleClickForExistedChat(value)} className="chat-detail">
              <img src={value.isGroupChat?value.groupAdmin.profilePic:otherUser.profilePic} className='search-dp' />
              <div className='current-msg'>
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
