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

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (parsedUserData?.data) {
          const userData = parsedUserData.data;
          setUsername(userData.username || "");

          const profilePic = userData.profile_picture;
          if (profilePic) {
            if (isBase64Image(profilePic)) {
              setProfilePicURL(profilePic);
            } else {
              convertBinaryToBase64(profilePic);
            }
          }
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    }
  }, []);

  const isBase64Image = (str: string) => {
    const base64Pattern = /^data:image\/(png|jpeg|jpg|gif);base64,/;
    return base64Pattern.test(str);
  };

  const convertBinaryToBase64 = (binaryData: string) => {
    const byteNumbers = new Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      byteNumbers[i] = binaryData.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: "image/png" });
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1];
      if (base64String) {
        const dataUrl = `data:image/png;base64,${base64String}`;
        setProfilePicURL(dataUrl);
      }
    };

    reader.readAsDataURL(blob);
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
        <MusicControl />
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
