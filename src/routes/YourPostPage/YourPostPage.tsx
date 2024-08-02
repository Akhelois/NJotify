import React, { useEffect, useState } from "react";
import "./YourPostPage.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Footer from "../../components/Footer/FooterHome";
import Header from "../../components/Header/Header";
import fallbackImage from "../../assets/profile.png";

function YourPostPage() {
  const [username, setUsername] = useState<string>("");
  const [profilePicURL, setProfilePicURL] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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

        if (data.data) {
          setUsername(data.data.username || "Unknown");

          if (
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
        }

        // const postsResponse = await fetch(
        //   `http://localhost:8080/get_posts?email=${encodeURIComponent(email)}`
        // );
        // if (!postsResponse.ok) {
        //   throw new Error("Failed to fetch posts");
        // }
        // const postsData = await postsResponse.json();
        // setPosts(postsData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProfilePicURL(fallbackImage);
      }
    };

    fetchData();
  }, []);

  const isValidBase64 = (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.currentTarget as HTMLImageElement;
    if (target.src !== fallbackImage) {
      target.src = fallbackImage;
    }
  };

  return (
    <div className="your-post-page">
      <Sidebar
        setCurrentPage={function (page: string): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className="main">
        <div className="header-banner">
          <Header />
          <div className="banner">
            <img
              src={profilePicURL || fallbackImage}
              alt="Profile"
              className="banner-image"
              onError={handleImageError}
            />
            <div className="banner-text">
              <h1>Hi, {username}</h1>
            </div>
          </div>
        </div>
        <div className="profile-content">
          <div className="discography">
            <h2>Discography</h2>
            <div className="posts">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="post">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="post-image"
                    />
                    <h2>{post.title}</h2>
                    <p>{post.description}</p>
                  </div>
                ))
              ) : (
                <p>No posts available</p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <div className="music-control">
        <MusicControl />
      </div>
    </div>
  );
}

export default YourPostPage;
