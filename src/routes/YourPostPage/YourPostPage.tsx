import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./YourPostPage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Footer from "../../components/Footer/FooterHome";
import Header from "../../components/Header/Header";
import fallbackImage from "../../assets/profile.png";
import Queue from "../../components/Queue/Queue";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Album {
  AlbumID: string;
  AlbumName: string;
  AlbumImage: string | null;
  AlbumYear: string;
  CollectionType: string;
}

interface AlbumApiResponse {
  album_id: string;
  album_name: string;
  album_image: string | null;
  album_year: string;
  collection_type: string | null;
}

function YourPostPage() {
  const [username, setUsername] = useState<string>("");
  const [profilePicURL, setProfilePicURL] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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

        // If data is an array, use it; otherwise wrap in an array
        const albumsArray: AlbumApiResponse[] = Array.isArray(albumsData.data)
          ? albumsData.data
          : [albumsData.data]; // Wrap single object in an array

        console.log("Normalized albums array:", albumsArray);

        // Map the response to match the Album interface
        const formattedAlbums: Album[] = albumsArray.map((album) => ({
          AlbumID: album.album_id,
          AlbumName: album.album_name,
          AlbumImage: album.album_image
            ? `data:image/jpeg;base64,${album.album_image}`
            : null,
          AlbumYear: album.album_year,
          CollectionType: album.collection_type || "Unknown", // Ensure fallback value
        }));

        console.log("Formatted albums:", formattedAlbums);

        setAlbums(formattedAlbums);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProfilePicURL(fallbackImage);
        setAlbums([]);
      } finally {
        setLoading(false);
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

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album_page/${albumId}`);
  };

  return (
    <div className="your-post-page">
      {loading ? (
        <div>
          <Skeleton
            height={60}
            width={`100%`}
            baseColor="#202020"
            highlightColor="#444"
          />
          <div className="main">
            <Skeleton
              height={40}
              width={`100%`}
              baseColor="#202020"
              highlightColor="#444"
            />
            <Skeleton
              height={300}
              width={`100%`}
              baseColor="#202020"
              highlightColor="#444"
            />
            <Skeleton
              height={40}
              width={`100%`}
              baseColor="#202020"
              highlightColor="#444"
            />
            <Skeleton
              height={200}
              width={`100%`}
              baseColor="#202020"
              highlightColor="#444"
            />
          </div>
          <Skeleton
            height={60}
            width={`100%`}
            baseColor="#202020"
            highlightColor="#444"
          />
        </div>
      ) : (
        <>
          <Sidebar
            setCurrentPage={(page: string) => {
              console.log("Set current page to:", page);
            }}
          />
          <div className="main">
            <Header />
            <div className="header-banner">
              <div className="banner">
                <img
                  src={profilePicURL || fallbackImage}
                  alt="Profile"
                  className="banner-image"
                  onError={handleImageError}
                />
                <div className="banner-text">
                  <h6>
                    <img
                      src="./src/assets/verified-icon-png.webp"
                      alt="verified-icon"
                      className="verified-icon"
                    />
                    Verified Artist{" "}
                  </h6>
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
                    <div
                      key={album.AlbumID}
                      className="album"
                      onClick={() => handleAlbumClick(album.AlbumID)}
                    >
                      <img
                        src={album.AlbumImage || fallbackImage}
                        alt={album.AlbumName}
                        className="album-image"
                        onError={handleImageError}
                      />
                      <div className="album-details">
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
            <MusicControl
              toggleQueue={toggleQueue}
              selectedTrack={selectedTrack}
              albumName={albumName}
              albumImage={albumImage}
            />
          </div>
          {showQueue && (
            <div className="queue-container">
              <Queue />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default YourPostPage;
