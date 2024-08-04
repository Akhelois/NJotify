import React from "react";
import "./AlbumList.css";

type Album = {
  albumID: number;
  albumImage: string;
  albumName: string;
  albumYear: number;
  collectionType: string;
};

type AlbumListProps = {
  albums: Album[];
};

const AlbumList: React.FC<AlbumListProps> = ({ albums }) => {
  return (
    <div className="album-list">
      {albums.map((album) => (
        <div key={album.albumID} className="album">
          <img src={album.albumImage} alt={album.albumName} />
          <div className="album-info">
            <h3>{album.albumName}</h3>
            <p>{album.albumYear}</p>
            <p>{album.collectionType}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlbumList;
