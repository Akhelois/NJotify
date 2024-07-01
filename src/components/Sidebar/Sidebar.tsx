import "./Sidebar.css";
import { AiFillHome } from "react-icons/ai";
import { IoSearchSharp } from "react-icons/io5";
import Libary from "../Libary/Libary";

function SideBar() {
  return (
    <div className="sidebar">
      {/* Navbar atas */}
      <div className="sidebar-nav">
        <div className="logo">
          <a href="">
            <span>
              <img src="./src/assets/spotify_logo.webp" alt="logo" />
            </span>
          </a>
        </div>

        <ul>
          <li>
            <a href="">
              <span className="icon">
                <AiFillHome />
              </span>
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="">
              <span className="icon">
                <IoSearchSharp />
              </span>
              <span>Search</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Navbar Bawahnya */}
      <Libary />
    </div>
  );
}

export default SideBar;
