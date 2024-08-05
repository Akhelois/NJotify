import React, { useState, useEffect } from "react";
import "./Search.css";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { FaMicrophone } from "react-icons/fa";
import { Link } from "react-router-dom";
import fallbackImage from "../../assets/profile.png"; // Ensure this path is correct

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePicURL, setProfilePicURL] = useState<string | null>(null);

  // Fetch the profile picture from localStorage or API
  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) {
          console.error("User not found in localStorage");
          setProfilePicURL(fallbackImage);
          return;
        }

        const userObj = JSON.parse(user);
        const email = userObj.data.email;

        const response = await fetch(
          `http://localhost:8080/find_user?email=${encodeURIComponent(email)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();

        if (
          data.data &&
          data.data.profile_picture &&
          typeof data.data.profile_picture === "string" &&
          isValidBase64(data.data.profile_picture)
        ) {
          setProfilePicURL(
            `data:image/jpeg;base64,${data.data.profile_picture}`
          );
        } else {
          setProfilePicURL(fallbackImage);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePicURL(fallbackImage);
      }
    };

    fetchProfilePic();
  }, []);

  const isValidBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

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
            <img src={profilePicURL || fallbackImage} alt="profile" />
          </span>
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/profile_page" className="dropdown-item">
              View Profile
            </Link>
            <Link to="/settings" className="dropdown-item" target="_blank">
              Account
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
