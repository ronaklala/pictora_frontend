import React, { useState } from "react";
import "../../styles/Search.css";
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

function Gallery({ images, menuItems, setFullScreenLoader, setIdx, idx }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [open, setOpen] = React.useState(false);

  const filterImagesByCategory = (images, categoryName) => {
    if (categoryName === "All") {
      return images; // Return all images if "All" is selected
    }
    return images.filter((image) => image.CategoryName === categoryName);
  };
  let filteredImages = filterImagesByCategory(images, selectedCategory);

  const handleDownload = async ({ slide }) => {
    setFullScreenLoader(true);
    const fileURL = slide.ImageURL.replace(
      "s3://rekognition3103/",
      "https://d1wfnbu1ueq29p.cloudfront.net/"
    );

    console.log(idx);

    try {
      const response = await fetch(fileURL);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Extract the filename from the URL
      const urlParts = fileURL.split("/");
      const originalFileName = urlParts[urlParts.length - 1]; // Get the last part of the URL

      const a = document.createElement("a");
      a.href = url;
      a.download = originalFileName; // Set the original filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Cleanup
      URL.revokeObjectURL(url);
      setFullScreenLoader(false);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download image.");
      setFullScreenLoader(false);
    }
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
          <>
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
          </>
        ))}
      </Masonry>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={filteredImages}
        index={idx}
        download={{
          download: handleDownload, // Custom download function
        }}
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
