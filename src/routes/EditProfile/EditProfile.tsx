// EditProfile.jsx
import React, { useState, useEffect } from "react";
import "./EditProfile.css";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer/FooterHome";
import Navbar from "../../components/Navbar/Navbar";

function EditProfile() {
  const [id, setId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData && parsedUserData.data) {
          const userData = parsedUserData.data;
          setId(String(userData.id || ""));
          setEmail(userData.email || "");
          setUsername(userData.username || "");
          setGender(userData.gender || "");
          setDob(userData.dob || "");
          setCountry(userData.country || "");
        } else {
          console.error("No 'data' key found in parsed userData.");
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    } else {
      console.error("No user data found in localStorage.");
    }
  }, []);

  const handleEditProfile = async (data: {
    email: string;
    username: string;
    gender: string;
    dob: string;
    country: string;
  }) => {
    const payload = {
      email: data.email,
      username: data.username,
      gender: data.gender,
      dob: data.dob,
      country: data.country,
    };
    try {
      const response = await fetch("http://localhost:8080/edit_profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Server Response:", result);
    } catch (error) {
      console.error("There was an error updating the user data!", error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = {
      email,
      username,
      gender,
      dob,
      country,
    };
    handleEditProfile(formData);
  };

  return (
    <div className="editprofile-container">
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className="editprofile-header">
          <h1>Edit Profile</h1>
        </div>
        <div className="editprofile-field">
          <label>ID Pengguna</label>
          <input type="text" value={id} readOnly />
        </div>
        <div className="editprofile-field">
          <label>Email</label>
          <input type="email" value={email} readOnly />
        </div>
        <div className="editprofile-field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="editprofile-field">
          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="editprofile-field">
          <label>Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <div className="editprofile-field">
          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div className="editprofile-buttons">
          <button type="button">
            <Link to="/settings">Cancel</Link>
          </button>
          <button type="submit">Save Profile</button>
        </div>
      </form>
      <Footer />
    </div>
  );
}

export default EditProfile;
