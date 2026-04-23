import React from 'react'
import candidate_data from '../Assets/data'
import './RelatedServices.css'
import Profile from '../Profile/Profile'

const RelatedServices = () => {
  return (
    <div className="relatedprofiles">
        <h1>Related Servicess</h1>
        <hr/>
        <div className="relatedprofiles-item">
            {
                candidate_data.map((item,i)=>{
                    return <Profile key={i} id={item.id} name={item.name} image={item.image} rating={item.rating} skill={item.skill}/>
                })
            }
        </div>
    </div>
  )
}

export default RelatedServices