import React from "react";
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
  return (
    <div className="album-list">
      {albums.map((album) => (
        <div key={album.album_id} className="album-item">
          <img
            src={`data:image/jpeg;base64,${album.album_image}`}
            alt={album.album_name}
            className="album-image"
          />
          <div className="album-info">
            <div className="album-name">{album.album_name}</div>
            <div className="album-year">{album.album_year}</div>
            <div className="album-type">{album.collection_type}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlbumList;
