import "./MusicControl.css";

function MusicControl() {
  return (
    <div className="music-controls">
      <div className="track-details">
        <img src="path_to_image" alt="Album Art" className="track-image" />
        <div className="track-info">
          <h3>Sparkle - movie ver.</h3>
          <p>RADWIMPS</p>
        </div>
      </div>
      <div className="controls">
        <button className="control-btn">Previous</button>
        <button className="control-btn">Play</button>
        <button className="control-btn">Next</button>
      </div>
      <div className="progress-bar">
        <span>0:00</span>
        <input type="range" min="0" max="100" value="0" className="slider" />
        <span>3:45</span>
      </div>
    </div>
  );
}

export default MusicControl;
