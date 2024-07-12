// import React from "react";
import "./ProfilePage.css";

function ProfilePage() {
  return (
    <div className="profile-page">
      <header className="profile-header">
        <img
          src="./src/assets/profile.png"
          alt="profile"
          className="profile-pic"
        />
        <h1>{/*Nama*/}</h1>
      </header>
      <section className="public-playlists">
        <h2>Public Playlists</h2>
        <div className="playlist-grid">{/* Add playlist items here */}</div>
      </section>
      <section className="follow-info">
        <div className="following">
          <h2>Following</h2>
          {/* Add following items here */}
        </div>
        <div className="followers">
          <h2>Followers</h2>
          {/* Add followers items here */}
        </div>
        <div className="mutual-following">
          <h2>Mutual Following</h2>
          {/* Add mutual following items here */}
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
