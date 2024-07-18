import { useState } from "react";
import "./HomePage.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Playlist from "../../components/Playlist/Playlist";
import FooterHome from "../../components/Footer/FooterHome";
import SearchHeader from "../../components/Search/Search";

function HomePage() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="home-page">
      <Sidebar setCurrentPage={setCurrentPage} />
      <div className="main">
        {currentPage === "home" ? <Header /> : <SearchHeader />}
        <Playlist />
        <FooterHome />
      </div>
      <div className="music-control">
        <MusicControl />
      </div>
    </div>
  );
}

export default HomePage;
