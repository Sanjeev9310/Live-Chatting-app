import Login from './components/Login.jsx'
// import { createBrowserRouter, RouterProvider} from 'react-router'
import { BrowserRouter,Routes,Route, useNavigate, useLocation } from 'react-router-dom'
import Register from './components/Register.jsx'
import ChatPage from './components/ChatPage.jsx'
import Home from './components/Home.jsx'
import { useEffect } from 'react'

function App() {
  const navigate=useNavigate();
  const location=useLocation();
  useEffect(()=>{
    console.log(location)
  })
  return(
    <>
     <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
     </Routes>
    </>
  )
}

export default App
