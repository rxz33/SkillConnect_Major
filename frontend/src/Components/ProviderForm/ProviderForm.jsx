import { React, useState, useContext } from 'react';
import './ProviderForm.css';
import upload_area from '../assets/upload_area.svg';
import { AuthContext } from "../../Context/AuthContext";

const ProviderForm = () => {
    const [image, setImage] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const [profileDetails, setProfileDetails] = useState({
        name: "",
        image: "",
        category: "electrician",
        description: "",
        skills: "",
        experience: "",
        certificate: "",
        location: "",
        phone:""
    });


    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
    };

    const Add_Profile = async () => {
        // Function handles API calls and submission logic
        let responseData;
        let profile = { ...profileDetails, owner: currentUser.uid };

        let formData = new FormData();
        formData.append('profile', image);

        // 1. Upload Image
        try {
            const uploadResponse = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: formData,
            });
            responseData = await uploadResponse.json();
        } catch (error) {
            alert("Image upload failed. Check the server connection.");
            console.error("Upload error:", error);
            return;
        }

        // 2. Add Profile details
        if (responseData.success) {
            profile.image = responseData.image_url;
            try {
                const addProfileResponse = await fetch('http://localhost:4000/addprofile', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(profile),
                });
                const data = await addProfileResponse.json();
                data.success ? alert("Profile Added Successfully!") : alert("Failed to add profile.");
            } catch (error) {
                alert("Profile submission failed. Check server.");
                console.error("Submission error:", error);
            }
        }
    };

    // Note: Wrapping fields in a <form> tag is generally better practice.
    // However, the submit logic is still tied to the button's onClick.
    return (
        <div className='provider-form-container'>
            <h2 className='form-title'>👨‍💼 Create Your Provider Profile</h2>

            {/* SECTION 1: Personal & Service Info */}
            <div className="form-section">
                <div className="form-group two-columns">
                    {/* Name */}
                    <div className="form-field">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            value={profileDetails.name}
                            onChange={changeHandler}
                            type="text"
                            name="name"
                            placeholder="Type your full name"
                        />
                    </div>
                    {/* Category Selector */}
                    <div className="form-field">
                        <label htmlFor="category">Service Category</label>
                        <select
                            id="category"
                            value={profileDetails.category}
                            onChange={changeHandler}
                            name="category"
                            className="form-selector"
                        >
                            <option value="electrician">Electrician</option>
                            <option value="plumber">Plumber</option>
                            <option value="carpenter">Carpenter</option>
                            <option value="water purifier">Water Purifier</option>
                            <option value="pest control">Pest Control</option>
                            <option value="cook">Cook</option>
                            <option value="men salon">Men Salon</option>
                            <option value="women salon">Women Salon</option>
                        </select>
                    </div>
                </div>

                {/* Profile Picture Upload */}
                <div className="form-field image-upload-area">
                    <p className="label-text">Profile Picture</p>
                    <label htmlFor="file-input" className='image-upload-label'>
                        <img
                            src={image ? URL.createObjectURL(image) : upload_area}
                            className='profile-thumbnail-img'
                            alt="Upload Profile Picture"
                        />
                        <span className="upload-tip">Click to upload your image</span>
                    </label>
                    <input onChange={imageHandler} type="file" name="image" id="file-input" hidden/>
                </div>
                <div className="form-field">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" value={profileDetails.phone} onChange={changeHandler} type="tel" name="phone"placeholder="e.g. 9876543210" pattern="[0-9]{10}" maxLength="10"/>
                </div>

            </div>
            
            {/* SECTION 2: Professional Details */}
            <div className="form-section">
                <h3>Professional Details</h3>
                {/* Description */}
                <div className="form-field full-width">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={profileDetails.description}
                        onChange={changeHandler}
                        name="description"
                        placeholder="Briefly describe your services, experience, and professionalism (max 300 words)."
                        rows="4"
                    ></textarea>
                </div>

                <div className="form-group two-columns">
                    {/* Skills */}
                    <div className="form-field">
                        <label htmlFor="skills">Key Skills (Comma-separated)</label>
                        <input
                            id="skills"
                            value={profileDetails.skills}
                            onChange={changeHandler}
                            type="text"
                            name="skills"
                            placeholder="E.g., Troubleshooting, HVAC repair, Tile work"
                        />
                    </div>
                    {/* Experience */}
                    <div className="form-field">
                        <label htmlFor="experience">Years of Experience</label>
                        <input
                            id="experience"
                            value={profileDetails.experience}
                            onChange={changeHandler}
                            type="number"
                            name="experience"
                            placeholder="5"
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-group two-columns">
                    {/* Location */}
                    <div className="form-field">
                        <label htmlFor="location">Service Location (City/Area)</label>
                        <input
                            id="location"
                            value={profileDetails.location}
                            onChange={changeHandler}
                            type="text"
                            name="location"
                            placeholder="E.g., New Delhi, Brooklyn"
                        />
                    </div>
                    {/* Certification */}
                    <div className="form-field">
                        <label htmlFor="certificate">Certification/License</label>
                        <input
                            id="certificate"
                            value={profileDetails.certificate}
                            onChange={changeHandler}
                            type="text"
                            name="certificate"
                            placeholder="E.g., Master License ID, Diploma"
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={() => { Add_Profile() }}
                className="submit-btn"
                type="button" // Use type="button" since the logic is in onClick
            >
                SUBMIT PROFILE
            </button>
        </div>
    );
};

export default ProviderForm;