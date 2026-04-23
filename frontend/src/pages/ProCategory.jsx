import React, { useContext } from 'react';

import './ProCategory.css';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Profile from '../Components/Profile/Profile';
import {Context } from '../Context/Context';

const ProCategory = (props) => {
  const {all_profile} = useContext(Context);
  console.log("Category from props:", props.category);
console.log("Skill titles:", all_profile.map(i => i.skills));


  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="img" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12</span> out of profiles
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>

      <div className="shopcategory-products">
        {all_profile.map((item, i) => {
          if (props.category === item.category) {
            return (
              <Profile
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                rating={item.rating}
                skills={item.skills}
                category={item.category}
              />
            );
          }
          return null; // ✅ Needed to avoid `undefined` in JSX
        })}
      </div>

      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ProCategory;