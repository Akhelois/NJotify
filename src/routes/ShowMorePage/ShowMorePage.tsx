import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShowMorePage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Footer from "../../components/Footer/FooterHome";
import Header from "../../components/Header/Header";
import Queue from "../../components/Queue/Queue";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Album {
  album_id: string;
  album_name: string;
  album_image: string | null;
  album_year: string;
  collection_type: string;
}

function ShowMorePage() {
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
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`http://localhost:8080/find_all_album`);
        if (!response.ok) {
          throw new Error("Failed to fetch albums");
        }
        const data = await response.json();
        setAlbums(data.data || []);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album_page/${albumId}`);
  };

  return (
    <div className="show-more-page">
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
            <div className="album-list">
              <h2>All Albums</h2>
              <div className="albums">
                {albums.map((album) => (
                  <div
                    key={album.album_id}
                    className="album"
                    onClick={() => handleAlbumClick(album.album_id)}
                  >
                    <img
                      src={`data:image/jpeg;base64,${album.album_image}`}
                      alt={album.album_name}
                      className="album-image"
                    />
                    <div className="album-details">
                      <h3>{album.album_name}</h3>
                      <p>
                        {album.album_year} - {album.collection_type}
                      </p>
                    </div>
                  </div>
                ))}
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

export default ShowMorePage;
