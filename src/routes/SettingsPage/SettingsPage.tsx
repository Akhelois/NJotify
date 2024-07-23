// import React from "react";
import "./SettingsPage.css";

function SettingsPage() {
  return (
    <div className="settings-container">
      <div className="premium-banner">
        <img
          src="./src/assets/premium.jpg"
          alt="Premium"
          className="premium-image"
        />
        <div className="premium-info">
          <h2>Rp 54,990 untuk 3 bulan Premium</h2>
          <p>
            Nikmati musik bebas iklan, playback offline, dan banyak lagi.
            Batalkan kapan saja.
            <br />
            Rp 54.990 selama 3 bulan, lalu Rp 54.990 per bulan sesudahnya.
            Tawaran hanya berlaku kalau kamu belum pernah mencoba Premium.
            <a href="/terms"> Persyaratan berlaku.</a>
            <br />
            Tawaran berakhir 21 Mei 2024.
          </p>
          <button className="premium-button">
            Dapatkan Premium Individual
          </button>
        </div>
      </div>

      <div className="account-section">
        <h3>Akun</h3>
        <ul>
          <li>
            <button className="menu-button">
              <span>Order History</span>
            </button>
          </li>
          <li>
            <button className="menu-button">
              <span>Edit Profile</span>
            </button>
          </li>
          <li>
            <button className="menu-button">
              <span>Get Verified</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="security-section">
        <h3>Keamanan dan privasi</h3>
        <ul>
          <li>
            <button className="menu-button">
              <span>Change Password</span>
            </button>
          </li>
          <li>
            <button className="menu-button">
              <span>Notification Settings</span>
            </button>
          </li>
          <li>
            <button className="menu-button">
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SettingsPage;
