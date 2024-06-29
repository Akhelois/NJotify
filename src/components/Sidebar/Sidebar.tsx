import "./Sidebar.css";
import { GoHomeFill } from "react-icons/go";

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <div className="sidebar-item">
            <GoHomeFill />
            <h2>Home</h2>
          </div>
        </li>
        <li>
          <div className="sidebar-item">
            <GoHomeFill />
            <h2>Your Library</h2>
          </div>
        </li>
      </ul>
      <ul>
        <li>Playlists</li>
        <li>Podcasts & Shows</li>
        <li>Albums</li>
        <li>Artists</li>
        <li>Liked Songs</li>
      </ul>
    </div>
  );
}

export default Sidebar;
