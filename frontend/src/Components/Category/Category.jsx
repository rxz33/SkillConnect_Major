import React from "react";
import "./Category.css";
import { Link } from "react-router-dom";

const Category = () => {
  return (
    <div>
      <h3>What are you looking for?</h3>

      <div id="filters">

        <Link to="/women" className="filter">
          <div>
            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1678864013225-bfc1de.jpeg" />
          </div>
          <p>Women's Salon & Spa</p>
        </Link>

        <Link to="/men" className="filter">
          <div>
            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1750845033589-98cdfb.jpeg" />
          </div>
          <p>Men's Salon & Spa</p>
        </Link>

        <Link to="/ac" className="filter">
          <div>
            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1751547558710-5ff49a.jpeg" />
          </div>
          <p>Ac & Appliance Repair</p>
        </Link>

        <Link to="/Home Cleaning" className="filter">
          <div>
            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1699869110346-61ab83.jpeg" />
          </div>
          <p>Cleaning & Pest Control</p>
        </Link>

        <Link to="/electrician" className="filter">
          <div>
            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1678868062337-08bfc2.jpeg" />
          </div>
          <p>Electrician, Plumber & Carpenter</p>
        </Link>

        <Link to="/plumber" className="filter">
          <div>
            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1754919084321-eda462.jpeg" />
          </div>
          <p>Water Purifier</p>
        </Link>

        <Link to="/painter" className="filter">
          <div>
            <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_56,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1674120935535-f8d5c8.jpeg" />
          </div>
          <p>Painting & Water Proofing</p>
        </Link>

      </div>
    </div>
  );
};

export default Category;
