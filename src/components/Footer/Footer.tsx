import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <Link to="/" className="footer-logo">
          <img src="./src/assets/spotify_logo.webp" alt="NJotify Logo" />
          NJotify
        </Link>
        <Link to="/Hukum" className="footer-link">
          Hukum
        </Link>
        <Link to="/pusat_keamanan_privasi" className="footer-link">
          Pusat Keamanan & Privasi
        </Link>
        <Link to="/kebijakan_privasi" className="footer-link">
          Kebajikan Privasi
        </Link>
        <Link to="/cookie" className="footer-link">
          Cookie
        </Link>
        <Link to="/tentang_iklan" className="footer-link">
          Tentang Iklan
        </Link>
        <Link to="/aksesibilitas" className="footer-link">
          Aksesibilitas
        </Link>
      </div>
      <div className="footer-right">
        <p>&#169; 2024 Spotify A8</p>
      </div>
    </footer>
  );
}

export default Footer;
