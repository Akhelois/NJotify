import "./Playlist.css";
import { FaPlay } from "react-icons/fa";

function Playlist() {
  return (
    <div className="playlist">
      <h2>Popular Album</h2>
      <div className="card">
        <div className="item">
          <img src="./src/assets/starboy.jpeg" alt="item" />
          <div className="play-btn">
            <span className="icon">
              <FaPlay />
            </span>
          </div>
          <h4>Albums</h4>
          <p>List Song name</p>
        </div>
      </div>
      <h2>Popular Radio</h2>
      <div className="card">
        <div className="item">
          <img src="./src/assets/starboy.jpeg" alt="item" />
          <div className="play-btn">
            <span className="icon">
              <FaPlay />
            </span>
          </div>
          <h4>Albums</h4>
          <p>List Song name</p>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
