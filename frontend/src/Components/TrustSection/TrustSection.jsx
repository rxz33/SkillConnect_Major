// src/components/TrustSection.jsx
import React from 'react';
import ig1 from '../Assets/ig1.jpg'
import ig2 from '../Assets/ig2.jpg'
import ig3 from '../Assets/ig3.jpg'
import ig4 from '../Assets/ig4.jpg'
import './TrustSection.css'; 

const TrustSection = () => {
  return (
    <div className="trust-section-container container-fluid ">
      {/* Header and Rating */}
      <div className="row">
        <div className="col-md-6">
          <h1 className="trust-section-header">Trusted by Millions y u Homes</h1>
          <div className="content">
            <div className="trust-section-rating-box">
            <span className="trust-section-rating">4.9/5 Stars</span>
          </div>
            <div className="trust-section-rating-details">
              <p className="trust-section-customer-count">Join 1,000,000+ Happy Customers</p>
            </div>
          </div>
          
        </div>

        <div className="col-md-6">
          <div className="trust-section-profile-grid">
             <img src={ig1} alt="img1" />
             <img src={ig2} alt="img2" />
             <img src={ig3} alt="img3" />
             <img src={ig4} alt="img4" />
          </div>
       </div>
      </div>
    </div>
      
  );
};

export default TrustSection;