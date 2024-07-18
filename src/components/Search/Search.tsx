import React, { useState } from "react";
import "./Search.css";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { FaMicrophone } from "react-icons/fa";
import { Link } from "react-router-dom";

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleAudioInput = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("getUserMedia is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);

      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/flac" });
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.flac");

        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.transcription) {
          setSearchText(data.transcription);
        } else {
          console.error("Transcription error:", data.error);
        }
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  return (
    <div className="header">
      <div className="prev-btn">
        <button>
          <div className="icon">
            <GoChevronLeft />
          </div>
        </button>
        <button>
          <div className="icon">
            <GoChevronRight />
          </div>
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for songs, artists, etc."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="audio-input-btn" onClick={handleAudioInput}>
          <FaMicrophone />
        </button>
      </div>

      <div className="profile">
        <button onClick={toggleDropdown}>
          <span>
            <img src="./src/assets/profile.png" alt="profile" />
          </span>
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/profile_page" className="dropdown-item">
              View Profile
            </Link>
            <Link to="/edit_profile" className="dropdown-item">
              Edit Profile
            </Link>
            <Link to="/" className="dropdown-item">
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
