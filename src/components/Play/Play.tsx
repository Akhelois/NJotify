import "./Play.css";

function Play() {
  return (
    <div className="right-bar">
      <h2>Now Playing</h2>
      <div className="now-playing">
        <img src="path_to_image" alt="Album Art" />
        <div className="track-info">
          <h3>Sparkle - movie ver.</h3>
          <p>RADWIMPS</p>
        </div>
      </div>
    </div>
  );
}

export default Play;
