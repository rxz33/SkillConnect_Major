import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextProvider from './Context/Context';
import { AuthProvider } from "./Context/AuthContext";

createRoot(document.getElementById('root')).render(
 <AuthProvider>
  <ContextProvider>
    <App />
  </ContextProvider>
</AuthProvider>,
)
