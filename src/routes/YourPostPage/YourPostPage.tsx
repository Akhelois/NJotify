import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./YourPostPage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Footer from "../../components/Footer/FooterHome";
import Header from "../../components/Header/Header";
import fallbackImage from "../../assets/profile.png";

interface Album {
  AlbumID: string;
  AlbumName: string;
  AlbumImage: string | null;
  AlbumYear: string;
  CollectionType: string;
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
        const userId = userObj.data.id;

        // Fetch user details
        const userResponse = await fetch(
          `http://localhost:8080/find_user?email=${encodeURIComponent(email)}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user");
        }
        const userData = await userResponse.json();

        if (userData.data) {
          setUsername(userData.data.username || "Unknown");

          if (
            userData.data.profile_picture &&
            typeof userData.data.profile_picture === "string" &&
            isValidBase64(userData.data.profile_picture)
          ) {
            setProfilePicURL(
              `data:image/jpeg;base64,${userData.data.profile_picture}`
            );
          } else {
            setProfilePicURL(fallbackImage);
          }
        }

        // Fetch albums
        const albumsResponse = await fetch(
          `http://localhost:8080/find_discho?user_id=${userId}`,
          { method: "GET" }
        );

        if (!albumsResponse.ok) {
          throw new Error("Failed to fetch albums");
        }
        const albumsData = await albumsResponse.json();
        console.log("Albums data received:", albumsData);

        // Handle the album response and extract the album(s)
        const albumsArray = Array.isArray(albumsData.data)
          ? albumsData.data
          : [albumsData.data]; // Wrap single album object in an array

        // Map the response to match the Album interface
        const formattedAlbums = albumsArray.map((album: any) => ({
          AlbumID: album.album_id,
          AlbumName: album.album_name,
          AlbumImage: album.album_image
            ? `data:image/jpeg;base64,${album.album_image}`
            : null,
          AlbumYear: album.album_year,
          CollectionType: album.collection_type || "Unknown", // Ensure fallback value
        }));

        setAlbums(formattedAlbums);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProfilePicURL(fallbackImage);
        setAlbums([]);
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
    navigate("/create_new_music_page");
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
              {albums.map((album) => (
                <div key={album.AlbumID} className="album">
                  <img
                    src={album.AlbumImage || fallbackImage}
                    alt={album.AlbumName}
                    className="album-image"
                    onError={handleImageError}
                  />
                  <div className="album-detail">
                    <h3>{album.AlbumName}</h3>
                    <p>
                      {album.AlbumYear} - {album.CollectionType}
                    </p>
                  </div>
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
