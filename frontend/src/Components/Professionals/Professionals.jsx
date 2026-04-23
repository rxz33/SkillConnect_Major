import {React,useState,useEffect} from 'react'
import './Professionals.css'
//import candidate_data from '../Assets/data.js'
import Profile from '../Profile/Profile'
import { testFirestore } from "../../testFireStore.js";

const Professionals = () => {
   
     const [topProfessional,setTopProfessional]=useState([]);
    useEffect(()=>{
        testFirestore();
        fetch('http://localhost:4000/topprofessional')
        .then((resp)=>resp.json())
        .then((data)=>setTopProfessional(data))
    },[])


  return (
    <div className="Professionals-pg">
        <h1>Meet Our Top Rated Professionals</h1>
    <hr/>
    <div className="prof-profile">
        {topProfessional.map((item,i)=>{
            console.log("Rendering item:", item);
            return <Profile key={i} id={item.id} name={item.name} image={item.image} experience={item.experience} certificate={item.certificate} skills={item.skills} category={item.category} />
        })}
    </div>
    </div>
    )
}

export default Professionals