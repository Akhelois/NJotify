import "./Header.css";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="header">
      <div className="prev-btn">
        <button>
          <div className="icon">
            <GoChevronLeft />
          </div>
        </button>
        <button>
          <div className="icon">
            <GoChevronRight />
          </div>
        </button>
      </div>

      <div className="profile">
        <button onClick={toggleDropdown}>
          <span>
            <img src="./src/assets/profile.png" alt="profile" />
          </span>
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/profile_page" className="dropdown-item">
              View Profile
            </Link>
            <Link to="/edit_profile" className="dropdown-item">
              Edit Profile
            </Link>
            <Link to="/" className="dropdown-item">
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
