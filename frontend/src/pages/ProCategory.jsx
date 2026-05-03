import React, { useContext } from 'react';

import './ProCategory.css';
import dropdown_icon from '../Components/Assets/dropdown_icon.png';
import Profile from '../Components/Profile/Profile';
import {Context } from '../Context/Context';
import { BASE_URL } from '../config';

const ProCategory = (props) => {
  const [profiles, setProfiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/profiles/category/${props.category}`)
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [props.category]);

  return (
    <div className='shop-category'>
      <img className='shopcategory-banner' src={props.banner} alt="img" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-{profiles.length}</span> out of profiles
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>

      <div className="shopcategory-products">
        {loading ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>Loading...</div>
        ) : profiles.length > 0 ? (
          profiles.map((item, i) => (
            <Profile
              key={i}
              id={item._id || item.id}
              name={item.name}
              image={item.image}
              rating={item.rating}
              skills={item.skills}
              category={item.category}
              location={item.location}
              phone={item.phone}
              owner={item.owner}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', width: '100%', padding: '50px' }}>No professionals found in this category.</div>
        )}
      </div>

      <div className="shopcategory-loadmore">
        Explore More
      </div>
    </div>
  );
};

export default ProCategory;
