import { useState, useEffect } from "react";
import "./SearchPage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Search from "../../components/Search/Search";
import FooterHome from "../../components/Footer/FooterHome";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Queue from "../../components/Queue/Queue";
import AlbumList from "../../components/AlbumList/AlbumList";

type Album = {
  album_id: string;
  album_image: string;
  album_name: string;
  album_year: number;
  collection_type: string;
};

function SearchPage() {
  const [currentPage, setCurrentPage] = useState("search");
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showQueue, setShowQueue] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<string>("");

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  useEffect(() => {
    if (query) {
      fetchAlbums(query);
    }
  }, [query]);

  const fetchAlbums = async (query: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/find_album_name?album_name=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch albums: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("API response data:", data); // Log the entire response

      if (data.data) {
        setAlbums(data.data);
        console.log("Albums set:", data.data);
      } else {
        setAlbums([]); // Set an empty array if no albums are found
        console.log("No albums found for query:", query);
      }
    } catch (error) {
      console.error("Failed to fetch albums", error);
      setAlbums([]); // Set an empty array on error
    }
  };

  useEffect(() => {
    console.log("Current Page:", currentPage);
  }, [currentPage]);

  useEffect(() => {
    console.log("Albums state:", albums);
  }, [albums]);

  useEffect(() => {
    console.log("Query state:", query);
  }, [query]);

  const handleTrackSelect = (trackSong: string) => {
    setSelectedTrack(trackSong);
  };

  return (
    <div className="search-page">
      {loading ? (
        <>
          <Skeleton
            containerClassName="sidebar-skeleton"
            height={600}
            width={200}
          />
          <div className="main">
            <Skeleton className="header-skeleton" height={50} width={"100%"} />
            <Skeleton
              className="album-list-skeleton"
              height={400}
              width={"100%"}
            />
            <Skeleton className="footer-skeleton" height={100} width={"100%"} />
          </div>
          <Skeleton
            className="music-control-skeleton"
            height={70}
            width={"100%"}
          />
        </>
      ) : (
        <>
          <Sidebar setCurrentPage={setCurrentPage} />
          <div className="main">
            {currentPage === "search" && (
              <Search setAlbums={setAlbums} setQuery={setQuery} />
            )}
            <AlbumList albums={albums} />
            <FooterHome />
          </div>
          <div className="music-control">
            <MusicControl
              toggleQueue={toggleQueue}
              selectedTrack={selectedTrack}
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

export default SearchPage;
