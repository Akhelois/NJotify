import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { AiFillHome } from "react-icons/ai";
import { IoSearchSharp } from "react-icons/io5";
import { IoMusicalNotes } from "react-icons/io5";
import Library from "../Libary/Libary";

interface SidebarProps {
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentPage }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isArtist = user?.data?.role === "Artist";
  const location = useLocation();
  const [activePage, setActivePage] = useState(location.pathname);

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  const handlePageChange = (page: string, path: string) => {
    console.log(`Changing page to: ${page}`);
    setCurrentPage(page);
    setActivePage(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-nav">
        <ul>
          <li>
            <Link
              to="/home"
              onClick={() => handlePageChange("home", "/home")}
              className={activePage === "/home" ? "active" : ""}
            >
              <span className="icon">
                <AiFillHome />
              </span>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/search_page"
              onClick={() => handlePageChange("search", "/search_page")}
              className={activePage === "/search_page" ? "active" : ""}
            >
              <span className="icon">
                <IoSearchSharp />
              </span>
              <span>Search</span>
            </Link>
          </li>
          {isArtist && (
            <li>
              <Link
                to="/your_post"
                onClick={() => handlePageChange("artist", "/your_post")}
                className={activePage === "/your_post" ? "active" : ""}
              >
                <span className="icon">
                  <IoMusicalNotes />
                </span>
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
