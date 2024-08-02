import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { AiFillHome } from "react-icons/ai";
import { IoSearchSharp } from "react-icons/io5";
import Library from "../Libary/Libary";

interface SidebarProps {
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentPage }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isArtist = user?.data?.role === "artist";
  return (
    <div className="sidebar">
      <div className="sidebar-nav">
        <ul>
          <li>
            <Link to="/home" onClick={() => setCurrentPage("home")}>
              <span className="icon">
                <AiFillHome />
              </span>
              <span>Home</span>
            </Link>
          </li>
          <li>
            {/* <Link to="/search" onClick={() => setCurrentPage("search")}>
              <span className="icon">
                <IoSearchSharp />
              </span>
              <span>Search</span>
            </Link> */}
            <a href="#" onClick={() => setCurrentPage("search")}>
              <span className="icon">
                <IoSearchSharp />
              </span>
              <span>Search</span>
            </a>
          </li>
          {isArtist && (
            <li>
              <Link to="/your_music" onClick={() => setCurrentPage("artist")}>
                Your Music
              </Link>
            </li>
          )}
        </ul>
      </div>
      <Library />
    </div>
  );
};

export default Sidebar;
