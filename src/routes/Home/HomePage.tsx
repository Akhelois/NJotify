import { useState, useEffect } from "react";
import "./HomePage.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Playlist from "../../components/Playlist/Playlist";
import FooterHome from "../../components/Footer/FooterHome";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Queue from "../../components/Queue/Queue";

function HomePage() {
  const [currentPage, setCurrentPage] = useState("home");
  const [loading, setLoading] = useState(true);
  const [showQueue, setShowQueue] = useState(false);

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate a loading delay
  }, []);

  return (
    <div className="home-page">
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
              className="playlist-skeleton"
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
            {currentPage === "home" && <Header />}
            <Playlist />
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

export default HomePage;
