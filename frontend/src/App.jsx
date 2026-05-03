import React, { lazy, Suspense, useEffect } from 'react';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import './App.css';
import {HashRouter,Routes,Route, useLocation} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load pages for faster initial load
const Home = lazy(() => import('./pages/Home'));
const ProPage = lazy(() => import('./pages/ProPage'));
const LoginSignup = lazy(() => import('./pages/LoginSignup'));
const ProCategory = lazy(() => import('./pages/ProCategory'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Success = lazy(() => import('./pages/Success'));
const Cancel = lazy(() => import('./pages/Cancel'));
const HiredProfessionals = lazy(() => import('./pages/HiredProfessionals'));
const Membership = lazy(() => import('./pages/Membership'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));

// Components
import ProviderForm from './Components/ProviderForm/ProviderForm';
import YourProfilePage from './Components/YourProfilePage/YourProfilePage';
import EditProfile from "./Components/EditProfile/EditProfile";
import ChatPage from "./Components/Chat/ChatPage";
import SocialProof from './Components/SocialProof/SocialProof';
import Chatbot from './Components/ChatBot/ChatBot';

import menSpa from './Components/Assets/menSpa.png'
import womenSpa from './Components/Assets/womenSpa.png'
import painting from './Components/Assets/painting.png'
import PestControl from './Components/Assets/PestControl.png'
import waterpurifier from './Components/Assets/waterpurifier.png'
import electrician from './Components/Assets/electrician.png'
import AC from './Components/Assets/AC.png'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Suspense fallback={<div className="loading-spinner" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ minHeight: '80vh' }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<LoginSignup/>}/>

            <Route path='/men' element={<ProCategory banner={menSpa} category="Men Salon"/>}/>
            <Route path='/women' element={<ProCategory banner={womenSpa}category="Women Salon"/>}/>
            <Route path='/painter' element={<ProCategory banner={painting}category="Painter"/>}/>
            <Route path='/pestcontrol' element={<ProCategory banner={PestControl}category="Pest Control"/>}/>
            <Route path='/waterpurifier' element={<ProCategory banner={waterpurifier}category="Water Purifier"/>}/>
            <Route path='/electrician' element={<ProCategory banner={electrician}category="Electrician"/>}/>
            <Route path='/ac' element={<ProCategory banner={AC}category="AC"/>}/>

            <Route path="/search" element={<SearchResults />} />
            <Route path='/provider' element={<ProviderForm/>}/>
            <Route path="/edit-profile/:id" element={<EditProfile />} />
            <Route path='/profile' element={<YourProfilePage/>}/>
            <Route path="/propage/:propageId" element={<ProPage />} />
        
            <Route path='/signup' element={<LoginSignup/>}/>

            <Route path="/chat" element={<ChatPage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/hired" element={<HiredProfessionals />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/settings" element={<AccountSettings />} />
          </Routes>
        </motion.div>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div>
      <HashRouter>
        <ScrollToTop />
        <Navbar/>
        <SocialProof />
        <AnimatedRoutes />
        <Chatbot />
        <Footer/>
      </HashRouter>
    </div>
  )
}

export default App;
