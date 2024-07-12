import { useState } from "react";
import "./EditProfile.css";

function EditProfilePage() {
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("Indonesia");

  const handleSave = () => {
    console.log("Profile saved!");
  };

  return (
    <div className="edit-profile-page">
      <div className="header">
        <button className="back-button">Back</button>
        <h1>Edit Profile</h1>
      </div>
      <form className="edit-profile-form">
        <div className="form-group">
          <label>ID Pengguna</label>
          <input type="text" value="02a3f-jw09x48a9-37j103j09sa" readOnly />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div className="form-buttons">
          <button type="button" className="cancel-button">
            Cancel
          </button>
          <button type="button" className="save-button" onClick={handleSave}>
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfilePage;
