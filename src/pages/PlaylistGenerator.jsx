import React, { useState } from 'react';
import AppButton from '../components/AppButton';

const PlaylistGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setPlaylist([]);

    try {
      const res = await fetch('http://localhost:8000/generate-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPlaylist(data.tracks || []);
      }
    } catch (err) {
      setError('Failed to fetch playlist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🎧 AI Playlist Generator</h2>
      <p>Example: <em>“Give me a chill playlist like ‘After Dark’ by Mr. Kitty”</em></p>

      <textarea
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your playlist vibe..."
        style={{
          width: '100%',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          fontSize: '1rem',
        }}
      />

      <AppButton onClick={handleGenerate} disabled={loading || !prompt}>
        {loading ? 'Generating...' : 'Generate Playlist'}
      </AppButton>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      <div style={{ marginTop: '2rem' }}>
        {playlist.map((track, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '10px',
              background: '#f4f4f4',
              color: '#111',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <strong>{track.title}</strong> by <em>{track.artist}</em>
            {track.youtubeUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                <iframe
                  width="100%"
                  height="80"
                  src={`https://www.youtube.com/embed/${track.youtubeUrl.split('v=')[1]}`}
                  title={`Track: ${track.title}`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistGenerator;
