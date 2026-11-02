import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {GoogleOAuthProvider} from '@react-oauth/google'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { CartProvider } from './context/CartCotext.jsx'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
console.log("client id ",Boolean(clientId))
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <CartProvider>
    <App />
    </CartProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
