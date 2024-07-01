import { useState, useRef } from "react";
import "./MusicControl.css";

const MusicControl = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="music-control">
      <div className="left-section">
        <img src="album_cover_url" alt="Album cover" className="album-cover" />
        <div className="track-info">
          <div className="track-name">Every Breath You Take</div>
          <div className="artist-name">The Police</div>
        </div>
      </div>
      <div className="center-section">
        <button onClick={togglePlayPause} className="play-pause-button">
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="pause-icon">
              <path d="M14 19H18V5H14V19ZM6 19H10V5H6V19Z"></path>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="play-icon">
              <path d="M8 5V19L19 12L8 5Z"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="right-section">
        <audio ref={audioRef} src="song_url"></audio>
      </div>
    </div>
  );
};

export default MusicControl;
