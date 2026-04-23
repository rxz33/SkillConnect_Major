import React from 'react'
import './Breadcrums.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadcrums = (props) => {
    const {profile}=props;
  return (
    <div className='breadcrum'>
        HOME<img src={arrow_icon} alt=""/>
        PROFILE<img src={arrow_icon} alt=""/>{profile.category}
        <img src={arrow_icon} alt=""/>{profile.name}
    </div>
  )
}

export default Breadcrums