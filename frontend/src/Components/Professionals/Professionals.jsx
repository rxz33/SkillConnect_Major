import {React,useState,useEffect, useContext} from 'react'
import './Professionals.css'
import { BASE_URL } from '../../config.js'
import { Context } from '../../Context/Context'
//import candidate_data from '../Assets/data.js'
import Profile from '../Profile/Profile'


const Professionals = () => {
    const { topProfessionals, setTopProfessionals } = useContext(Context);
    const [loading, setLoading] = useState(topProfessionals.length === 0);

    useEffect(() => {
        if (topProfessionals.length === 0) {
            setLoading(true);
            fetch(`${BASE_URL}/topprofessional`)
                .then((resp) => resp.json())
                .then((data) => {
                    setTopProfessionals(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [topProfessionals, setTopProfessionals]);

    return (
        <div className="Professionals-pg">
            <h1>Meet Our Top Rated Professionals</h1>
            <hr />
            <div className="prof-profile">
                {loading ? (
                    <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : topProfessionals.length > 0 ? (
                    topProfessionals.map((item, i) => (
                        <Profile
                            key={i}
                            id={item._id || item.id}
                            name={item.name}
                            image={item.image}
                            experience={item.experience}
                            certificate={item.certificate}
                            skills={item.skills}
                            category={item.category}
                            location={item.location}
                            rating={item.rating}
                            phone={item.phone}
                            owner={item.owner}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', width: '100%', padding: '40px', color: '#666' }}>
                        <p>No professionals found. Please seed the database or add a profile.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Professionals
