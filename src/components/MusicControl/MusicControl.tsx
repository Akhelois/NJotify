import React, { useRef, useState, useEffect } from "react";
import { CiShuffle } from "react-icons/ci";
import {
  MdSkipPrevious,
  MdSkipNext,
  MdQueueMusic,
  MdSpeaker,
  MdOutlineCastConnected,
  MdOutlineZoomOutMap,
} from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";
import { FaVolumeOff, FaVolumeLow, FaVolumeHigh } from "react-icons/fa6";
import { TiArrowLoop } from "react-icons/ti";
import { AiOutlinePlaySquare } from "react-icons/ai";
import { TbMicrophone2 } from "react-icons/tb";
import { CgMiniPlayer } from "react-icons/cg";
import "./MusicControl.css";

interface MusicControlProps {
  toggleQueue: () => void;
}

const MusicControl: React.FC<MusicControlProps> = ({ toggleQueue }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [volumeIcon, setVolumeIcon] = useState(<FaVolumeLow />);
  const [albumImage, setAlbumImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbumImage("");
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (volume === 0) {
      setVolumeIcon(<FaVolumeOff />);
    } else if (volume > 0 && volume <= 0.5) {
      setVolumeIcon(<FaVolumeLow />);
    } else {
      setVolumeIcon(<FaVolumeHigh />);
    }
  }, [volume]);

  const fetchAlbumImage = async (albumID: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/find_album?album_id=${encodeURIComponent(albumID)}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch album image: ${response.statusText}`);
      }
      const data = await response.json();
      return data.albumImage;
    } catch (error) {
      console.error("Error fetching album image:", error);
      throw error;
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setCurrentTime(Number(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const progressFillWidth = duration ? (currentTime / duration) * 100 : 0;
  const volumeFillWidth = volume * 100;

  return (
    <div className="player">
      <audio
        ref={audioRef}
        src="./src/assets/song/Starboy.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleDurationChange}
      ></audio>

      {/* Left section */}
      <div className="hidden-lg flex-row left-section">
        {albumImage && <img className="w-12" src={albumImage} alt="Song" />}
        <div className="song-info">
          <p>SongName</p>
          <p>SongDescription</p>
        </div>
      </div>

      {/* Center section */}
      <div className="flex-col center-section">
        <div className="gap-4 flex-row controls">
          <CiShuffle className="control-icon" />
          <MdSkipPrevious className="control-icon" />
          {isPlaying ? (
            <FaPause className="control-icon" onClick={handlePlayPause} />
          ) : (
            <FaPlay className="control-icon" onClick={handlePlayPause} />
          )}
          <MdSkipNext className="control-icon" />
          <TiArrowLoop className="control-icon" />
        </div>
        <div className="gap-5 flex-row time-bar">
          <p>{formatTime(currentTime)}</p>
          <div className="progress-container">
            <input
              type="range"
              className="progress-bar"
              value={currentTime}
              max={duration}
              onChange={handleProgressChange}
              style={{
                background: `linear-gradient(to right, #1db954 ${progressFillWidth}%, #d1d5db ${progressFillWidth}%)`,
              }}
            />
          </div>
          <p>{formatTime(duration)}</p>
        </div>
      </div>

      {/* Right section */}
      <div className="hidden-lg flex-row right-section opacity-75">
        <div className="right-icons">
          <AiOutlinePlaySquare className="control-icon" />
          <TbMicrophone2 className="control-icon" />
          <MdQueueMusic className="control-icon" onClick={toggleQueue} />
          <MdSpeaker className="control-icon" />
          <div className="control-icon">{volumeIcon}</div>
          <MdOutlineCastConnected className="control-icon" />
        </div>
        <div className="volume-bar-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-bar"
            style={{
              background: `linear-gradient(to right, #1db954 ${volumeFillWidth}%, #d1d5db ${volumeFillWidth}%)`,
            }}
          />
        </div>
        <div className="right-icons">
          <CgMiniPlayer className="control-icon" />
          <MdOutlineZoomOutMap className="control-icon" />
        </div>
      </div>
    </div>
  );
};

export default MusicControl;
