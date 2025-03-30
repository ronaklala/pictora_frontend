import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Search.css";
import { ScaleLoader, SyncLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "yet-another-react-lightbox/styles.css";
import Masonry from "react-layout-masonry";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Download } from "yet-another-react-lightbox/plugins";

function Gallery({ images, menuItems }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchDataLoader, setFetchDataLoader] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const filterImagesByCategory = (images, categoryName) => {
    if (categoryName === "All") {
      return images; // Return all images if "All" is selected
    }
    return images.filter((image) => image.CategoryName === categoryName);
  };
  let filteredImages = filterImagesByCategory(images, selectedCategory);

  const handleDownload = ({ slide, saveAs }) => {
    const file = slide.ImageURL.replace(
      "s3://rekognition3103/",
      "https://d1wfnbu1ueq29p.cloudfront.net/"
    );
    const a = document.createElement("a");
    a.href = file;
    a.download = file; // Suggested filename for the download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="gallery-grid">
      <center>
        <h1>Find Your Face Matching Images Below</h1>
        <h4>Please Select a particular Event if you want to view</h4>
        <select
          className="input"
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option selected value="All">
            All
          </option>
          {menuItems.map((m, index) => (
            <option key={index} value={m}>
              {m}
            </option>
          ))}
        </select>
        <br />
        <br />
      </center>

      <Masonry columns={{ 640: 2, 768: 2, 1024: 3, 1280: 3 }} gap={1}>
        {filteredImages.map((item, i) => (
          <LazyLoadImage
            effect="blur"
            wrapperProps={{
              // If you need to, you can tweak the effect transition using the wrapper style.
              style: { transitionDelay: "1s" },
            }}
            src={item.LowResImageURL.replace(
              "s3://rekognition3103/",
              "https://d1wfnbu1ueq29p.cloudfront.net/"
            )}
            style={{ width: "100%" }}
            onClick={() => {
              setOpen(true);
              setIdx(i);
            }}
          />
        ))}
      </Masonry>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={filteredImages.map((item) => ({
          ...item,
          src: item.WebPImageURL.replace(
            "s3://rekognition3103/",
            "https://d1wfnbu1ueq29p.cloudfront.net/"
          ),
        }))}
        download={{
          download: handleDownload, // Custom download function
        }}
        index={idx}
        plugins={[
          Captions,
          Fullscreen,
          Slideshow,
          Thumbnails,
          Video,
          Zoom,
          Download,
        ]}
      />
    </div>
  );
}

export default Gallery;
