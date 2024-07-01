import "./HomePage.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Playlist from "../../components/Playlist/Playlist";
import FooterHome from "../../components/Footer/FooterHome";

const HomePage = () => {
  return (
    <div className="home-page">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="content-wrapper">
          <Playlist />
          <FooterHome />
        </div>
      </div>
      {/* <MusicControl /> */}
    </div>
  );
};

export default HomePage;
