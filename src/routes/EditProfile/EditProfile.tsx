import { useState } from "react";

const EditProfileForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");

  const handleEditProfile = async (data: {
    email: any;
    username: any;
    gender: any;
    dob: any;
    country: any;
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
      console.error("There was an error fetching the user data!", error);
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
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
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default EditProfileForm;
