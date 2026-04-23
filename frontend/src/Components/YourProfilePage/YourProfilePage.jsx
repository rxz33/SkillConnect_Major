import React, { useState } from 'react';
import './YourProfilePage.css';
import { FaEdit, FaCheck, FaTimes, FaMapMarkerAlt, FaBriefcase, FaCertificate, FaStar } from 'react-icons/fa';
import upload_area from '../Assets/upload_area.svg'; // Assuming you have an upload placeholder image

// Initial Profile Data (This would be fetched from your backend)
const initialProfileData = {
    name: "Rakesh Mundel",
    image: "path/to/Rakesh_Mundel_image.jpg", // Replace with the actual image path
    category: "Electrician",
    description: "Certified professional electrician providing best services for residential and commercial needs, focusing on safety and efficiency.",
    skills: "Wiring Installation, Circuit Breaker Repair, Appliance Connection, Fixture Setup", // Keep as string for easy editing
    experience: 15,
    certificate: "National Electrician Certification (NEC), OSHA Safety Certified, High-Voltage Handling",
    location: "Greater Noida, Uttar Pradesh, India",
    rating: 4.5, // Display only, not editable by provider
    reviews: 122, // Display only
    tags: "Modern, Latest, Residential, Commercial",
};

const YourProfilePage = () => {
    const [profile, setProfile] = useState(initialProfileData);
    const [editMode, setEditMode] = useState(false);
    const [tempProfile, setTempProfile] = useState(initialProfileData);
    const [imageFile, setImageFile] = useState(null);

    // Handler for text input changes
    const changeHandler = (e) => {
        setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
    };

    // Handler for image file upload
    const imageHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create a temporary URL for preview
            setTempProfile({ ...tempProfile, image: URL.createObjectURL(file) });
        }
    };

    // Function to handle saving changes
    const handleSave = () => {
        // --- 1. HANDLE IMAGE UPLOAD (if imageFile exists) ---
        // This is where you would call your backend's image upload endpoint (e.g., /upload)

        // --- 2. HANDLE PROFILE DATA UPDATE ---
        // This is where you would call your backend's update endpoint (e.g., /updateprofile)
        
        // For demonstration, update the main state with temp state
        setProfile(tempProfile);
        setImageFile(null); // Clear file after save
        setEditMode(false);
        alert("Profile Updated Successfully!");
    };

    // Function to handle canceling edits
    const handleCancel = () => {
        setTempProfile(profile); // Revert back to the last saved state
        setImageFile(null); // Clear any pending file
        setEditMode(false);
    };

    return (
        <div className='your-profile-container'>
            <div className='profile-header-bar'>
                <h2>Your Profile Information</h2>
                <button 
                    className={`edit-toggle-btn ${editMode ? 'cancel' : 'edit'}`} 
                    onClick={() => editMode ? handleCancel() : setEditMode(true)}
                >
                    {editMode ? <><FaTimes /> Cancel</> : <><FaEdit /> Edit Profile</>}
                </button>
            </div>

            <div className='profile-card-edit'>
                
                {/* --- 1. TOP HEADER SECTION (Image and Info) --- */}
                <div className='profiledisplay-header'>
                    
                    {/* Image Section (Editable) */}
                    <div className="profiledisplay-left">
                        <label htmlFor="file-input-edit" className='image-upload-area'>
                            <img 
                                className='profiledisplay-main-img' 
                                src={imageFile ? tempProfile.image : profile.image} 
                                alt={profile.name} 
                            />
                            {editMode && (
                                <div className='image-overlay'>
                                    <img src={upload_area} alt="Upload" />
                                    <p>Click to Upload</p>
                                </div>
                            )}
                        </label>
                        <input 
                            onChange={imageHandler} 
                            type="file" 
                            name="image" 
                            id="file-input-edit" 
                            hidden 
                            disabled={!editMode}
                        />
                    </div>

                    {/* Name, Location, Button */}
                    <div className="profiledisplay-right">
                        {editMode ? (
                            <input 
                                className='editable-input-large' 
                                type="text" 
                                name="name" 
                                value={tempProfile.name} 
                                onChange={changeHandler} 
                            />
                        ) : (
                            <h1 className='profile-name'>{profile.name}</h1>
                        )}
                        
                        {/* Rating (Read-Only) */}
                        <div className="profiledisplay-right-star">
                            {/* Assuming 4.5 stars for display consistency */}
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className='star-icon' style={{color: i + 0.5 < profile.rating ? '#e53935' : '#ccc'}}/>
                            ))}
                            <p>({profile.reviews})</p>
                        </div>
                        
                        {/* Location (Editable) */}
                        <div className="profiledisplay-location">
                            <FaMapMarkerAlt className='location-icon' />
                            {editMode ? (
                                <input 
                                    className='editable-input-small' 
                                    type="text" 
                                    name="location" 
                                    value={tempProfile.location} 
                                    onChange={changeHandler} 
                                />
                            ) : (
                                <span>{profile.location}</span>
                            )}
                        </div>
                        
                        {/* Save Button only in Edit Mode */}
                        {editMode && (
                            <button className='save-changes-btn' onClick={handleSave}>
                                <FaCheck /> Save Changes
                            </button>
                        )}
                    </div>
                </div>

                {/* --- 2. DETAILS CONTENT SECTION (Editable Fields) --- */}
                <div className='profiledisplay-details-content'>
                    
                    {/* LEFT SIDE CONTENT: About Me, Experience, Certification */}
                    <div className='details-left-column'>
                        
                        {/* About Me / Description (Editable) */}
                        <section className='about-me-section'>
                            <h3 className='section-title-teal'>About Me</h3>
                            {editMode ? (
                                <textarea 
                                    className='editable-textarea' 
                                    name="description" 
                                    value={tempProfile.description} 
                                    onChange={changeHandler}
                                />
                            ) : (
                                <p>{profile.description}</p>
                            )}
                        </section>

                        {/* Experience & Certification Boxes (Editable) */}
                        <div className='info-boxes-grid'>
                            <div className='info-box'>
                                <FaBriefcase className='box-icon' />
                                <p className='box-title'>Experience</p>
                                {editMode ? (
                                    <input 
                                        type="number" 
                                        name="experience" 
                                        value={tempProfile.experience} 
                                        onChange={changeHandler}
                                        className='editable-box-input'
                                    />
                                ) : (
                                    <p className='box-value'>**{profile.experience}+ Years**</p>
                                )}
                            </div>
                            
                            <div className='info-box'>
                                <FaCertificate className='box-icon' />
                                <p className='box-title'>Certification</p>
                                {editMode ? (
                                    <textarea 
                                        name="certificate" 
                                        value={tempProfile.certificate} 
                                        onChange={changeHandler}
                                        className='editable-box-textarea'
                                    />
                                ) : (
                                    <p className='box-value'>{profile.certificate}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE CONTENT: Skills & Service Details */}
                    <div className='details-right-column'>
                        
                        {/* Skills & Expertise (Editable) */}
                        <section className='skills-section'>
                            <h3 className='section-title-teal'>Skills & Expertise</h3>
                            {editMode ? (
                                <textarea 
                                    className='editable-textarea' 
                                    name="skills" 
                                    value={tempProfile.skills} 
                                    onChange={changeHandler}
                                    placeholder="Enter skills separated by commas (e.g., Skill 1, Skill 2)"
                                />
                            ) : (
                                <div className='skills-list'>
                                    {profile.skills.split(',').map((skill, index) => (
                                        <span key={index} className='skill-tag'>{skill.trim()}</span>
                                    ))}
                                </div>
                            )}
                        </section>
                        
                        {/* Category & Tags (Editable) */}
                        <section className='service-details-section'>
                            <h3 className='section-title-black'>Category: 
                                {editMode ? (
                                    <select 
                                        name="category" 
                                        value={tempProfile.category} 
                                        onChange={changeHandler}
                                        className='editable-select'
                                    >
                                        <option value="Electrician">Electrician</option>
                                        <option value="Plumber">Plumber</option>
                                        {/* Add other categories here */}
                                    </select>
                                ) : (
                                    <span> {profile.category}</span>
                                )}
                            </h3>
                            <p className='tags-list'>
                                <span>Tags:</span>
                                {editMode ? (
                                    <input 
                                        type="text" 
                                        name="tags" 
                                        value={tempProfile.tags} 
                                        onChange={changeHandler}
                                        className='editable-input-tags'
                                    />
                                ) : (
                                    profile.tags
                                )}
                            </p>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default YourProfilePage;