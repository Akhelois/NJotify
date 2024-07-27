import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import "./EditProfilePicture.css";

interface EditProfilePictureProps {
  closePopup: () => void;
}

const EditProfilePicture: React.FC<EditProfilePictureProps> = ({
  closePopup,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // Implement the logic to save the new profile picture
    closePopup();
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
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePicture;
