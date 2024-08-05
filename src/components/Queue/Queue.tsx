import "./Queue.css";

function Queue() {
  return (
    <div className="queue-container">
      <h2 className="queue-title">Queue</h2>
      <div className="now-playing-section">
        <h3 className="section-title">Now Playing</h3>
        <div className="track">
          <img
            src="path/to/sparkle-movie-ver.jpg"
            alt="Sparkle - movie ver."
            className="album-cover"
          />
          <span className="track-name">Sparkle - movie ver.</span>
          <span className="artist-name">RADWIMPS</span>
        </div>
        <div className="track">
          <img
            src="path/to/dream-lantern.jpg"
            alt="Dream Lantern"
            className="album-cover"
          />
          <span className="track-name">Dream Lantern</span>
          <span className="artist-name">RADWIMPS</span>
        </div>
        <div className="track">
          <img
            src="path/to/yorushika.jpg"
            alt="だから僕は音楽を辞めた"
            className="album-cover"
          />
          <span className="track-name">だから僕は音楽を辞めた</span>
          <span className="artist-name">Yorushika</span>
        </div>
        <div className="track">
          <img
            src="path/to/fujii-kaze.jpg"
            alt="Shinunoga E-Wa"
            className="album-cover"
          />
          <span className="track-name">Shinunoga E-Wa</span>
          <span className="artist-name">Fujii Kaze</span>
        </div>
        <div className="track">
          <img
            src="path/to/sufjan-stevens.jpg"
            alt="Tears of Suzume"
            className="album-cover"
          />
          <span className="track-name">Tears of Suzume</span>
          <span className="artist-name">Sufjan Stevens</span>
        </div>
      </div>
    </div>
  );
}

export default Queue;
