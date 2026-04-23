import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Profile from "../Components/Profile/Profile";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    if (!query) return;

    fetch(`http://localhost:4000/search?query=${query}`)
      .then(res => res.json())
      .then(data => setResults(data));
  }, [query]);

  return (
    <div style={{ padding: "40px" }}>
      <h2>
        Search Results for: <span style={{ color: "#0aa" }}>{query}</span>
      </h2>

      {results.length === 0 ? (
        <p>No professionals found.</p>
      ) : (
        <div className="prof-profile">
          {results.map(profile => (
            <Profile
              key={profile._id}
              id={profile._id}
              name={profile.name}
              image={profile.image}
              experience={profile.experience}
              certificate={profile.certificate}
              skills={profile.skills}
              category={profile.category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
