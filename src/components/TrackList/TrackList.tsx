import React from "react";
import "./TrackList.css";

type Track = {
  track_id: string;
  album_id: string;
  track_name: string;
  track_song: string;
};

type TrackListProps = {
  tracks: Track[];
};

const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  return (
    <div className="track-list">
      {tracks.map((track) => (
        <div key={track.track_id} className="track">
          <div className="track-info">
            <h3>{track.track_name}</h3>
            <audio controls>
              <source
                src={`data:audio/mpeg;base64,${track.track_song}`}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
