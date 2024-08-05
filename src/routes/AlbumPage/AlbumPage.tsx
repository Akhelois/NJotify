import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AlbumPage.css";
import SideBar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Header from "../../components/Header/Header";
import FooterHome from "../../components/Footer/FooterHome";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TrackList from "../../components/TrackList/TrackList";
import fallbackImage from "../../assets/google.webp"; // Ensure this path is correct

interface Track {
  track_id: string;
  album_id: string;
  track_name: string;
  track_song: string;
}

interface Album {
  album_id: string;
  user_id: number;
  album_name: string;
  album_image: string | null;
  album_year: string;
  collection_type: string;
}

const AlbumPage: React.FC = () => {
  const { albumID } = useParams<{ albumID: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumAndTracks = async () => {
      const id = albumID || "";

      try {
        // Fetch album data
        const albumResponse = await fetch(
          `http://localhost:8080/find_album?album_id=${encodeURIComponent(id)}`
        );
        if (!albumResponse.ok) {
          throw new Error("Failed to fetch album");
        }
        const albumData = await albumResponse.json();
        setAlbum(albumData.data);
        console.log("Album Data:", albumData.data);

        // Fetch track data
        const trackResponse = await fetch(
          `http://localhost:8080/find_track_in_album?album_id=${encodeURIComponent(id)}`
        );
        if (!trackResponse.ok) {
          throw new Error("Failed to fetch tracks");
        }
        const trackData = await trackResponse.json();
        setTracks(trackData.data);
        console.log("Track Data:", trackData.data);
      } catch (error) {
        console.error("Error fetching album or tracks:", error);
        // setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumAndTracks();
  }, [albumID]);

  // Handle image loading error
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== fallbackImage) {
      target.src = fallbackImage;
    }
  };

  // Handle album image click
  const handleAlbumImageClick = () => {
    // Implement the desired functionality when album image is clicked
    console.log("Album image clicked");
  };

  // Validate base64 string
  const isValidBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="album-page">
        <SideBar setCurrentPage={() => {}} />
        <div className="main">
          <Header />
          <div className="album-content">
            <header className="album-header">
              <h1>
                <Skeleton width={200} />
              </h1>
            </header>
            <section className="album-grid">
              <Skeleton height={200} width={200} />
              <div className="album-details">
                <Skeleton height={20} width={150} />
                <Skeleton height={15} width={100} />
                <Skeleton height={15} width={100} />
              </div>
            </section>
          </div>
          <FooterHome />
        </div>
        <div className="music-control">
          <MusicControl />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="album-page">
        <SideBar setCurrentPage={() => {}} />
        <div className="main">
          <Header />
          <div className="album-content">
            <p>Error: {error}</p>
          </div>
          <FooterHome />
        </div>
        <div className="music-control">
          <MusicControl />
        </div>
      </div>
    );
  }

  // Log the album data and base64 image string for debugging
  console.log("Album:", album);
  console.log("Base64 Image:", album?.album_image);

  return (
    <div className="album-page">
      <SideBar setCurrentPage={() => {}} />
      <div className="main">
        <Header />
        <div className="album-content">
          <header className="album-header">
            <h1>{album?.album_name}</h1>
          </header>
          <div className="album-details-container">
            <img
              src={
                album?.album_image && isValidBase64(album?.album_image)
                  ? `data:image/jpeg;base64,${album?.album_image}`
                  : fallbackImage
              }
              alt={album?.album_name}
              onError={handleImageError}
              onClick={handleAlbumImageClick}
              className="album-image"
            />

            <div className="album-details">
              <h3>{album?.album_name}</h3>
              <p>{album?.album_year}</p>
              <p>{album?.collection_type}</p>
            </div>
          </div>
          <TrackList tracks={tracks} />
        </div>
        <FooterHome />
      </div>
      <div className="music-control">
        <MusicControl />
      </div>
    </div>
  );
};

export default AlbumPage;
