import React from "react";
import "./Sidebar.css";
import { AiFillHome } from "react-icons/ai";
import { IoSearchSharp } from "react-icons/io5";
import Libary from "../Libary/Libary";

interface SidebarProps {
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentPage }) => {
  return (
    <div className="sidebar">
      {/* Navbar atas */}
      <div className="sidebar-nav">
        <ul>
          <li>
            <a href="#" onClick={() => setCurrentPage("home")}>
              <span className="icon">
                <AiFillHome />
              </span>
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setCurrentPage("search")}>
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
};

export default Sidebar;
