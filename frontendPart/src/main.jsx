import ReactDOM from 'react-dom/client';
import App from './App'
import "./index.css"
import { BrowserRouter } from 'react-router';
import { AuthProvider } from './components/AuthContext.jsx';
// import { ChakraProvider } from '@chakra-ui/react';

ReactDOM.createRoot(document.getElementById('root')).render(
    // <ChakraProvider>
      <BrowserRouter>
          <AuthProvider>
             <App/>
          </AuthProvider>
      </BrowserRouter>
   
    // </ChakraProvider>
)
