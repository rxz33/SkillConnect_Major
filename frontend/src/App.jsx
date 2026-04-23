import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './pages/Home';
import ProPage from './pages/ProPage';
import LoginSignup from "./pages/LoginSignup";
import ProCategory from './pages/ProCategory';
import SearchResults from './pages/SearchResults'
import ProviderForm from './Components/ProviderForm/ProviderForm';
import YourProfilePage from './Components/YourProfilePage/YourProfilePage';
import EditProfile from "./Components/EditProfile/EditProfile";

import Chat from "./Components/Chat/Chat";
import ChatPage from "./Components/Chat/ChatPage";


import menSpa from './Components/Assets/menSpa.png'
import womenSpa from './Components/Assets/womenSpa.png'
import painting from './Components/Assets/painting.png'
import PestControl from './Components/Assets/PestControl.png'
import waterpurifier from './Components/Assets/waterpurifier.png'
import electrician from './Components/Assets/electrician.png'
import AC from './Components/Assets/AC.png'

function App() {
  
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      
 
  

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<LoginSignup/>}/>

        <Route path='/men' element={<ProCategory banner={menSpa} category="men salon"/>}/>
        <Route path='/women' element={<ProCategory banner={womenSpa}category="women salon"/>}/>
        <Route path='/painter' element={<ProCategory banner={painting}category="painter"/>}/>
        <Route path='/pestcontrol' element={<ProCategory banner={PestControl}category="pestControl"/>}/>
        <Route path='/waterpurifier' element={<ProCategory banner={waterpurifier}category="waterpurifier"/>}/>
        <Route path='/electrician' element={<ProCategory banner={electrician}category="electrician"/>}/>
        <Route path='/ac' element={<ProCategory banner={AC}category="AC"/>}/>

      

        <Route path="/search" element={<SearchResults />} />
        <Route path='/provider' element={<ProviderForm/>}/>
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path='/profile' element={<YourProfilePage/>}/>
        <Route path="/propage/:propageId" element={<ProPage />} />

         {/*<Route path="/propage" element={<ProPage />}>
           <Route path=':propageId' element={<ProPage/>}/>
        </Route>*/}
    
        {/*<Route path='/cart' element={<Cart/>}/>*/}
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/signup' element={<LoginSignup/>}/>

        <Route path="/chat-test" element={<Chat chatId="axyaFpBUfIIsoJhBTIYg" />}/>
        <Route path="/chat" element={<ChatPage />} />



      </Routes>
      <Footer/>
    </BrowserRouter>
    
    </div>
    
  )
}

export default App
