import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/upload">
            <li>Upload Images</li>
          </Link>
          <Link to="/search">
            <li>Search Faces</li>
          </Link>
        </ul>
      </nav>

      {/* Route Configuration */}
    </div>
  );
};

export default Home;
