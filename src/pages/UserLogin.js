import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha"; // Import the reCAPTCHA component

const UserLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [captchaValue, setCaptchaValue] = useState(null); // To store the reCAPTCHA response
  const navigate = useNavigate();

  // Handle captcha change
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if captcha is completed
    if (!captchaValue) {
      setError("Please complete the CAPTCHA.");
      return;
    }

    try {
      console.log("Logging in with credentials:", credentials);

      const response = await axios.post("http://localhost:5000/api/users/login", {
        ...credentials,
        captcha: captchaValue, // Add captcha response to the request
      });
      console.log("Response:", response.data);

      const { role } = response.data;

      // Navigate based on the user role
      if (role === "project manager") {
        console.log("Navigating to /project-manager");
        navigate("/project-manager");
      } else if (role === "team member") {
        console.log("Navigating to /team-member");
        navigate("/team-member");
      } else {
        setError("Unauthorized role.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <form onSubmit={handleLogin} style={{ width: "300px", textAlign: "center" }}>
        <h1>User Login</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          style={{ display: "block", width: "100%", marginBottom: "10px" }}
        />
        {/* Add the reCAPTCHA widget */}
        <ReCAPTCHA
          sitekey="6Ld97pgqAAAAAClaCyScyQcJ8W7sr8e0jjacgsR4" // Replace with your site key from Google reCAPTCHA
          onChange={handleCaptchaChange}
        />
        <button type="submit" style={{ width: "100%" }}>Login</button>
      </form>
    </div>
  );
};

export default UserLogin;
