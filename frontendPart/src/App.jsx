import Login from './components/Login.jsx'
// import { createBrowserRouter, RouterProvider} from 'react-router'
import { BrowserRouter,Routes,Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import Register from './components/Register.jsx'
import ChatPage from './components/ChatPage.jsx'
import Home from './components/Home.jsx'
import { useContext, useEffect } from 'react'
import MessageModal from './components/MessageModal.jsx'
import GroupCreationModal from './components/GroupCreationModal.jsx'
import Navbar from './components/Navbar.jsx'
import { AuthContext } from './components/AuthContext.jsx'

function ProtectedRoute({children}){
  const {isAuthenticated}=useContext(AuthContext);
  return isAuthenticated?children:<Navigate to="/login" replace/>

 }
function App() {
  const navigate=useNavigate();
  const location=useLocation();

  useEffect(()=>{
    console.log(location)
  },[location.pathname])
  return(
    <>
     {/* <Home/> */}
     <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={
           <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
        <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
     </Routes>
    </>
  )
}

export default App
