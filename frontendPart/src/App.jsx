import Login from './components/Login.jsx'
// import { createBrowserRouter, RouterProvider} from 'react-router'
<<<<<<< HEAD
import { BrowserRouter,Routes,Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
=======
import { BrowserRouter,Routes,Route, useNavigate, useLocation,Navigate} from 'react-router-dom'
>>>>>>> f76665bbf565e5b2a4c67803e46f4ea6e948ab84
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
<<<<<<< HEAD
=======
 // const [isAuthenticated, setIsAuthenticated] = useState(false);
  function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
  }

>>>>>>> f76665bbf565e5b2a4c67803e46f4ea6e948ab84

  useEffect(()=>{
    console.log(location)
  },[location.pathname])
  return(
    <>
     {/* <Home/> */}
     <Routes>
        <Route path="/" element={<Register/>}/>
<<<<<<< HEAD
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={
           <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
        <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
=======
       <Route path="/home" element={
       <ProtectedRoute>
         <Home/>
       </ProtectedRoute>
       }/>
       <Route path="/login" element={<Login/>}/>
>>>>>>> f76665bbf565e5b2a4c67803e46f4ea6e948ab84
     </Routes>
    </>
  )
}

export default App
