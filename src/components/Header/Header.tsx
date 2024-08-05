import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import fallbackImage from "../../assets/profile.png";
import { useCookies } from "react-cookie";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePicURL, setProfilePicURL] = useState<string | null>(null);
  const [cookies] = useCookies(["Authorization"]);
  const navigate = useNavigate();

  const handleLogout = () => {
    cookies.Authorization("Authorization", { path: "/", domain: "localhost" });

    navigate("/");
  };

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) {
          console.error("User not found in localStorage");
          return;
        }

        const userObj = JSON.parse(user);
        const email = userObj.data.email;

        const response = await fetch(
          `http://localhost:8080/find_user?email=${encodeURIComponent(email)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();

        if (
          data.data &&
          data.data.profile_picture &&
          typeof data.data.profile_picture === "string" &&
          isValidBase64(data.data.profile_picture)
        ) {
          setProfilePicURL(
            `data:image/jpeg;base64,${data.data.profile_picture}`
          );
        } else {
          setProfilePicURL(fallbackImage);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePicURL(fallbackImage);
      }
    };

    fetchProfilePic();
  }, []);

  const isValidBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleUndo = () => {
    navigate(-1); // Undo
  };

  const handleRedo = () => {
    navigate(1); // Redo
  };

  return (
    <div className="header">
      <div className="prev-btn">
        <button onClick={handleUndo}>
          <div className="icon">
            <GoChevronLeft />
          </div>
        </button>
        <button onClick={handleRedo}>
          <div className="icon">
            <GoChevronRight />
          </div>
        </button>
      </div>

      <div className="profile">
        <button onClick={toggleDropdown}>
          <span>
            <img src={profilePicURL || fallbackImage} alt="profile" />
          </span>
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/profile_page" className="dropdown-item">
              View Profile
            </Link>
            <Link to="/settings" className="dropdown-item" target="_blank">
              Account
            </Link>
            <Link className="dropdown-item" onClick={handleLogout}>
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
