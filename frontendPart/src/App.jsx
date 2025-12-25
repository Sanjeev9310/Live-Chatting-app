import Login from './components/Login.jsx'
// import { createBrowserRouter, RouterProvider} from 'react-router'
import { BrowserRouter,Routes,Route, useNavigate, useLocation,Navigate} from 'react-router-dom'
import Register from './components/Register.jsx'
import ChatPage from './components/ChatPage.jsx'
import Home from './components/Home.jsx'
import { useEffect } from 'react'
import MessageModal from './components/MessageModal.jsx'
import CreateContext from './components/CreateContext.jsx'
import GroupCreationModal from './components/GroupCreationModal.jsx'
import Navbar from './components/Navbar.jsx'

function App() {
  const navigate=useNavigate();
  const location=useLocation();
 // const [isAuthenticated, setIsAuthenticated] = useState(false);
  function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
  }


  useEffect(()=>{
    console.log(location)
  },[location.pathname])
  return(
    <>
     {/* <Home/> */}
     <Routes>
        <Route path="/" element={<Register/>}/>
       <Route path="/home" element={
       <ProtectedRoute>
         <Home/>
       </ProtectedRoute>
       }/>
       <Route path="/login" element={<Login/>}/>
     </Routes>
    </>
  )
}

export default App
