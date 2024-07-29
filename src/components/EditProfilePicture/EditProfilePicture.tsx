import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import "./EditProfilePicture.css";

interface EditProfilePictureProps {
  closePopup: () => void;
  onProfilePicUpdate: (newPicURL: string) => void; // Callback to update profile pic in ProfilePage
}

const EditProfilePicture: React.FC<EditProfilePictureProps> = ({
  closePopup,
  onProfilePicUpdate,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    // Retrieve and parse email from local storage
    const user = localStorage.getItem("user");
    console.log("Local Storage Data:", user); // Debugging line

    let email = "";
    if (user) {
      try {
        const userObj = JSON.parse(user);
        // Extract email from nested `data` object
        email = userObj.data?.email || "";
        console.log("Extracted Email:", email); // Debugging line
      } catch (error) {
        setError("Error parsing user data from local storage.");
        return;
      }
    }

    if (!email || !email.includes("@")) {
      // Basic email validation
      setError("Email not found in local storage.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", selectedFile);
    formData.append("email", email);

    console.log("Submitting data:", {
      email,
      selectedFile: selectedFile.name,
    });

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/edit_picture_profile",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(`Error: ${errorData.data}`);
        throw new Error(
          `Network response was not ok. Status: ${response.status}`
        );
      }

      console.log("Profile picture updated successfully");
      onProfilePicUpdate("newPicURL");
    } catch (error) {
      console.error("Failed to update profile picture:", error);
      setError("Failed to update profile picture.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-picture-popup">
      <div className="popup-content">
        <h2>Edit Profile Picture</h2>
        <div className="upload-section">
          <label className="upload-banner">
            <input type="file" onChange={handleFileChange} />
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <>
                <FaCamera size={50} />
                <p>
                  {selectedFile ? selectedFile.name : "Upload Profile Picture"}
                </p>
              </>
            )}
          </label>
        </div>
        <div className="popup-actions">
          <button className="cancel-button" onClick={closePopup}>
            Cancel
          </button>
          <button
            className="save-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Save"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default EditProfilePicture;
