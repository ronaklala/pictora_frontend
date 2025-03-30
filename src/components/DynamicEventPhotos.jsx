import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Search.css";
import { ScaleLoader, SyncLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "yet-another-react-lightbox/styles.css";
import Masonry from "react-layout-masonry";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Header from "./shared/Header";
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

const DynamicEventPhotos = () => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState();
  const [fetchDataLoader, setFetchDataLoader] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [idx, setIdx] = React.useState(0);

  const params = useParams();

  useEffect(() => {
    axios
      .get("https://pictora-ai-api.vercel.app/fetch-all-data")
      .then((res) => {
        setMenuItems(res.data);
        console.log("yes");
        setLoading(false);
        setFetchDataLoader(true);

        axios
          .get(
            "https://pictora-ai-api.vercel.app/fetch_category_wise_data/" +
              params.searchTerm
          )
          .then((res) => {
            setResult((prevResult) => {
              const existingUrls = new Set(
                prevResult.map((item) => item.WebPImageURL)
              );

              const formattedData = res.data
                .map((item) => ({
                  ...item,
                  src: item.WebPImageURL.replace(
                    "s3://rekognition3103/",
                    "https://d1wfnbu1ueq29p.cloudfront.net/"
                  ),
                  download: item.WebPImageURL.replace(
                    "s3://rekognition3103/",
                    "https://d1wfnbu1ueq29p.cloudfront.net/"
                  ),
                }))
                .filter((item) => !existingUrls.has(item.WebPImageURL)); // Filter out duplicates

              return [...prevResult, ...formattedData]; // Update state with new unique images
            });

            setFetchDataLoader(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDownload = async ({ slide }) => {
    const fileURL = slide.ImageURL.replace(
      "s3://rekognition3103/",
      "https://d1wfnbu1ueq29p.cloudfront.net/"
    );

    try {
      const response = await fetch(fileURL);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "image.jpg"; // Default filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download image.");
    }
  };

  return (
    <div className="container">
      <Header />

      <div className="search_section">
        <h2>Welcome to RishTa's Wedding Pictures</h2>
        <br />
        <hr />

        {loading ? (
          <>
            <center>
              <ScaleLoader color="#2d89b1" />
              <p>Having Patience is better.........</p>
            </center>
          </>
        ) : (
          <>
            <section className="menu">
              {" "}
              <a href="/">
                <span>My Photos</span>
              </a>
              {menuItems.map((m, i) => (
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {params.searchTerm === m ? (
                    <a href={"/search/" + m} className="active">
                      <span>{m}</span>
                    </a>
                  ) : (
                    <a href={"/search/" + m}>
                      <span>{m}</span>
                    </a>
                  )}
                </>
              ))}
            </section>
            {fetchDataLoader ? (
              <>
                <br /> <br /> <br />
                <center>
                  <SyncLoader color="#2d89b1" />
                  <p>Loading Photos........</p>
                </center>
              </>
            ) : (
              <>
                <br /> <br />
                <Masonry columns={{ 640: 2, 768: 2, 1024: 3, 1280: 3 }} gap={1}>
                  {result.map((item, i) => (
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
                      download={item.LowResImageURL.replace(
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
                  slides={result}
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicEventPhotos;
