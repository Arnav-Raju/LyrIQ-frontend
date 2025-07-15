import React, { useState } from 'react';
import { Music } from 'lucide-react';
import { FaGuitar } from 'react-icons/fa';

const GeniusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fffc00" width="20" height="20">
    <path d="M290.74 32C167.93 32 96.08 112.9 96.08 226.88c0 55.42 18.15 101.12 54.49 132.45 12.42 10.9 22.87 8.39 25.3-5.94l7.59-43.8c1.71-10.12-1.25-17.38-8.95-22.77-20.91-14.55-31.37-37.6-31.37-69.46 0-59.69 41.77-106.62 109.81-106.62 59.9 0 97.87 38.82 97.87 92.64 0 42.93-20.74 75.7-54.06 87.74-10.44 3.85-14.55 10.12-13.29 19.34l7.59 56.64c.9 6.77 6.44 10.56 13.93 7.93 82.4-28.92 128.65-102.67 128.65-188.66C415.84 100.94 365.4 32 290.74 32z"/>
  </svg>
);

const MediaIcons = ({ previewUrl, geniusUrl, onToggleChords, chordsVisible }) => {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* Preview Icon */}
        {previewUrl && (
          <div
            onClick={() => setShowPlayer(prev => !prev)}
            title="Toggle Preview"
            style={iconStyle}
          >
            <Music size={20} />
          </div>
        )}

        {/* Genius Icon */}
        {geniusUrl && (
          <a href={geniusUrl} target="_blank" rel="noopener noreferrer" title="View on Genius">
            <div style={iconStyle}>
              <GeniusIcon />
            </div>
          </a>
        )}

        {/* Chords Icon */}
        <div
          onClick={onToggleChords}
          title={chordsVisible ? 'Hide Chords' : 'Show Chords'}
          style={{
            ...iconStyle,
            color: chordsVisible ? '#1db954' : '#007acc', // Green when active
            transform: chordsVisible ? 'scale(1.05)' : 'scale(1.0)',
          }}
        >
          <FaGuitar size={20} />
        </div>
      </div>

      {/* Audio Player */}
      {showPlayer && previewUrl && (
        <div style={{ marginTop: '1rem', width: '100%' }}>
          <audio controls preload="none" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}>
            <source src={previewUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

// Shared style for icons
const iconStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  backgroundColor: '#ffffffcc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, color 0.2s ease'
};

export default MediaIcons;
