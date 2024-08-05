import React from "react";
import { useNavigate } from "react-router-dom";
import "./AlbumList.css";

type Album = {
  album_id: string;
  album_image: string;
  album_name: string;
  album_year: number;
  collection_type: string;
};

type AlbumListProps = {
  albums: Album[];
};

const AlbumList: React.FC<AlbumListProps> = ({ albums }) => {
  const navigate = useNavigate();

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album_page/${albumId}`);
  };

  if (albums.length === 0) {
    return <div className="no-albums">No found</div>;
  }

  return (
    <div className="albums">
      {albums.map((album) => (
        <div
          key={album.album_id}
          className="album"
          onClick={() => handleAlbumClick(album.album_id)}
        >
          <img
            src={`data:image/jpeg;base64,${album.album_image}`}
            alt={album.album_name}
            className="album-image"
          />
          <div className="album-details">
            <h3>{album.album_name}</h3>
            <p>
              {album.album_year} - {album.collection_type}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlbumList;
