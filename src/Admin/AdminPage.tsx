import React from "react";
import "./AdminPage.css";

interface Artist {
  name: string;
  followers: number;
  following: number;
  avatarUrl: string;
}

const artists: Artist[] = [
  {
    name: "test",
    followers: 1000,
    following: 25,
    avatarUrl: "Test.jpg",
  },
];

const AdminPage: React.FC = () => {
  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <h2>Verify Artist</h2>
      <div className="artist-list">
        {artists.map((artist, index) => (
          <div className="artist-item" key={index}>
            <img
              src={artist.avatarUrl}
              alt={`${artist.name}'s avatar`}
              className="artist-avatar"
            />
            <div className="artist-info">
              <h3>{artist.name}</h3>
              <p>
                {artist.followers} Follower - {artist.following} Following
              </p>
            </div>
            <div className="actions">
              <button className="reject-button">✖️</button>
              <button className="approve-button">✔️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
