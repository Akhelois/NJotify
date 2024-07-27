import { useEffect, useState } from "react";
import "./ProfilePage.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import FooterHome from "../../components/Footer/FooterHome";
import EditProfilePicture from "../../components/EditProfilePicture/EditProfilePicture";

function ProfilePage() {
  const [currentPage, setCurrentPage] = useState("profile");
  const [username, setUsername] = useState<string>("");
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData && parsedUserData.data) {
          const userData = parsedUserData.data;
          setUsername(userData.username || "");
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

  const handleProfilePicClick = () => {
    setIsEditPopupVisible(true);
  };

  const closePopup = () => {
    setIsEditPopupVisible(false);
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
                src="./src/assets/profile.png"
                alt="profile"
                className="profile-pic"
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
        <MusicControl />
      </div>
      {isEditPopupVisible && <EditProfilePicture closePopup={closePopup} />}
    </div>
  );
}

export default ProfilePage;
