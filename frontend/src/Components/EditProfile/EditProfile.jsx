import React, { useEffect, useState, useContext } from "react";
import "./EditProfile.css";
import upload_area from "../Assets/upload_area.svg";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const EditProfile = () => {
  const { id } = useParams(); // profile id
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [image, setImage] = useState(null);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    image: "",
    category: "",
    description: "",
    skills: "",
    experience: "",
    certificate: "",
    location: "",
    phone: "",
  });

  // 🔹 FETCH EXISTING PROFILE
  useEffect(() => {
    fetch(`/propage/${id}`)
      .then(res => res.json())
      .then(data => {
        setProfileDetails({
          name: data.name || "",
          image: data.image || "",
          category: data.category || "",
          description: data.description || "",
          skills: data.skills || "",
          experience: data.experience || "",
          certificate: data.certificate || "",
          location: data.location || "",
          phone: data.phone || "",
        });
      });
  }, [id]);

  const changeHandler = (e) => {
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  // 🔹 UPDATE PROFILE
  const updateProfile = async () => {
    let updatedProfile = { ...profileDetails, owner: currentUser.uid };

    // upload new image only if changed
    if (image) {
      const formData = new FormData();
      formData.append("profile", image);

      const uploadRes = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      updatedProfile.image = uploadData.image_url;
    }

    await fetch(`/updateprofile/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    });

    alert("Profile Updated Successfully!");
    navigate("/");
  };

  return (
    <div className="edit-profile-container">
      <h2 className='form-title'>👨‍💼 Edit Your Profile</h2>
      
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
      <button onClick={updateProfile} className="submit-btn">
        UPDATE PROFILE
      </button>
    </div>
  );
};

export default EditProfile;
