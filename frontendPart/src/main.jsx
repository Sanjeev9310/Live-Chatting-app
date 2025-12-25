import ReactDOM from 'react-dom/client';
import App from './App'
import "./index.css"
import { BrowserRouter } from 'react-router';
<<<<<<< HEAD
import { AuthProvider } from './components/AuthContext.jsx';
=======
import {AuthProvider} from "../components/CreateContext.jsx";
>>>>>>> f76665bbf565e5b2a4c67803e46f4ea6e948ab84
// import { ChakraProvider } from '@chakra-ui/react';

ReactDOM.createRoot(document.getElementById('root')).render(
    // <ChakraProvider>
<<<<<<< HEAD
      <BrowserRouter>
          <AuthProvider>
             <App/>
          </AuthProvider>
      </BrowserRouter>
=======
     <BrowserRouter>
         <AuthProvider>
             <App/>
         </AuthProvider>
         
     </BrowserRouter>
>>>>>>> f76665bbf565e5b2a4c67803e46f4ea6e948ab84
   
    // </ChakraProvider>
)
