import React, { useState, useEffect } from 'react';
import LyricsSelector from './components/LyricsSelector';
import ArtworkBackground from './components/ArtworkBackground';
import FloatingInput from './components/FloatingInput';
import MediaIcons from './components/MediaIcons';
import './App.css';
import useDominantColor from './hooks/useDominantColor';
import invertColor from './utils/invertColor';
import EmotionMeter from './components/EmotionMeter';
import AppButton from './components/AppButton';
import SongSummaryCard from './components/SongSummaryCard';
import ChordsGenerator from './components/ChordsGenerator';
import ArtistInfoPanel from './components/ArtistInfoPanel'; 



function App() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [explanation, setExplanation] = useState('');
  const [url, setUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [artwork, setArtwork] = useState('');
  const dominantColor = useDominantColor(artwork);
  const invertedColor = invertColor(dominantColor);
  const [emotions, setEmotions] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showSummaryCard, setShowSummaryCard] = useState(false);
  const [showArtistInfo, setShowArtistInfo] = useState(false);
  const [chordsVisible, setChordsVisible] = useState(false);

  const handleExplain = async () => {
    if (!title || !artist) {
      setError('Please enter both song title and artist.');
      return;
    }

    setLoading(true);
    setError('');
    setLyrics('');
    setExplanation('');
    setUrl('');
    setPreviewUrl('');
    setArtwork('');
    

    try {
      const res = await fetch('http://localhost:8000/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist })
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setLyrics(data.lyrics);
        setExplanation(data.explanation);
        setUrl(data.url);
        setPreviewUrl(data.previewUrl);
         // ✅ Set artwork if it's available in the response
        if (data.artwork) {
          setArtwork(data.artwork);
        }
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dominantColor) {
      document.documentElement.style.setProperty('--accent-color', dominantColor);
    }
  }, [dominantColor]);
  
  
  // Helper to format explanation text into spaced paragraphs
  const formatExplanation = (text) => {
    // Split by headings like "Theme:", "Tone:", etc.
    const sections = text.split(/\n?(?=[A-Z][^\n]{3,40}:)/g);
  
    return sections.map((section, index) => {
      const [rawTitle, ...bodyParts] = section.split(/:(.+)/s);
      const title = rawTitle?.trim();
      let body = bodyParts.join('').trim();
  
      // Clean up body: remove lines that are just "-"
      body = body
        .split('\n')
        .filter(line => line.trim() && line.trim() !== '-') // remove empty lines and lone dashes
        .join('\n')
        .trim();
  
      // Skip sections that are empty or only dashes
      if (!title || !body) return null;
  
      return (
        <div key={index} style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#333', fontSize: '1.1rem' }}>
            {title}
          </h4>
          <p style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap', marginLeft: '1rem' }}>
            {body}
          </p>
        </div>
      );
    });
  };
  

  return (
    <div
        style={{
          padding: '2rem',
          fontFamily: 'Arial, sans-serif',
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          color: '#e0e0e0',
          minHeight: '100vh',
          transition: 'background-color 0.3s ease, color 0.3s ease'
        }}
      >
      <ArtworkBackground artwork={artwork} /> {/* <-- Background layer */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
      <h1
        className="app-title"
        style={{
          '--dominant-color': dominantColor || '#00bfff',
        }}
      >
        LyrIQ
      </h1>

      {/* <button 
        onClick={() => setDarkMode(!darkMode)} 
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.4rem 1rem',
          background: darkMode ? '#eee' : '#333',
          color: darkMode ? '#111' : '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button> */}

<div
  style={{
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: '1rem',
    flexWrap: 'wrap',         // Optional: wraps inputs if window is too narrow
    marginBottom: '2rem'
  }}
>
  <FloatingInput
    label="Song Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    width="250px"
  />
  <FloatingInput
    label="Artist Name"
    value={artist}
    onChange={(e) => setArtist(e.target.value)}
    width="250px"
  />

  <AppButton onClick={handleExplain} disabled={loading} loading={loading}>
  Explain
  </AppButton>
  {lyrics && (
  <>
    <EmotionMeter
      selectedText={lyrics}
      darkMode={false}
      onEmotionResult={(result) => setEmotions(result)}
    />
    
  </>
)}
 


<AppButton
  onClick={() => setShowSummaryCard(prev => !prev)}
  disabled={!explanation || !title || !artist}
>
  {showSummaryCard ? 'Hide Summary' : 'Show Summary'}
</AppButton>

<AppButton
  onClick={() => setShowArtistInfo(true)}
  disabled={!artist}
>
  More About the Artist
</AppButton>

{showSummaryCard && (
  <SongSummaryCard
    summary={{
      title,
      artist,
      artwork,
      emotions,
      explanation
    }}
  />
)}

{showArtistInfo && (
  <ArtistInfoPanel
    artistName={artist}
    onClose={() => setShowArtistInfo(false)}
  />
)}

</div>
{error && <p style={{ color: 'red' }}>{error}</p>}
{!loading && lyrics && (
  <div style={{ marginTop: '2rem' }}>
    <LyricsSelector lyrics={lyrics} />
    
    <div
      className="explanation-box"
      style={{ color: invertedColor }}
    >
      <h3>Explanation:</h3>
      <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginTop: '1rem' }}>
        {explanation}
      </p>
    </div>

    <MediaIcons
      previewUrl={previewUrl}
      geniusUrl={url}
      chordsVisible={chordsVisible}
      onToggleChords={() => setChordsVisible(prev => !prev)}
    />

    {chordsVisible && (
      <div style={{ marginTop: '1rem' }}>
        <ChordsGenerator title={title} artist={artist} lyrics={lyrics} />
      </div>
    )}
  </div>
)}
    </div>
    </div>
    
  );

}

export default App;

