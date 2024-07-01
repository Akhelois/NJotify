import "./Libary.css";
import { IoLibrary } from "react-icons/io5";
import Privacy from "../Privacy/Privacy";

function Libary() {
  return (
    <div className="sidebar-nav v2">
      <ul>
        <li>
          <a href="">
            <span className="icon">
              <IoLibrary />
            </span>
            <span className="libary">Your Libary</span>
          </a>
        </li>
        <li>
          <div className="sidebar-scroll">
            <div className="create-playlist">
              <h4>Create Your First Playlist</h4>
              <p>EASYYY</p>
              <button>Create Playlist</button>
            </div>
            <div className="create-playlist">
              <h4>Create Your First Playlist</h4>
              <p>EASYYY</p>
              <button>Create Playlist</button>
            </div>
          </div>
        </li>
      </ul>
      <Privacy />
    </div>
  );
}

export default Libary;
