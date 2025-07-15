import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(title, artist);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Artist (optional)"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <button type="submit">Explain</button>
    </form>
  );
}

export default SearchBar;
