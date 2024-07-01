import "./Header.css";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";

function Header() {
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
        <button>
          <span>
            <img src="./src/assets/profile.png" alt="profile" />
          </span>
        </button>
      </div>
    </div>
  );
}

export default Header;
