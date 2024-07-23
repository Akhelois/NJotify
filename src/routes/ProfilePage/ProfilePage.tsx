import { useEffect, useState } from "react";
import "./ProfilePage.css";

function ProfilePage() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/find", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Fetched User Data:", result);

        if (result.data && result.data.length > 0) {
          const user = result.data.find(
            (userData: any) => userData.email === localStorage.getItem("email")
          );
          if (user && user.username) {
            setUsername(user.username);
          } else {
            console.warn("User object does not contain a username field", user);
            setUsername("-");
          }
        } else {
          console.warn("Result data is empty or not an array", result.data);
        }
      } catch (error) {
        console.error("There was an error fetching the user data!", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="profile-page">
      <header className="profile-header">
        <img
          src="./src/assets/profile.png"
          alt="profile"
          className="profile-pic"
        />
        <h1>{username || "-"}</h1>{" "}
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
