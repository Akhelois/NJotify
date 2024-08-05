import React, { useState, useEffect, useCallback } from "react";
import "./Search.css";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { FaMicrophone } from "react-icons/fa";
import { Link } from "react-router-dom";
import fallbackImage from "../../assets/profile.png";

type Album = {
  album_id: string;
  album_image: string;
  album_name: string;
  album_year: number;
  collection_type: string;
};

interface SearchProps {
  setAlbums: (albums: Album[]) => void;
}

const Search: React.FC<SearchProps> = ({ setAlbums }) => {
  const [searchText, setSearchText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePicURL, setProfilePicURL] = useState<string | null>(null);

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
          data.data?.profile_picture &&
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

  const debounce = (func: Function, delay: number) => {
    let timer: number | undefined;
    return (...args: any[]) => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
      timer = window.setTimeout(() => func(...args), delay);
    };
  };

  const fetchAlbums = async (query: string) => {
    try {
      if (!query.trim()) {
        setAlbums([]);
        return;
      }
      const response = await fetch(
        `http://localhost:8080/find_album_name?album_name=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch albums: ${response.statusText} - ${errorText}`
        );
      }
      const data = await response.json();
      setAlbums(data.Data || []);
    } catch (error) {
      console.error("Failed to fetch albums", error);
    }
  };

  const debouncedFetchAlbums = useCallback(debounce(fetchAlbums, 300), []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    debouncedFetchAlbums(e.target.value); // Fetch albums with debounce
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
      setTimeout(() => mediaRecorder.stop(), 5000);

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
          fetchAlbums(data.transcription); // Fetch albums based on transcription
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
          onChange={handleSearch}
        />
        <button className="audio-input-btn" onClick={handleAudioInput}>
          <FaMicrophone />
        </button>
      </div>

      <div className="profile">
        <div className="profile-menu" onClick={toggleDropdown}>
          <img
            src={profilePicURL || fallbackImage}
            alt="Profile"
            className="profile-picture"
          />
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item">
              Profile
            </Link>
            <Link to="/" className="dropdown-item">
              Home
            </Link>
            <Link to="/login" className="dropdown-item">
              Logout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
