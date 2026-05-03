import React, { useContext, memo } from 'react'
import './Profile.css'
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config.js';
import { FaPhoneAlt, FaStar, FaMapMarkerAlt, FaCommentDots, FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext";
import { getOrCreateChat } from "../Chat/getOrCreateChat";

const Profile = (props) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const openProfile = () => {
    if (!props.id) return;
    window.scrollTo(0, 0);
    navigate(`/propage/${props.id}`);
  };

  const handleCall = (event) => {
    event.stopPropagation();
    if (!props.phone) {
      event.preventDefault();
      alert("Phone number not available");
    }
  };

  const handleChat = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!props.owner) {
      alert("Chat is not available for this professional right now");
      return;
    }

    if (currentUser.uid === props.owner) {
      alert("This is your own profile");
      return;
    }

    const chatId = await getOrCreateChat(currentUser.uid, props.owner);
    navigate("/chat", { state: { chatId } });
  };

  return (
    <div className="item" onClick={openProfile} role="link" tabIndex={0} onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProfile();
      }
    }}>
        <div className="item-top">
          <img src={props.image.startsWith('http') ? props.image : `${BASE_URL}${props.image}`} alt={props.name}></img>
          <div className="item-main">
            <p>{props.name}</p>
            <div className="item-rating">
              <FaStar />
              <span>{props.rating || 5}.0</span>
            </div>
            <div className="item-location">
              <FaMapMarkerAlt />
              <span>{props.location || "Greater Noida, UP"}</span>
            </div>
          </div>
        </div>
        <div className="service">{props.category}</div>
        <div className="verified-badge">
          <FaCheckCircle />
          <span>Verified Skill Connect Badge</span>
        </div>
        <div className="item-actions">
          <a className="call-btn" href={props.phone ? `tel:${props.phone}` : "#"} onClick={handleCall}>
            <FaPhoneAlt />
            <span>Call Now</span>
          </a>
          <Link className="chat-btn" to="/chat" onClick={handleChat}>
            <FaCommentDots />
            <span>Live Chat</span>
          </Link>
        </div>
    </div>
  )
}

export default memo(Profile)
