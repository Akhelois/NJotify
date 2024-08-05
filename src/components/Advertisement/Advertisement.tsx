import React from "react";
import "./Advertisement.css";

const Advertisement: React.FC = () => {
  return (
    <div className="advertisement">
      <div className="advertisement-header">
        Your music will continue after the break
        <button className="close-button">×</button>
      </div>
      <div className="advertisement-content">
        <div className="premium-ad">
          <h2 className="premium-title">Premium</h2>
          <p className="premium-description">
            Nikmati pengalaman mendengarkan yang lebih seru. Putar jutaan lagu
            tanpa mendengarkan iklan audio di Premium.
          </p>
          <button className="upgrade-button">UPGRADE KE PREMIUM</button>
        </div>
        <div className="advertisement-footer">
          <p>Spotify</p>
          <span>Advertisement</span>
          <button className="learn-more-button">Learn More</button>
        </div>
      </div>
    </div>
  );
};

export default Advertisement;
