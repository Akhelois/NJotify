import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import "./GetVerifiedPage.css";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar/Navbar";

const GetVerifiedPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData && parsedUserData.data) {
          const userData = parsedUserData.data;
          setRole(String(userData.role || ""));
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleBack = () => {
    navigate(-1); // Undo
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
            <textarea placeholder="Tell us about yourself"></textarea>
          </div>
          <div className="actions">
            <button className="cancel-button">Cancel</button>
            <button className="verify-button">Get Verified</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetVerifiedPage;
