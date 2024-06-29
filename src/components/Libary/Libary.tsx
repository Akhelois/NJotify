import "./Libary.css";

function Library() {
  return (
    <div className="main-content">
      <h1>Recent Searches</h1>
      <div className="search-items">
        <div className="search-item">Radwimps</div>
        <div className="search-item">Surprisingly found in Discover Weekly</div>
        <div className="search-item">Super Real Me</div>
        <div className="search-item">Mood Booster</div>
      </div>
      <h1>Explore your genres</h1>
      <div className="genres">
        <div className="genre-item">Genre 1</div>
        <div className="genre-item">Genre 2</div>
        <div className="genre-item">Genre 3</div>
        <div className="genre-item">Genre 4</div>
      </div>
    </div>
  );
}

export default Library;
