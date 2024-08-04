import React, { useEffect, useState } from "react";
import "./AlbumPage.css";
import SideBar from "../../components/Sidebar/Sidebar";
import MusicControl from "../../components/MusicControl/MusicControl";
import Header from "../../components/Header/Header";
import FooterHome from "../../components/Footer/FooterHome";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Album {
  albumID: string;
  userID: number;
  albumName: string;
  albumImage: string;
  albumYear: string;
  collectionType: string;
}

const AlbumPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("http://localhost:8080/find_all_album");
        const data = await response.json();
        setAlbums(data.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="album-page">
      <SideBar setCurrentPage={() => {}} />
      <div className="main">
        <Header />
        <div className="album-content">
          <header className="album-header">
            <h1>Albums</h1>
          </header>
          {loading ? (
            <section className="album-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="album-card" key={index}>
                  <Skeleton height={200} width={200} />
                  <div className="album-details">
                    <Skeleton height={20} width={150} />
                    <Skeleton height={15} width={100} />
                    <Skeleton height={15} width={100} />
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <section className="album-grid">
              {albums.map((album) => (
                <div className="album-card" key={album.albumID}>
                  <img
                    src={`data:image/jpeg;base64,${album.albumImage}`}
                    alt={album.albumName}
                  />
                  <div className="album-details">
                    <h3>{album.albumName}</h3>
                    <p>{album.albumYear}</p>
                    <p>{album.collectionType}</p>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
        <FooterHome />
      </div>
      <div className="music-control">
        <MusicControl />
      </div>
    </div>
  );
};

export default AlbumPage;
