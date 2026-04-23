import React, { useContext} from 'react';
import './ProPageDisplay.css';
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaCertificate } from 'react-icons/fa'; 
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getOrCreateChat } from "../Chat/getOrCreateChat";


const ProPageDisplay = (props) => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();


    const defaultProfile = {
        name: "Rakesh Mundel",
        image: "path/to/default/image.jpg",
        category: "Electrician",
        description: "Certified professional electrician providing best services for residential and commercial needs, focusing on safety and efficiency.",
        skills: ["Wiring Installation", "Circuit Breaker Repair", "Appliance Connection", "Fixture Setup"],
        experience: 15, // Years
        certificate: "National Electrician Certification (NEC), OSHA Safety Certified, High-Voltage Handling",
        location: "Greater Noida, Uttar Pradesh, India", // Location is crucial
        rating: 4.5,
        reviews: 122,
        owner:null,
        tags: ["Modern", "Latest", "Residential", "Commercial"]
    };

    const { profile = defaultProfile } = props;

    const startChat = async () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        const chatId = await getOrCreateChat(
            currentUser.uid,
            profile.owner
        );
        navigate("/chat", { state: { chatId } });
    };


    // Helper to render rating stars
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const dullStars = 5 - fullStars;
        const stars = [];

        // Full Stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className='star-icon' />);
        }

        // Dull Stars
        for (let i = 0; i < dullStars; i++) {
            stars.push(<FaStar key={`dull-${i}`} className='star-dull-icon' />);
        }
        
        return stars;
    };
     const remove_profile=async(id)=>{
    await fetch('http://localhost:4000/removeprofile',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'Content-type':'application/json',
      },
      body:JSON.stringify({id:id})
    })
    alert("Profile Removed!");
  }
  const editProfile = () => {
  navigate("/edit-profile/:id");
};
const callNow = () => {
  if (!profile.phone) {
    alert("Phone number not available");
    return;
  }

  window.location.href = `tel:${profile.phone}`;
};


  const isMyProfile = currentUser && currentUser.uid === profile.owner;
    return (
        <div className='profile-page-container'>
            {/* You would typically include breadcrumbs here */}

            <div className='profile-card-display'>
                
                {/* --- 1. TOP HEADER SECTION (Image and Info) --- */}
                <div className='profiledisplay-header'>
                    <div className="profiledisplay-left">
                        <img className='profiledisplay-main-img' src={profile.image || defaultProfile.image} alt={profile.name} />
                    </div>

                    <div className="profiledisplay-right">
                        <h1>{profile.name}</h1>
                        
                        {/* Rating */}
                        <div className="profiledisplay-right-star">
                            {/* Rendering stars based on rating prop */}
                            {renderStars(profile.rating || defaultProfile.rating)}
                            <p>({profile.reviews || defaultProfile.reviews})</p>
                        </div>
                        
                        {/* Location (New Field) */}
                        <div className="profiledisplay-location">
                            
                            <span><FaMapMarkerAlt className='location-icon'/>{profile.location || defaultProfile.location}</span>
                        </div>
                        
                       {/* ⭐ LOGIC: SHOW BUTTONS ACCORDING TO USER */}
      {isMyProfile ? (
  <>
    <button onClick={editProfile} className="book-service-btn">
      Edit Profile
    </button>
    <button
      onClick={() => remove_profile(profile.id)}
      className="book-service-btn"
    >
      Delete Profile
    </button>
  </>
) : (
  <>
    <button className="book-service-btn" onClick={() => window.location.href = "tel:+919876543210"}>
  📞 Call Now
  </button>


    <button
      className="book-service-btn"
      style={{ background: "#0d6efd", marginTop: "10px" }}
      onClick={startChat}
    >
      Chat with Professional
    </button>
  </>
)}

        </div>
    </div>

                {/* --- 2. DETAILS CONTENT SECTION (Below Header) --- */}
                <div className='profiledisplay-details-content'>
                    
                    {/* LEFT SIDE CONTENT */}
                    <div className='details-left-column'>
                        
                        {/* About Me / Description */}
                        <section className='about-me-section'>
                            <h3 className='section-title-teal'>About Me</h3>
                            <p>{profile.description || defaultProfile.description}</p>
                        </section>

                        {/* Experience & Certification Boxes */}
                        <div className='info-boxes-grid'>
                            <div className='info-box'>
                                <FaBriefcase className='box-icon' />
                                <p className='box-title'>Experience</p>
                                <p className='box-value'>**{profile.experience || defaultProfile.experience}+ Years**</p>
                            </div>
                            
                            <div className='info-box'>
                                <FaCertificate className='box-icon' />
                                <p className='box-title'>Certification</p>
                                <p className='box-value'>{profile.certificate || defaultProfile.certificate}</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE CONTENT */}
                    <div className='details-right-column'>
                        
                        {/* Skills & Expertise */}
                        <section className='skills-section'>
                            <h3 className='section-title-teal'>Skills & Expertise</h3>
                            <div className='skills-list'>
                                {(profile.skills ? profile.skills.split(",") : defaultProfile.skills).map((skill, index) => (
                                    <span key={index} className='skill-tag'>{skill}</span>
                                ))}
                            </div>
                        </section>
                        
                        {/* Category & Tags */}
                        <section className='service-details-section'>
                            <h3 className='section-title-black'>Category: {profile.category || defaultProfile.category}</h3>
                            <p className='tags-list'>
                                <span>Tags:</span> {(profile.tags || defaultProfile.tags).join(', ')}
                            </p>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProPageDisplay;