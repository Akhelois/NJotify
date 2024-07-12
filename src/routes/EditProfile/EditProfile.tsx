import React, { useState, useEffect } from "react";
import "./EditProfile.css";
import { Link } from "react-router-dom";

function EditProfile() {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/find");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Fetched User Data:", result);

        const user = result.data[0];
        setId(user.id);
        setEmail(user.email);
        setUsername(user.username);
        setGender(user.gender);
        setDob(user.dob);
        setCountry(user.country);
      } catch (error) {
        console.error("There was an error fetching the user data!", error);
      }
    };

    fetchUserData();
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
          <button type="submit">
            <Link to="/home">Cancel</Link>
          </button>
          <button type="submit">Update Profile</button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
