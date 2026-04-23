import React from 'react'
import TrustSection from '../Components/TrustSection/TrustSection';
import Professionals from '../Components/Professionals/Professionals';
import Category from '../Components/Category/Category';
const Home = () => {
    console.log("Home rendering");
  return (
    <div className='home'>
        <TrustSection/>
        <Category/>
        <Professionals/>
        <hr style={{ background: "#e0e0e0", height: "2px", border: "none" }} />
    </div>
  )
}

export default Home