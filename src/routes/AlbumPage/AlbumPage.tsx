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
import fallbackImage from "../../assets/google.webp";

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
  const [showQueue, setShowQueue] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [albumImage, setAlbumImage] = useState<string | null>(null);
  const [albumName, setAlbumName] = useState<string>("");

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  useEffect(() => {
    const fetchAlbumAndTracks = async () => {
      const id = albumID || "";

      try {
        const albumResponse = await fetch(
          `http://localhost:8080/find_album?album_id=${encodeURIComponent(id)}`
        );
        if (!albumResponse.ok) {
          throw new Error("Failed to fetch album");
        }
        const albumData = await albumResponse.json();
        setAlbum(albumData.data);
        console.log("Album Data:", albumData.data);

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
        // setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumAndTracks();
  }, [albumID]);

  useEffect(() => {
    if (album) {
      if (album.album_image && isValidBase64(album.album_image)) {
        setAlbumImage(`data:image/jpeg;base64,${album.album_image}`);
      } else {
        setAlbumImage(fallbackImage);
      }
      setAlbumName(album.album_name);
    }
  }, [album]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== fallbackImage) {
      target.src = fallbackImage;
    }
  };

  const handleAlbumImageClick = () => {
    console.log("Album image clicked");
  };

  const isValidBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const handleTrackSelect = (trackSong: string) => {
    setSelectedTrack(trackSong);
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
            <section className="album-details-container">
              <Skeleton height={300} width={300} />
              <div className="album-details">
                <Skeleton height={30} width={150} />
                <Skeleton height={20} width={100} />
                <Skeleton height={20} width={100} />
              </div>
            </section>
          </div>
          <FooterHome />
        </div>
        <div className="music-control">
          <MusicControl
            toggleQueue={toggleQueue}
            selectedTrack={selectedTrack}
            albumImage={albumImage}
            albumName={albumName}
          />
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
          <MusicControl
            toggleQueue={toggleQueue}
            selectedTrack={selectedTrack}
            albumImage={albumImage}
            albumName={albumName}
          />
        </div>
      </div>
    );
  }

  console.log("Album:", album);
  console.log("Base64 Image:", album?.album_image);

  return (
    <div className="album-page">
      <SideBar setCurrentPage={() => {}} />
      <div className="main">
        <Header />
        <div className="album-content">
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
              <p>{album?.collection_type}</p>
              <h3>{album?.album_name}</h3>
              <p>{album?.album_year}</p>
            </div>
          </div>
          <TrackList tracks={tracks} onTrackSelect={handleTrackSelect} />
        </div>
        <FooterHome />
      </div>
      <div className="music-control">
        <MusicControl
          toggleQueue={toggleQueue}
          selectedTrack={selectedTrack}
          albumImage={albumImage}
          albumName={albumName}
        />
      </div>
    </div>
  );
};

export default AlbumPage;
