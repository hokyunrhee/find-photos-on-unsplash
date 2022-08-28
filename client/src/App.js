import "./App.css";
import { useState } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const getImages = async (query) => {
  const resp = await fetch(`${BASE_URL}?query=${query}`);

  return resp.json();
};

function App() {
  const [images, setImages] = useState([]);

  const search = async (event) => {
    event.preventDefault();
    const query = event.target.query.value;
    const results = await getImages(query);
    setImages(results);
    event.target.query.value = "";
  };

  return (
    <div className="App">
      <form className="form" onSubmit={search}>
        <input id="query" type="text" name="query" placeholder="Search query" />
        <button type="submit">Search</button>
      </form>

      {images.map((image) => (
        <a key={image.id} href={image.link} target="_blank" rel="noreferrer">
          <img src={image.image} alt="" />
        </a>
      ))}
    </div>
  );
}

export default App;
