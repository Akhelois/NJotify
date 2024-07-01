import "./HomePage.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import Library from "../../components/Libary/Libary";
import Play from "../../components/Play/Play";
import MusicControl from "../../components/MusicControl/MusicControl";

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <div className="content">
        <Sidebar />
        <div className="main">
          <Library />
          <Play />
        </div>
      </div>
      <MusicControl />
    </div>
  );
};

export default HomePage;
