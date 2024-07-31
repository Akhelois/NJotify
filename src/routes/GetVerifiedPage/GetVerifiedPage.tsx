import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import "./GetVerifiedPage.css";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar/Navbar";

function GetVerifiedPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData && parsedUserData.data) {
          const userData = parsedUserData.data;
          setRole(String(userData.role || ""));
          setUserId(userData.id);
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile || userId === null) {
      console.error("Profile picture or user ID is required.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async () => {
      const base64ProfilePicture = reader.result as string;
      const payload = {
        id: userId,
        role,
        description,
        profile_picture: base64ProfilePicture,
      };

      console.log("Payload:", payload); // Add this line to log the payload

      try {
        const response = await fetch("http://localhost:8080/get_verified", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("Verification request submitted successfully.");
        } else {
          const errorData = await response.json();
          console.error("Error submitting verification request:", errorData);
        }
      } catch (error) {
        console.error("Error submitting verification request:", error);
      }
    };
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="get-verified-container">
      <div className="header">
        <Navbar />
      </div>
      <div className="content">
        <button className="back-button" onClick={handleBack}>
          <IoArrowBackCircleOutline size={30} />
        </button>
        <div className="upload-section">
          <label className="upload-banner">
            <input type="file" onChange={handleFileChange} />
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <>
                <FaCamera size={50} />
                <p>
                  {selectedFile ? selectedFile.name : "Upload Banner Image"}
                </p>
              </>
            )}
          </label>
        </div>
        <div className="info-section">
          <div className="role">
            <label>Current Role</label>
            <p>{role}</p>
          </div>
          <div className="about-you">
            <label>About You</label>
            <textarea
              placeholder="Tell us about yourself"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="actions">
            <button className="cancel-button" onClick={handleBack}>
              Cancel
            </button>
            <button className="verify-button" onClick={handleSubmit}>
              Get Verified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetVerifiedPage;
