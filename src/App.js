import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Upload from "./components/Upload";
import Search from "./components/Search";
import Home from "./components/Home";
import DynamicEventPhotos from "./components/DynamicEventPhotos";
import GalleryItem from "./components/Gallery/GalleryItem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/search/:searchTerm" element={<DynamicEventPhotos />} />
        <Route path="/gallery" element={<GalleryItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
