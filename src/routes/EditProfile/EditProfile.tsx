import React, { useState, useEffect } from "react";
import "./EditProfile.css";
import { Link } from "react-router-dom";

function EditProfile() {
  const [id, setId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log("Retrieved userData from localStorage:", userData); // Debugging

    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log("Parsed userData:", parsedUserData); // Debugging

        if (parsedUserData && parsedUserData.data) {
          const userData = parsedUserData.data;
          setId(String(userData.id || "")); // Convert ID to string to handle different formats
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
    console.log("Request Payload:", payload);
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
    <div className="editprofilecontainer">
      <form onSubmit={handleSubmit}>
        <div className="title">
          <h1>Edit Profile</h1>
        </div>
        <label>
          ID:
          <input type="text" value={id} readOnly />
        </label>
        <label>
          Email:
          <input type="email" value={email} readOnly />
        </label>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Gender:
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
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <div className="buttons">
          <button type="button">
            <Link to="/home">Cancel</Link>
          </button>
          <button type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
