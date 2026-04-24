import React, { useContext} from 'react';
import './ProPageDisplay.css';
import { BASE_URL } from '../../config.js';
import { FaStar, FaMapMarkerAlt, FaBriefcase, FaCertificate, FaExternalLinkAlt } from 'react-icons/fa'; 
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getOrCreateChat } from "../Chat/getOrCreateChat";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet marker icon not showing in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to recenter map when coordinates change
function RecenterMap({ center }) {
    const map = useMap();
    React.useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
}


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

    const [isHired, setIsHired] = React.useState(false);
    const [scheduledDate, setScheduledDate] = React.useState("");
    const [scheduledTime, setScheduledTime] = React.useState("");

    React.useEffect(() => {
        const checkHiringStatus = async () => {
            if (currentUser && profile.id) {
                try {
                    const response = await fetch(`${BASE_URL}/check-hiring/${currentUser.uid}/${profile.id}`);
                    const data = await response.json();
                    setIsHired(data.isHired);
                } catch (error) {
                }
            }
        };
        checkHiringStatus();
    }, [currentUser, profile.id]);

    const handleHire = async () => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profileId: profile.id,
                    name: profile.name,
                    price: profile.price || 50,
                    userId: currentUser.uid,
                    scheduledDate,
                    scheduledTime
                })
            });
            const session = await response.json();
            if (session.url) {
                window.location.href = session.url; // Redirect to Stripe
            }
        } catch (error) {
            alert("Payment failed to initialize");
        }
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

    const [mapCenter, setMapCenter] = React.useState([28.6139, 77.2090]); // Default Delhi

    React.useEffect(() => {
        const geocodeAddress = async () => {
            const address = profile.location || defaultProfile.location;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                }
            } catch (error) {
                // Ignore geocoding errors, stay at default
            }
        };
        geocodeAddress();
    }, [profile.location]);
     const remove_profile=async(id)=>{
    await fetch(`${BASE_URL}/removeprofile`,{
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
                        
                        {/* Price */}
                        <div className="profiledisplay-price">
                            <h2>${profile.price || 50} <span>/ Hiring Fee</span></h2>
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

    {!isHired && (
      <div className="hiring-schedule" style={{ marginBottom: '15px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>Select Preferred Date & Time:</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="date" 
            className="form-control" 
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // Prevent past dates
          />
          <input 
            type="time" 
            className="form-control" 
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
          />
        </div>
      </div>
    )}

    <button
      className="book-service-btn"
      style={{ 
        background: isHired ? "#6c757d" : (!scheduledDate || !scheduledTime ? "#999" : "#28a745"), 
        marginTop: "10px", 
        color: "white",
        cursor: (isHired || (!scheduledDate && !isHired) || (!scheduledTime && !isHired)) ? "not-allowed" : "pointer" 
      }}
      onClick={() => {
        if (isHired) return;
        if (!scheduledDate || !scheduledTime) {
            alert("Please select a date and time first!");
            return;
        }
        handleHire();
      }}
      disabled={isHired}
    >
      {isHired ? "✅ Already Hired" : "🚀 Hire Now"}
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

                {/* --- 3. INTERACTIVE MAP SECTION --- */}
                <div className='profiledisplay-map-section'>
                    <h3 className='section-title-teal'>Service Location</h3>
                    <div style={{ height: '300px', width: '100%', marginTop: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd' }}>
                        <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={mapCenter}>
                                <Popup>
                                    {profile.name} <br /> {profile.location || defaultProfile.location}
                                </Popup>
                            </Marker>
                            <RecenterMap center={mapCenter} />
                        </MapContainer>
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FaMapMarkerAlt color="#0d6efd" /> {profile.location || defaultProfile.location}
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profile.location || defaultProfile.location)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ marginLeft: 'auto', color: '#0d6efd', textDecoration: 'none' }}
                        >
                            Open in Google Maps <FaExternalLinkAlt size={12} />
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProPageDisplay;
