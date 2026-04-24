import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../Context/Context";
import "./ChatBot.css";

const fallbackProfiles = [
  {
    id: "dd04de71-a83f-4e85-b8e8-978b386604fb",
    name: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    category: "Software Developer",
    description:
      "Full-stack developer specializing in React, Node.js, and scaling web applications.",
    location: "Seattle, WA",
    skills: "React, MongoDB, Node.js, AWS",
    certificate: "AWS Certified Developer",
    rating: 5,
    experience: 6,
    price: 85
  },
  {
    id: "1361c418-7392-4e49-9053-37f767bf63c1",
    name: "Michael Smith",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    category: "Electrician",
    description:
      "Residential electrician focused on smart home installations and power system upgrades.",
    location: "Austin, TX",
      skills: "Smart Home, Wiring, Circuit Repair",
    certificate: "Journeyman Electrician",
    rating: 5,
    experience: 8,
    price: 60
  }
];

const serviceMatchers = [
  {
    key: "haircut",
    label: "haircut and salon",
    keywords: [
      "haircut",
      "hair",
      "salon",
      "spa",
      "barber",
      "stylist",
      "beauty",
      "men salon",
      "women salon"
    ]
  },
  {
    key: "electrician",
    label: "electrician",
    keywords: [
      "electrician",
      "electrical",
      "wiring",
      "circuit",
      "power",
      "smart home"
    ]
  },
  {
    key: "plumber",
    label: "plumber",
    keywords: [
      "plumber",
      "plumbing",
      "pipe",
      "tap",
      "drain",
      "leak",
      "bathroom",
      "kitchen sink"
    ]
  },
  {
    key: "painter",
    label: "painter",
    keywords: ["painter", "painting", "waterproof", "wall paint", "paint"]
  },
  {
    key: "ac",
    label: "AC and appliance repair",
    keywords: [
      "ac",
      "air conditioner",
      "cooling",
      "appliance",
      "repair",
      "service"
    ]
  },
  {
    key: "pest",
    label: "cleaning and pest control",
    keywords: ["pest", "cleaning", "home cleaning", "sanitize", "deep clean"]
  },
  {
    key: "water",
    label: "water purifier",
    keywords: ["water purifier", "purifier", "ro", "filter", "water"]
  },
  {
    key: "developer",
    label: "software developer",
    keywords: ["developer", "software", "react", "node", "aws", "web app"]
  }
];

const geocodeCache = new Map();

const normalizeText = (value = "") => value.toLowerCase().trim();

const formatDistance = (distanceKm) => {
  if (distanceKm == null) return "Distance unavailable";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m away`;
  return `${distanceKm.toFixed(1)} km away`;
};

const getProfileSearchText = (profile) =>
  normalizeText(
    [
      profile.name,
      profile.category,
      profile.description,
      profile.skills,
      profile.certificate,
      profile.location
    ]
      .filter(Boolean)
      .join(" ")
  );

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const getDistanceKm = (from, to) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const geocodeLocation = async (locationText) => {
  const key = normalizeText(locationText);

  if (!key) return null;
  if (geocodeCache.has(key)) return geocodeCache.get(key);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
        locationText
      )}`
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }

    const results = await response.json();
    const firstMatch = results?.[0];
    const coords = firstMatch
      ? {
          lat: Number(firstMatch.lat),
          lon: Number(firstMatch.lon)
        }
      : null;

    geocodeCache.set(key, coords);
    return coords;
  } catch (error) {
    console.error("Unable to geocode location:", locationText, error);
    geocodeCache.set(key, null);
    return null;
  }
};

const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status ${response.status}`);
    }

    const result = await response.json();
    const address = result?.address || {};

    return (
      [
        address.city,
        address.town,
        address.village,
        address.state,
        address.country
      ].filter(Boolean)[0] || result?.display_name || "Current location"
    );
  } catch (error) {
    console.error("Unable to reverse geocode current location:", error);
    return "Current location";
  }
};

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });

const detectIntent = (query) => {
  const normalizedQuery = normalizeText(query);

  if (
    normalizedQuery.includes("all services") ||
    normalizedQuery.includes("all service") ||
    normalizedQuery.includes("services i have") ||
    normalizedQuery.includes("what services") ||
    normalizedQuery.includes("available services")
  ) {
    return { type: "all-services" };
  }

  const matchedService = serviceMatchers.find((service) =>
    service.keywords.some((keyword) => normalizedQuery.includes(keyword))
  );

  if (matchedService) {
    return { type: "service", service: matchedService };
  }

  return { type: "general" };
};

const rankProfiles = (profiles) =>
  [...profiles].sort((a, b) => {
    if ((b.rating || 0) !== (a.rating || 0)) {
      return (b.rating || 0) - (a.rating || 0);
    }

    if (a.distanceKm != null && b.distanceKm != null && a.distanceKm !== b.distanceKm) {
      return a.distanceKm - b.distanceKm;
    }

    if ((b.experience || 0) !== (a.experience || 0)) {
      return (b.experience || 0) - (a.experience || 0);
    }

    return (a.price || 0) - (b.price || 0);
  });

const Chatbot = () => {
  const { all_profile } = useContext(Context);
  const profiles = useMemo(
    () => (all_profile?.length ? all_profile : fallbackProfiles),
    [all_profile]
  );

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "text",
      text:
        "Ask me for the best electrician, plumber, haircut, or all services near you.",
      sender: "bot"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Location not shared");
  const [userCoords, setUserCoords] = useState(null);

  const ensureLocation = async () => {
    if (userCoords) {
      return userCoords;
    }

    setLocationStatus("Checking your location...");
    const coords = await getCurrentPosition();
    const label = await reverseGeocode(coords.lat, coords.lon);
    setUserCoords(coords);
    setLocationStatus(`Using ${label}`);
    return coords;
  };

  const buildServicesSummary = () => {
    const uniqueCategories = [...new Set(profiles.map((profile) => profile.category))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    return uniqueCategories.join(", ");
  };

  const getRecommendation = async (question) => {
    const intent = detectIntent(question);
    let locationError = null;
    let coords = null;

    try {
      coords = await ensureLocation();
    } catch (error) {
      locationError = error;
      setLocationStatus("Location unavailable");
    }

    let matchingProfiles = profiles;

    if (intent.type === "service") {
      matchingProfiles = profiles.filter((profile) => {
        const searchText = getProfileSearchText(profile);
        return intent.service.keywords.some((keyword) => searchText.includes(keyword));
      });
    }

    if (intent.type === "general") {
      const queryTokens = normalizeText(question)
        .split(/\s+/)
        .filter((token) => token.length > 2);

      matchingProfiles = profiles.filter((profile) => {
        const searchText = getProfileSearchText(profile);
        return queryTokens.some((token) => searchText.includes(token));
      });
    }

    if (!matchingProfiles.length) {
      return {
        type: "text",
        sender: "bot",
        text:
          "I could not find a matching service yet. Try asking for electrician, plumber, haircut, AC repair, painter, or all services."
      };
    }

    const profilesWithDistance = await Promise.all(
      matchingProfiles.map(async (profile) => {
        if (!coords) {
          return { ...profile, distanceKm: null };
        }

        const profileCoords = await geocodeLocation(profile.location);
        const distanceKm = profileCoords ? getDistanceKm(coords, profileCoords) : null;

        return {
          ...profile,
          distanceKm
        };
      })
    );

    const rankedProfiles = rankProfiles(profilesWithDistance);
    const bestProfile = rankedProfiles[0];

    if (intent.type === "all-services") {
      return {
        type: "recommendation",
        sender: "bot",
        text: locationError
          ? `I found your services list, but I could not access your location. Available services: ${buildServicesSummary()}. Here is the highest-rated profile overall.`
          : `Available services: ${buildServicesSummary()}. Here is the top-rated match closest to your location.`,
        profile: bestProfile
      };
    }

    const serviceLabel =
      intent.type === "service" ? intent.service.label : "service";

    return {
      type: "recommendation",
      sender: "bot",
      text: locationError
        ? `I found the best ${serviceLabel} profile, but I could not access your location for distance.`
        : `Here is the best ${serviceLabel} profile near your location.`,
      profile: bestProfile
    };
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    setMessages((prev) => [
      ...prev,
      { type: "text", text: trimmedInput, sender: "user" }
    ]);
    setInput("");
    setLoading(true);

    try {
      const botMessage = await getRecommendation(trimmedInput);
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "text",
          text: "I hit a problem while checking profiles. Please try again.",
          sender: "bot"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = async () => {
    try {
      await ensureLocation();
    } catch (error) {
      console.error("Location access failed:", error);
      setLocationStatus("Location permission denied");
    }
  };

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbox">
          <div className="chat-header">
            <div>
              <h3>SkillConnect Assistant</h3>
              <p>{locationStatus}</p>
            </div>
            <button className="location-button" onClick={handleUseLocation}>
              Use My Location
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.sender}`}>
                <div className={`message-bubble ${msg.sender}`}>
                  <p>{msg.text}</p>

                  {msg.type === "recommendation" && msg.profile && (
                    <div className="recommendation-card">
                      <img src={msg.profile.image} alt={msg.profile.name} />
                      <div className="recommendation-body">
                        <h4>{msg.profile.name}</h4>
                        <span>{msg.profile.category}</span>
                        <strong>Rating: {msg.profile.rating || 0}/5</strong>
                        <small>{formatDistance(msg.profile.distanceKm)}</small>
                        <small>{msg.profile.location}</small>
                        <small>{msg.profile.skills}</small>
                        <Link to={`/propage/${msg.profile.id}`} className="view-profile-link">
                          View profile
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-row bot">
                <div className="message-bubble bot">
                  <p>Checking the best match for you...</p>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask for the best electrician, haircut, or all services"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        Ask AI
      </button>
    </div>
  );
};

export default Chatbot;
