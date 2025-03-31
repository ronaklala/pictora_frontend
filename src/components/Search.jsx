import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Search.css";
import Gallery from "./Gallery/Gallery";
import { ScaleLoader } from "react-spinners";
import Header from "./shared/Header";

const Search = () => {
  const [image, setImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(""); // State to store file name
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    axios
      .get("https://pictora-ai-api.vercel.app/fetch-all-data")
      .then((res) => {
        setMenuItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setSelectedFileName(file.name); // Set the selected file name
    } else {
      setSelectedFileName(""); // Reset if no file selected
    }
  };

  const handleSearch = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/search",
        formData
      );
      setResult(response.data.MatchedImages);
      setImagesLoaded(true);
    } catch (error) {
      alert(error.response?.data?.Message || "Error occurred while searching.");
      setResult([]);
    } finally {
      setLoading(false);
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
          <center>
            <ScaleLoader color="#2d89b1" />
            <p>Having Patience is better.........</p>
          </center>
        ) : (
          <>
            <section className="menu">
              <a href="/" className="active">
                <span>My Photos</span>
              </a>
              {menuItems.map((m, i) => (
                <>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  <a key={i} href={`/search/${m}`} className="ml-4">
                    <span>{m}</span>
                  </a>
                </>
              ))}
            </section>
            <div className="content">
              <div className="form">
                <h3>
                  Please upload your solo image or selfie to view all pictures
                  where you were present.
                </h3>
                <p>Please Note Image size should be less than 3Mb.</p>
                <br />
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* Display selected file name */}
                {selectedFileName && (
                  <p className="mt-2 text-sm text-gray-700 text-center">
                    Your Image has been selected
                  </p>
                )}

                <button onClick={handleSearch} className="search-button">
                  Search
                </button>
              </div>

              {!loading && imagesLoaded && (
                <Gallery images={result} menuItems={menuItems} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
