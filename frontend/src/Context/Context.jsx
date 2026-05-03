import React,{createContext,useState,useEffect} from "react";
import { BASE_URL } from "../config.js";
//import candidate_data from "../Components/Assets/data.js";

export const Context = createContext(null);

const ContextProvider = (props) => {
    const [all_profile, setAll_Profile] = useState([]);
    const [topProfessionals, setTopProfessionals] = useState([]);
    const [categoryCache, setCategoryCache] = useState({});

    const contextValue = React.useMemo(() => ({ 
        all_profile, setAll_Profile, 
        topProfessionals, setTopProfessionals,
        categoryCache, setCategoryCache
    }), [all_profile, topProfessionals, categoryCache]);

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
}
export default ContextProvider;
