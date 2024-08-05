import { useState } from "react";
import "./TrackPage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Navbar from "../../components/Header/Header";
import FooterHome from "../../components/Footer/FooterHome";
import Queue from "../../components/Queue/Queue";
// import Search from "../../components/Search/Search";

function TrackPage() {
  const [currentPage, setCurrentPage] = useState("home");
  const [showQueue, setShowQueue] = useState(false);
  const [selectedTrack] = useState<string>("");

  const toggleQueue = () => {
    setShowQueue(!showQueue);
  };

  return (
    <div className={`track-page ${showQueue ? "shrink" : ""}`}>
      <Sidebar setCurrentPage={setCurrentPage} />
      <div className="main">
        {currentPage === "home" && <Navbar />}
        <div className="track-content">
          <div className="track-header">
            <div className="track-cover">
              <img
                src="path-to-your-image"
                alt="Track Cover"
                className="track-image"
              />
            </div>
            <div className="track-info">
              <h1 className="track-title">Goddess</h1>
              <p className="track-artist">Laufey</p>
              <p className="track-year">2024 • 4:27 • 24,206,114</p>
            </div>
          </div>
          <div className="popular-tracks">
            <h2>Popular Tracks by Laufey</h2>
            <ul>
              <li>
                <span>1. From The Start</span>
                <span>334,298,104</span>
                <span>2:49</span>
              </li>
              <li>
                <span>2. Falling Behind</span>
                <span>155,427,844</span>
                <span>2:53</span>
              </li>
              <li>
                <span>3. Valentine</span>
                <span>165,098,897</span>
                <span>2:48</span>
              </li>
              <li>
                <span>4. Promise</span>
                <span>104,266,106</span>
                <span>3:54</span>
              </li>
              <li>
                <span>5. Let You Break My Heart Again</span>
                <span>171,503,453</span>
                <span>4:29</span>
              </li>
            </ul>
          </div>
        </div>
        <FooterHome />
      </div>
      <div className="music-control">
        <MusicControl toggleQueue={toggleQueue} selectedTrack={selectedTrack} />
      </div>
      {showQueue && (
        <div className="queue-container">
          <Queue />
        </div>
      )}
    </div>
  );
}

export default TrackPage;
