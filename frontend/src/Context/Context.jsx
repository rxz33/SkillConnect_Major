import React,{createContext,useState,useEffect} from "react";
//import candidate_data from "../Components/Assets/data.js";

export const Context=createContext(null);

const ContextProvider=(props)=>{
    const [all_profile,setAll_Profile]=useState([]);

    useEffect(()=>{
    fetch('http://localhost:4000/allprofiles')
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