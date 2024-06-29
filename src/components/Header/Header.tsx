import "./Header.css";

function Header() {
  return (
    <div className="top-nav">
      <input type="text" placeholder="Search" className="search-bar" />
      <a href={"/"} className="logout">
        Log Out
      </a>
    </div>
  );
}

export default Header;
