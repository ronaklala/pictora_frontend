import axios from "axios";
import React, { useEffect, useState } from "react";
import Masonry from "react-layout-masonry";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function GalleryItem() {
  const [fetchDataLoader, setFetchDataLoader] = useState(true);
  const [result, setResult] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API + "fetch_category_wise_data/Bhaiya")
      .then((res) => {
        setResult(res.data);
        setFetchDataLoader(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Masonry columns={{ 640: 1, 768: 2, 1024: 3, 1280: 4 }} gap={1}>
      {result.map((item) => (
        <LazyLoadImage
          effect="blur"
          wrapperProps={{
            // If you need to, you can tweak the effect transition using the wrapper style.
            style: { transitionDelay: "1s" },
          }}
          src={item.LowResImageURL.replace(
            "s3://rekognition3103/",
            "https://rekognition3103.s3.us-east-2.amazonaws.com/"
          )}
          style={{ width: "100%" }}
        />
      ))}
    </Masonry>
  );
}

export default GalleryItem;
