import React,{createContext,useState,useEffect} from "react";
import { BASE_URL } from "../config.js";
//import candidate_data from "../Components/Assets/data.js";

export const Context=createContext(null);

const ContextProvider=(props)=>{
    const [all_profile,setAll_Profile]=useState([]);

    useEffect(()=>{
    fetch(`${BASE_URL}/allprofiles`)
    .then((response)=>response.json())
    .then((data)=>setAll_Profile(data))

  },[]);

  const contextValue={all_profile};
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider;
