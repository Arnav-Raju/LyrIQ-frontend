import React, { useState, useEffect } from 'react';
import './ArtistInfoPanel.css';

const ArtistInfoPanel = ({ artistName, onClose }) => {
  const [artistInfo, setArtistInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/artist-info?artist_name=${encodeURIComponent(artistName)}`)
      .then(res => res.json())
      .then(data => {
        setArtistInfo(data);
        setLoading(false);
      })
      if (artistInfo?.error) {
        return (
          <div className="artist-info-modal">
            <div className="artist-info-content">
              <button className="close-button" onClick={onClose}>×</button>
              <p>Sorry, couldn't load artist information.</p>
            </div>
          </div>
        );
      }
  }, [artistName]);

  if (loading) {
    return (
      <div className="artist-info-modal">
        <div className="artist-info-content">
          <p>Loading artist info...</p>
        </div>
      </div>
    );
  }

  if (!artistInfo || !artistInfo.name) return null;
    const { name, bio, topSongs, popularAlbum, images } = artistInfo;


  return (
    <div className="artist-info-modal">
      <div className="artist-info-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>About the Artist</h2>
        <h3>{name}</h3>
        <p className="bio">
          {bio.startsWith("Read more at Genius:") ? (
            <a href={bio.replace("Read more at Genius: ", "")} target="_blank" rel="noopener noreferrer">
              Read full bio on Genius →
            </a>
          ) : (
            bio
          )}
        </p>

        <hr />

        <h4>🔥 Top Songs</h4>
        <ul className="top-songs-list">
          {topSongs.map((song, index) => (
            <li key={index}>
              <a href={song.external_url} target="_blank" rel="noopener noreferrer">
                🎵 {song.name}
              </a>
              {song.preview_url && (
                <audio controls src={song.preview_url} className="preview-audio" />
              )}
            </li>
          ))}
        </ul>

        <hr />

        {popularAlbum && (
          <>
            <h4>💿 Most Popular Album</h4>
            <div className="album-info">
              <img src={popularAlbum.cover} alt="Album Cover" />
              <div>
                <p>
                  <strong>
                    <a href={popularAlbum.spotify_url} target="_blank" rel="noopener noreferrer">
                      {popularAlbum.title}
                    </a>
                  </strong> ({popularAlbum.year})
                </p>
                <p>Genre: {popularAlbum.genre}</p>
              </div>
            </div>
            <hr />
          </>
        )}

        <h4>🖼️ Gallery</h4>
        <div className="artist-gallery-scroll">
          {images.map((url, idx) => (
            <img key={idx} src={url} alt={`Artist ${idx + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistInfoPanel;
