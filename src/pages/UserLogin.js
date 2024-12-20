import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const UserLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("Logging in with credentials:", credentials);

      const response = await axios.post("http://localhost:5000/api/users/login", {
        ...credentials
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
        <button type="submit" style={{ width: "100%" }}>Login</button>
      </form>
    </div>
  );
};

export default UserLogin;
