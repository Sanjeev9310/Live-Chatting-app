import React from 'react'
import  { useNavigate } from 'react-router';
import { backendUrl } from '../constantApi';
import axios from 'axios';

const Navbar = ({data,input,setSearchData,setStatus,setInput,refreshToken}) => {
    const navigate=useNavigate();
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
    setSearchData(response.data);
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
  }
  return (
       <div className='chat-navbar flex justify-between items-center p-2'>
        <div className='search-bar-section flex gap-1'>
          <input onChange={handleAllUser} className="input h-[2rem]" placeholder='Search for user' value={input}/>
        <div className="search-field flex items-center">
            <img className="search-icon size-[1rem]" src="search.png"/>
            <span className="semi-bold text-[20px]">Sampark Banaye</span>
        </div>
        </div>
        
        <div className='login-user-detail'>
          <div className='username flex gap-2 justify-center items-center'>
            <img className="dp" src={data && data[0]?.profilePic}/>
            <span className='text-[20px] font-bold'>{data && data[0]?.username}</span>
          </div>
          <button onClick={handleLogout} className='logout-btn text-[17px]'>Logout</button>
        </div>
       </div>
  )
}

export default Navbar
