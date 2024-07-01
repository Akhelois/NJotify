import { useState, useRef, useEffect } from "react";
import "./MusicControl.css";

function MusicControl() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
      setCurrentTime(Number(event.target.value));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", onTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", onLoadedMetadata);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", onTimeUpdate);
          audioRef.current.removeEventListener(
            "loadedmetadata",
            onLoadedMetadata
          );
        }
      };
    }
  }, []);

  return (
    <div className="music-control">
      <div className="left-section">
        <img
          src="./src/assets/starboy.jpeg"
          alt="Album cover"
          className="album-cover"
        />
        <div className="track-info">
          <div className="track-name">Starboy</div>
          <div className="artist-name">The Weekend</div>
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
        <div className="time-info">
          <div className="time">{formatTime(currentTime)}</div>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={onSliderChange}
            className="progress-slider"
          />
          <div className="time">{formatTime(duration)}</div>
        </div>
      </div>
      <div className="right-section"></div>
      <audio ref={audioRef} src="./src/assets/song/Starboy.mp3"></audio>
    </div>
  );
}

export default MusicControl;
