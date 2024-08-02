import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./YourPostPage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Footer from "../../components/Footer/FooterHome";
import Header from "../../components/Header/Header";
import fallbackImage from "../../assets/profile.png";

interface Album {
  id: string;
  title: string;
  cover: string | null;
}

function YourPostPage() {
  const [username, setUsername] = useState<string>("");
  const [profilePicURL, setProfilePicURL] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) {
          console.error("User not found in localStorage");
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

        if (data.data) {
          setUsername(data.data.username || "Unknown");

          if (
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
        }

        // Uncomment and handle this if you want to fetch albums data
        // const albumsResponse = await fetch(
        //   `http://localhost:8080/get_albums?email=${encodeURIComponent(email)}`
        // );
        // if (!albumsResponse.ok) {
        //   throw new Error("Failed to fetch albums");
        // }
        // const albumsData = await albumsResponse.json();
        // setAlbums(albumsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProfilePicURL(fallbackImage);
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

  const handleCreateAlbumClick = () => {
    navigate("/create_album_page");
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
    <div className="your-post-page">
      <Sidebar
        setCurrentPage={(page: string) => {
          console.log("Set current page to:", page);
        }}
      />
      <div className="main">
        <div className="header-banner">
          <Header />
          <div className="banner">
            <img
              src={profilePicURL || fallbackImage}
              alt="Profile"
              className="banner-image"
              onError={handleImageError}
            />
            <div className="banner-text">
              <h6>Verified Artist</h6>
              <h1>Hi, {username}</h1>
            </div>
          </div>
        </div>
        <div className="profile-content">
          <div className="discography">
            <h2>Discography</h2>
            <div className="albums">
              <div
                className="album create-album"
                onClick={handleCreateAlbumClick}
              >
                <div className="create-album-icon">+</div>
              </div>
              {albums.length > 0 &&
                albums.map((album) => (
                  <div key={album.id} className="album">
                    <img
                      src={album.cover || fallbackImage}
                      alt={album.title}
                      className="album-image"
                    />
                    <h2>{album.title}</h2>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <div className="music-control">
        <MusicControl />
      </div>
    </div>
  );
}

export default YourPostPage;
