import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img src="./src/assets/spotify_logo.webp" alt="NJotify Logo" />
          NJotify
        </Link>
      </div>
      {/* <div className="navbar-right">
        <Link to="/" className="navbar-link">
          Login
        </Link>
        <Link to="/register" className="navbar-link">
          Register
        </Link>
      </div> */}
    </nav>
  );
}

export default Navbar;
