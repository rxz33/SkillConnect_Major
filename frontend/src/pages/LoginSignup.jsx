import React, { useState } from "react";
import "./LoginSignup.css";
import { googleSignIn, auth } from "../firebase";  // <-- IMPORTANT
import { Link } from "react-router-dom";

const LoginSignup = () => {
  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;

      console.log("User:", user);

      // Save user in localStorage
      localStorage.setItem("auth-token", user.accessToken);
      localStorage.setItem("user-name", user.displayName);
      localStorage.setItem("user-email", user.email);
      localStorage.setItem("user-photo", user.photoURL);

      // Redirect
      window.location.replace("/");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to Skill Connect</h2>

      {/* Google Login Button */}
      <button className="google-login" onClick={handleGoogleLogin}>
        <img
  src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
  alt="Google"
  className="google-icon"
/>
        Continue with Google
      </button>

      <div className="divider">
        <span>OR</span>
      </div>

      {/* Optional normal signup/login form */}
      <form className="login-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />

        <button type="submit">Login</button>

        <p>
          Don't have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginSignup;
