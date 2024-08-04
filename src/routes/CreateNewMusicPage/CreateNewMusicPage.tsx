import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateNewMusicPage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Footer from "../../components/Footer/FooterHome";
import Header from "../../components/Header/Header";
import { FaCamera } from "react-icons/fa";

const CreateNewMusicPage = () => {
  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [collectionType, setCollectionType] = useState<string>("Album");
  const [tracks, setTracks] = useState<{ name: string; file: File | null }[]>([
    { name: "", file: null },
  ]);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

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

        console.log("User data:", data); // Add this line
        if (data.data) {
          setId(data.data.id || "Unknown");
          console.log("ID set to:", data.data.id); // Add this line
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTrackNameChange = (index: number, value: string) => {
    const newTracks = [...tracks];
    newTracks[index].name = value;
    setTracks(newTracks);
  };

  const handleTrackFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newTracks = [...tracks];
      newTracks[index].file = file;
      setTracks(newTracks);
    }
  };

  const addTrack = () => {
    if (isValidTrackCount(tracks.length + 1)) {
      setTracks([...tracks, { name: "", file: null }]);
      setTrackError(null);
    } else {
      setTrackError(
        `For ${collectionType}, you can only have ${getTrackLimits()} tracks.`
      );
    }
  };

  const removeTrack = (index: number) => {
    if (tracks.length > 1) {
      setTracks(tracks.filter((_, i) => i !== index));
      setTrackError(null);
    }
  };

  const handleSubmit = async () => {
    if (!id || id === "Unknown") {
      console.error("User ID is invalid or missing.");
      return;
    }

    if (!isValidTrackCount(tracks.length)) {
      setTrackError(
        `For ${collectionType}, you need between ${getTrackLimits()} tracks.`
      );
      return;
    }
    setTrackError(null);

    try {
      // Prepare album data
      const albumFormData = new FormData();
      albumFormData.append("user_id", id);
      albumFormData.append("album_name", title);
      albumFormData.append("collection_type", collectionType);

      const albumYear = new Date().getFullYear().toString();
      albumFormData.append("album_year", albumYear);

      if (mainImage) {
        albumFormData.append("album_image", mainImage);
      }

      // Debugging: Log the form data
      albumFormData.forEach((value, key) => {
        console.log("Album FormData:", key, value);
      });

      // Create the album
      const albumResponse = await fetch("http://localhost:8080/albums", {
        method: "POST",
        body: albumFormData,
      });

      if (!albumResponse.ok) {
        const errorText = await albumResponse.text();
        throw new Error(`Failed to create album: ${errorText}`);
      }

      const albumData = await albumResponse.json();
      const albumID = albumData.data.albumID;

      if (!albumID) {
        throw new Error("Album ID not received from server.");
      }

      console.log("Album created with ID:", albumID);

      // Create tracks
      for (const track of tracks) {
        const trackFormData = new FormData();
        trackFormData.append("album_id", albumID);
        trackFormData.append("track_name", track.name);

        if (track.file) {
          trackFormData.append("track_song", track.file);
        }

        // Debugging: Log track data
        trackFormData.forEach((value, key) => {
          console.log("Track FormData:", key, value);
        });

        const trackResponse = await fetch("http://localhost:8080/tracks", {
          method: "POST",
          body: trackFormData,
        });

        if (!trackResponse.ok) {
          const errorText = await trackResponse.text();
          throw new Error(`Failed to create track: ${errorText}`);
        }

        console.log("Track created:", await trackResponse.json());
      }

      // Navigate to the next page on successful creation
      navigate("/your_post");
    } catch (error) {
      console.error("Error creating album and tracks:", error);
    }
  };

  const handleCancel = () => {
    navigate("/your_post");
  };

  const isValidTrackCount = (count: number) => {
    switch (collectionType) {
      case "Single":
        return count >= 1 && count <= 3;
      case "EP":
        return count >= 4 && count <= 6;
      case "Album":
        return count > 6;
      default:
        return false;
    }
  };

  const getTrackLimits = () => {
    switch (collectionType) {
      case "Single":
        return "1 to 3";
      case "EP":
        return "4 to 6";
      case "Album":
        return "more than 6";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (!isValidTrackCount(tracks.length)) {
      switch (collectionType) {
        case "Single":
          setTracks(Array(1).fill({ name: "", file: null }));
          break;
        case "EP":
          setTracks(Array(4).fill({ name: "", file: null }));
          break;
        case "Album":
          setTracks(Array(7).fill({ name: "", file: null }));
          break;
        default:
          setTracks([{ name: "", file: null }]);
          break;
      }
      setTrackError(null);
    }
  }, [collectionType]);

  return (
    <div className="create-new-music-page">
      <Sidebar
        setCurrentPage={(page: string) => {
          console.log("Set current page to:", page);
        }}
      />
      <div className="main">
        <Header />
        <div className="create-music-container">
          <h1>Create New Music</h1>
          <div className="upload-section">
            <label className="upload-main-image">
              <input type="file" onChange={handleMainImageChange} />
              {mainImagePreview ? (
                <img
                  src={mainImagePreview}
                  alt="Main"
                  className="main-image-preview"
                />
              ) : (
                <div className="upload-placeholder">
                  <FaCamera size={50} />
                  <p>Upload Collection Main Image</p>
                </div>
              )}
            </label>
          </div>
          <div className="form-section">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Collection Type</label>
              <select
                value={collectionType}
                onChange={(e) => setCollectionType(e.target.value)}
              >
                <option value="Album">Album</option>
                <option value="Single">Single</option>
                <option value="EP">EP</option>
              </select>
            </div>
            <div className="tracks-section">
              <label>Tracks</label>
              {tracks.map((track, index) => (
                <div key={index} className="track">
                  <input
                    type="text"
                    placeholder="Track Name"
                    value={track.name}
                    onChange={(e) =>
                      handleTrackNameChange(index, e.target.value)
                    }
                  />
                  <input
                    type="file"
                    accept=".mp3"
                    onChange={(e) => handleTrackFileChange(index, e)}
                    style={{ display: "none" }}
                    id={`track-file-${index}`}
                  />
                  <button
                    className="upload-mp3-button"
                    onClick={() =>
                      document.getElementById(`track-file-${index}`)?.click()
                    }
                  >
                    Upload MP3
                  </button>
                  <button
                    className="remove-track-button"
                    onClick={() => removeTrack(index)}
                  >
                    -
                  </button>
                </div>
              ))}

              <div className="track-actions">
                <button className="add-track-button" onClick={addTrack}>
                  Add Track
                </button>
              </div>
              {trackError && <div className="track-error">{trackError}</div>}
            </div>
            <div className="form-actions">
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="post-button" onClick={handleSubmit}>
                Post Music
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <MusicControl />
    </div>
  );
};

export default CreateNewMusicPage;
