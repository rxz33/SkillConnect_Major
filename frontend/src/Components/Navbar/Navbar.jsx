import React, { useState,useEffect,useRef } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const auth = getAuth();
  const [currUser, setCurrUser] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [search, setSearch] = useState("");
const sidebarRef = useRef(null);

const navigate = useNavigate();

 const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${search}`);

  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrUser(user); 
    });

    return () => unsubscribe();
  }, []);

    // Close sidebar if clicked outside
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpenSidebar(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div className='navbar'>
        <div className="nav-logo">
          <a className="navbar-brand" href='/'>Skill Connect</a>
        </div>

        {/* Search bar */}
        
        {/*<div className="location-wrapper">
          <span className="material-symbols-outlined location-icon">search</span>
          <input className="form-control input-btn" type="text" placeholder="Search" />
        </div>*/}
        <form className="location-wrapper" role="search" onSubmit={handleSubmit}>
          <span className="material-symbols-outlined location-icon">search</span>
      <input
        className="form-control  input-btn"
        type="search"
        placeholder="Search the Service"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>



        {/* Location bar */}
        <div className="location-wrapper">
          <span className="material-symbols-outlined location-icon">location_on</span>
          <input className="form-control input-btn" type="text" placeholder="Location" />
        </div>

        {/* Right side Icons */}
        <div className="nav-login-signup ">
        {!currUser ? (
          <>
         <Link className="btn custom-btn me-2" to="/signup"><b>Sign Up</b></Link>
         <Link className="btn custom-btn" to="/login"><b>Log In</b></Link>

          </>
        ) : (
          <>
          <span 
                className="material-symbols-outlined profile-icon"
                onClick={() => setOpenSidebar(!openSidebar)}
              >
                account_circle
              </span>

              {/* Sidebar Menu */}
              {openSidebar && (
                <div className="profile-sidebar" ref={sidebarRef}>
                  
                  {/* Top User Info */}
                  <div className="profile-header">
                    <span className="material-symbols-outlined profile-avatar">account_circle</span>
                    <h4>{currUser.displayName || "User Name"}</h4>
                    <p>Profession</p>
                  </div>

                  <hr />

                  {/* Menu Items */}
                  <div className="profile-menu">

                    <Link to="/profile" className="profile-item">
                      <span className="material-symbols-outlined">person</span>
                      Your Profile
                    </Link>

                    <Link to="/membership" className="profile-item">
                      <span className="material-symbols-outlined">receipt_long</span>
                      Membership
                    </Link>

                    <Link to="/provider" className="profile-item">
                    <span class="material-symbols-outlined">engineering</span>
                      Become a Provider
                    </Link>

                    <Link to="/settings" className="profile-item">
                      <span className="material-symbols-outlined">settings</span>
                      Account Settings
                    </Link>

                    <div 
                      className="profile-item logout" 
                      onClick={() => auth.signOut()}
                    >
                      <span className="material-symbols-outlined">logout</span>
                      Log Out
                    </div>

                  </div>

                </div>
              )}
            </>
        )}
       </div>

      
      </div>
    </>
  );
};

export default Navbar;








/*import React,{useState,useContext}from 'react';
import './Navbar.css'
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom';
import {Context} from '../../Context/Context'

const Navbar=()=>{

    return(
    <div className='navbar'>
      <div className="nav-logo">
        {//<img  src={logo} alt="img"/>
        }
        <p>Skill Connect</p>
      </div>
        
  <div className="location-wrapper">
  <span className="material-symbols-outlined location-icon">search</span>

  <input
    className="form-control input-btn"
    type="text"
    placeholder="Search"
    name="search"
  />
</div>


 <div className="location-wrapper">
  <span className="material-symbols-outlined location-icon">location_on</span>

  <input
    className="form-control input-btn"
    type="text"
    placeholder="location"
    name="location"
  />
</div>



  <div className="nav-login-cart">
    <Link to="/cart"><img src={cart_icon} alt="cart"/></Link>
          {localStorage.getItem('auth-token')
          ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Log Out</button>
        :<Link to="/login"><span class="material-symbols-outlined">account_circle</span></Link>
        }
          
         
        </div>
   </div>
  )
}
export default Navbar */