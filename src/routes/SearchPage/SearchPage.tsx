import { useState, useEffect } from "react";
import "./SearchPage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Search from "../../components/Search/Search";
import FooterHome from "../../components/Footer/FooterHome";
// import AlbumList from "../../components/TrackList/TrackList";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Queue from "../../components/Queue/Queue";

type Album = {
  albumID: number;
  albumImage: string;
  albumName: string;
  albumYear: number;
  collectionType: string;
};

function SearchPage() {
  const [currentPage, setCurrentPage] = useState("search");
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showQueue, setShowQueue] = useState(false);

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch("http://localhost:8080/find_all_album");
      const data = await response.json();
      setAlbums(data.Data || []);
    } catch (error) {
      console.error("Failed to fetch albums", error);
    }
  };

  useEffect(() => {
    console.log("Current Page:", currentPage);
  }, [currentPage]);

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
            <Skeleton className="header-skeleton" height={50} width={`100%`} />
            <Skeleton
              className="album-list-skeleton"
              height={400}
              width={`100%`}
            />
            <Skeleton className="footer-skeleton" height={100} width={`100%`} />
          </div>
          <Skeleton
            className="music-control-skeleton"
            height={70}
            width={`100%`}
          />
        </>
      ) : (
        <>
          <Sidebar setCurrentPage={setCurrentPage} />
          <div className="main">
            {currentPage === "search" && <Search />}
            {/* <AlbumList albums={albums} /> */}
            <FooterHome />
          </div>
          <div className="music-control">
            <MusicControl toggleQueue={toggleQueue} />
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
