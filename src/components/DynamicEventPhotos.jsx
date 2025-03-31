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
import FullScreenLoader from "./FullScreenLoader";

const DynamicEventPhotos = () => {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState();
  const [fetchDataLoader, setFetchDataLoader] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [fullScreenLoader, setFullScreenLoader] = useState(false);

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

              const formattedData = res.data.data
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
                .filter((item) => !existingUrls.has(item.WebPImageURL)); // Remove duplicates

              // Merge new images with previous results and sort alphabetically by 'src'
              const sortedResult = [...prevResult, ...formattedData].sort(
                (a, b) => a.src.localeCompare(b.src)
              );

              return sortedResult;
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
    setFullScreenLoader(true);

    const currentImage = result.find((img) => img.ImageURL === slide.ImageURL);
    if (!currentImage) {
      alert("Error finding image to download.");
      setFullScreenLoader(false);
      return;
    }

    const fileURL = currentImage.ImageURL.replace(
      "s3://rekognition3103/",
      "https://d1wfnbu1ueq29p.cloudfront.net/"
    );

    try {
      const response = await fetch(fileURL);
      let blob = await response.blob();

      // Remove metadata by redrawing the image on a canvas
      const removeMetadata = async (blob) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = function (event) {
            const img = new Image();
            img.onload = function () {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              canvas.toBlob(resolve, "image/jpeg", 1.0);
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(blob);
        });
      };

      blob = await removeMetadata(blob); // Remove metadata

      // Create a new file with today's timestamp
      const fileName = `image_${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: "image/jpeg" });

      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      // Ensure share is called inside a direct user gesture
      const shareFile = async () => {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Download Image",
            text: "Save this image to your gallery",
          });
          alert("Image saved successfully!");
        } else {
          downloadFile(blob, fileName);
        }
      };

      // If iOS, open in a new tab (as iOS does not allow programmatic downloads)
      if (isIOS) {
        const newBlobURL = URL.createObjectURL(blob);
        window.open(newBlobURL, "_blank");
        alert("Long press the image and choose 'Save to Photos'.");
      } else {
        // Call inside a click event
        document.getElementById("downloadButton").onclick = () => {
          shareFile();
        };
        document.getElementById("downloadButton").click();
      }

      setFullScreenLoader(false);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download image.");
      setFullScreenLoader(false);
    }
  };

  // Function to handle fallback download
  const downloadFile = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add a hidden button for triggering share inside user gesture
  document.body.innerHTML += `<button id="downloadButton" style="display: none;"></button>`;

  return (
    <div className="container">
      {fullScreenLoader ? <FullScreenLoader /> : <></>}
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
                <br />
                <p>Total Photos Found: {result.length}</p>
                <br /> <br />
                <Masonry columns={{ 640: 2, 768: 2, 1024: 3, 1280: 3 }} gap={1}>
                  {result.map((item, i) => (
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
