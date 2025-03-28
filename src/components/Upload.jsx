import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import "../styles/Upload.css";

const Upload = () => {
  const [images, setImages] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [uploadStatus, setUploadStatus] = useState([]); // Track upload status for each image
  const [currentUploadingIndex, setCurrentUploadingIndex] = useState(null); // Track which image is currently uploading

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
    setUploadStatus(new Array(e.target.files.length).fill("Pending")); // Reset upload status
    setCurrentUploadingIndex(null); // Reset current uploading index
  };

  const handleCategoryChange = (e) => {
    setCategoryName(e.target.value);
  };

  const uploadImage = async (image, index) => {
    const formData = new FormData();
    formData.append("images", image);
    formData.append("category_name", categoryName);

    try {
      // Set the current index to show as uploading
      setCurrentUploadingIndex(index);
      setUploadStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[index] = "Uploading"; // Update status to uploading
        return newStatus;
      });

      const response = await axios.post(
        "http://18.118.143.69:5000/upload",
        formData
      );

      if (response.status === 200) {
        setUploadStatus((prevStatus) => {
          const newStatus = [...prevStatus];
          newStatus[index] = "Uploaded"; // Mark as uploaded after successful response
          return newStatus;
        });
      }

      console.log(uploadStatus);
    } catch (error) {
      console.error(`Error uploading ${image.name}:`, error);
      setUploadStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[index] = "Failed"; // Mark as failed if there's an error.
        return newStatus;
      });
    }
  };

  const handleUploadAllImages = async () => {
    for (let i = 0; i < images.length; i++) {
      await uploadImage(images[i], i); // Upload each image sequentially.
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fff",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ color: "#000" }}>Image Upload</h2>

      <input type="file" multiple onChange={handleImageChange} />
      <input
        type="text"
        placeholder="Enter category name"
        value={categoryName}
        onChange={handleCategoryChange}
        style={{
          display: "block",
          marginBottom: "10px",
          width: "100%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleUploadAllImages}
        style={{
          backgroundColor: "#2d89b1",
          color: "#fff",
          padding: "10px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Start Uploading Images
      </button>

      <div style={{ marginTop: "20px" }}>
        {images.map((image, index) => (
          <div key={index} style={{ marginBottom: "10px", color: "#000" }}>
            {image.name}:{" "}
            {uploadStatus[index] === "Uploading" ? (
              <>
                <ClipLoader size={20} color="#6d71e3" />
              </>
            ) : (
              <>
                {uploadStatus[index] === "Uploaded" ? (
                  <>✅</>
                ) : (
                  <>
                    {uploadStatus[index] === "failed" ? (
                      <>❌</>
                    ) : (
                      <>Pending...</>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upload;
