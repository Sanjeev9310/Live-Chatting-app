import React from 'react'

const MessageModal = ({allMessages,setProfileStatus}) => {
  return (
      <div className="message-page">
           <div className='chat-page-window'>
            {
              location.pathname==="/chat" && (
            <Link to="/chat">
            <img className="arrow-left" src="arrow.png" />
            </Link>
              )
            }
         
            {
             chat && chat.users && ( 
              // const otherUser=!value.isGroupChat?value.users.find((u)=>u._id!==data[0]._id).username:null;
             <div className="message-person" onClick={()=>setProfileStatus(true)}>
             <img className='chat-dp' src={chat.isGroupChat?chat.groupAdmin.profilePic:chat.users[1].profilePic}/>
             <p>{chat.isGroupChat?chat.chatName:chat.users.find((u)=>u._id!==data[0]._id).username}</p>
             </div>
             )
            }
          
               {/* <div className='message-window' style={{display:chatTitleStatus?"block":"none"}}> */}
                <div className='message-window'>
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
  )
}

export default MessageModal
