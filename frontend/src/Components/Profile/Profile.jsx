import React from 'react'
import './Profile.css'
import { Link } from 'react-router-dom';

const Profile = (props) => {
  return (
    <div className="item">
        <Link to={`/propage/${props.id}`}><img onClick={()=>window.scrollTo(0,0)} src={props.image} alt=""></img></Link>
        <p>{props.name}</p>
        <div className="service">{props.category}</div>
        <div className="item-rating">
                {props.rating}       
        </div>
    </div>
  )
}

export default  Profile