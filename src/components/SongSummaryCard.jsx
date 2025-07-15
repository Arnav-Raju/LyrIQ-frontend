import React, { useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import download from 'downloadjs';

const SongSummaryCard = ({ summary }) => {
  const frontRef = useRef();
  const [flipped, setFlipped] = useState(false);

  if (!summary) return null;

  const { title, artist, artwork, emotions = {}, explanation = '' } = summary;

// Sort and slice top 4 emotions
const emotionEntries = Object.entries(emotions)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4)
  .map(([name, val]) => [name.slice(0, 3).toUpperCase(), val, name]);

// Auto-calculate score from top 4 emotions
const score =
  emotionEntries.length > 0
    ? Math.round(
        emotionEntries.reduce((sum, [, val]) => sum + val, 0) / emotionEntries.length
      )
    : 0;


  const topEmotionAbbr = emotionEntries.length > 0 ? emotionEntries[0][0] : 'N/A';

  const highestStat = emotionEntries.length > 0 ? Math.max(...emotionEntries.map(([, val]) => val)) : 0;

  let rarity = 'Bronze';
  if (highestStat >= 80) rarity = 'Legendary';
  else if (highestStat >= 70) rarity = 'Gold';
  else if (highestStat >= 60) rarity = 'Silver';

  const borderColor = {
    Gold: '#f1c40f',
    Silver: '#bdc3c7',
    Bronze: '#cd7f32',
  }[rarity];

  const downloadAsImage = () => {
    if (!frontRef.current) return;
    toJpeg(frontRef.current, { quality: 0.95 })
      .then((dataUrl) => {
        download(dataUrl, `${title || 'song'}-card.jpg`);
      })
      .catch((err) => {
        console.error('Download failed:', err);
      });
  };

  const baseCardStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '20px',
    color: '#fff',
    backfaceVisibility: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '1rem',
        overflow: 'auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ width: '400px', height: '550px', position: 'relative' }}>
        <div
          className="card-container"
          style={{
            width: '100%',
            height: '100%',
            perspective: '1000px',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => setFlipped(!flipped)}
        >
          <div
            className="card-inner"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transition: 'transform 0.8s',
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* FRONT */}
            <div
              ref={frontRef}
              style={{
                ...baseCardStyle,
                background:
                  rarity === 'Legendary'
                    ? 'linear-gradient(135deg, #111, #444)'
                    : `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${artwork}) center/cover no-repeat`,
                imageRendering: 'pixelated',
                border: rarity === 'Legendary' ? '3px solid transparent' : `3px solid ${borderColor}`,
              }}
            >
              {/* OVR Score */}
              <div
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  textShadow: '2px 2px 4px #000',
                }}
              >
                {score}
              </div>

              {/* Top Right Emotion */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontWeight: 'bold',
                }}
              >
                {topEmotionAbbr}
              </div>

              {/* Title + Artist */}
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ marginBottom: '0.25rem', fontSize: '1.4rem' }}>{title}</h2>
                <h4 style={{ margin: 0, color: '#ccc', fontWeight: 'normal' }}>{artist}</h4>
              </div>

              {/* Emotion Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  marginTop: '0.8rem',
                }}
              >
                {emotionEntries.map(([abbr, val]) => (
                  <div
                    key={abbr}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      padding: '0.4rem 0.6rem',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px #000',
                      color: '#fff',
                    }}
                  >
                    {abbr} {val}%
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Tap to flip →</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadAsImage();
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ffcc00',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    border: 'none',
                    borderRadius: '10px',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    zIndex: 5,
                  }}
                >
                  Download
                </button>
              </div>
            </div>

            {/* BACK */}
            <div
              style={{
                ...baseCardStyle,
                backgroundColor: '#111',
                border: rarity === 'Legendary' ? '3px solid transparent' : `3px solid ${borderColor}`,
                transform: 'rotateY(180deg)',
              }}
            >
              <div
                style={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  fontSize: '0.85rem',
                  padding: '0.5rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                }}
              >
                <strong>Explanation</strong>
                <p style={{ marginTop: '0.5rem' }}>{explanation}</p>

                <hr style={{ margin: '1rem 0', borderColor: '#444' }} />

                <strong>Emotion Key:</strong>
                <ul style={{ paddingLeft: '1.2rem' }}>
                  {emotionEntries.map(([abbr, , full]) => (
                    <li key={abbr}>
                      <strong>{abbr}</strong>: {full}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  fontSize: '0.65rem',
                  opacity: 0.7,
                  textAlign: 'center',
                  marginTop: '0.5rem',
                }}
              >
                ← Tap to flip back
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongSummaryCard;
