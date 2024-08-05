import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import FooterHome from "../../components/Footer/FooterHome";
import EditProfilePicture from "../../components/EditProfilePicture/EditProfilePicture";
import fallbackImage from "../../assets/profile.png"; // Ensure this path is correct

function ProfilePage() {
  const [currentPage, setCurrentPage] = useState("profile");
  const [username, setUsername] = useState<string>("");
  const [profilePicURL, setProfilePicURL] = useState<string | null>(null);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [selectedTrack] = useState<string>("");
  const [albumImage] = useState<string | null>(null);
  const [albumName] = useState<string>("");

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) {
          console.error("User not found in localStorage");
          return;
        }

        const userObj = JSON.parse(user);
        console.log("Parsed user object from localStorage:", userObj);

        if (!userObj.data || !userObj.data.email) {
          console.error("Email not found in user object");
          return;
        }

        const email = userObj.data.email;

        const response = await fetch(
          `http://localhost:8080/find_user?email=${encodeURIComponent(email)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        console.log("User data from backend:", data);
        if (data.data) {
          setUsername(data.data.username || "Unknown");
          if (
            data.data.profile_picture &&
            typeof data.data.profile_picture === "string" &&
            isValidBase64(data.data.profile_picture)
          ) {
            console.log(
              "Valid base64 string for profile picture:",
              data.data.profile_picture
            );
            setProfilePicURL(
              `data:image/jpeg;base64,${data.data.profile_picture}`
            );
          } else {
            console.log("Invalid or missing base64 string for profile picture");
            setProfilePicURL(null);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchData();
  }, []);

  const isValidBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const handleProfilePicClick = () => {
    setIsEditPopupVisible(true);
  };

  const closePopup = () => {
    setIsEditPopupVisible(false);
  };

  const handleProfilePicUpdate = (newPicURL: string) => {
    setProfilePicURL(newPicURL);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== fallbackImage) {
      target.src = fallbackImage;
    }
  };

  return (
    <div className="profile-page">
      <Sidebar setCurrentPage={setCurrentPage} />
      <div className="main">
        <Header />
        <div className="profile-content">
          <header className="profile-header">
            <button
              className="profile-pic-button"
              onClick={handleProfilePicClick}
            >
              <img
                src={profilePicURL || fallbackImage}
                alt="Profile"
                className="profile-pic"
                onError={handleImageError}
              />
            </button>
            <h1>{username || "-"}</h1>
          </header>
          <section className="public-playlists">
            <h2>Public Playlists</h2>
            <div className="playlist-grid">{/* Add playlist items here */}</div>
          </section>
          <section className="follow-info">
            <div className="followers">
              <h2>Followers</h2>
              {/* Add followers items here */}
            </div>
            <div className="mutual-following">
              <h2>Mutual Following</h2>
              {/* Add mutual following items here */}
            </div>
          </section>
        </div>
        <FooterHome />
      </div>
      <div className="music-control">
        <MusicControl
          toggleQueue={toggleQueue}
          selectedTrack={selectedTrack}
          albumName={albumName}
          albumImage={albumImage}
        />
      </div>
      {isEditPopupVisible && (
        <EditProfilePicture
          closePopup={closePopup}
          onProfilePicUpdate={handleProfilePicUpdate}
        />
      )}
    </div>
  );
}

export default ProfilePage;
