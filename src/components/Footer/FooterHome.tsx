import "./FooterHome.css";
import { CiInstagram } from "react-icons/ci";
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

const FooterHome = () => {
  return (
    <div className="footer-section">
      <div className="footer">
        <div className="footer-links">
          <div className="footer-column">
            <div>Company</div>
            <ul className="col-links">
              <li><a href="#">About</a></li>
              <li><a href="#">Jobs</a></li>
              <li><a href="#">For the Record</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <div>Communities</div>
            <ul className="col-links">
              <li><a href="#">For Artists</a></li>
              <li><a href="#">Developers</a></li>
              <li><a href="#">Advertising</a></li>
              <li><a href="#">Investors</a></li>
              <li><a href="#">Vendors</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <div>Useful links</div>
            <ul className="col-links">
              <li><a href="#">Support</a></li>
              <li><a href="#">Free Mobile App</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <div>Njotify Plans</div>
            <ul className="col-links">
              <li><a href="#">Premium Individual</a></li>
              <li><a href="#">Premium Duo</a></li>
              <li><a href="#">Premium Family</a></li>
              <li><a href="#">Premium Student</a></li>
              <li><a href="#">Njotify Free</a></li>
            </ul>
          </div>
        </div>
        <div className="social-links">
          <a href="#"><CiInstagram className="icon" /></a>
          <a href="#"><FaTwitter className="icon" /></a>
          <a href="#"><FaFacebook className="icon" /></a>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-links">
            <a href="#">Legal</a>
            <a href="#">Safety & Privacy Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookies</a>
            <a href="#">About Ads</a>
            <a href="#">Accessibility</a>
          </div>
          <div className="footer-bottom-copy">© 2024 Njotify AB</div>
        </div>
      </div>
    </div>
  );
};

export default FooterHome;
