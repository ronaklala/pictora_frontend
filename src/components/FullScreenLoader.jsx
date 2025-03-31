import React from "react";
import "../styles/loader.css";
import { ClipLoader } from "react-spinners";

const FullScreenLoader = () => {
  return (
    <div className="full-screen-loader">
      <ClipLoader size={100} color="#fff" />

      <p>Please Wait Your Image is downloading......</p>
    </div>
  );
};

export default FullScreenLoader;
