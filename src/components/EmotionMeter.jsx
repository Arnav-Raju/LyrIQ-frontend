import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import AppButton from './AppButton';

const emotionColors = {
  Joy: '#FFD700',
  Sadness: '#1E90FF',
  Anger: '#FF6347',
  Fear: '#8A2BE2',
  Gratitude: '#00C853',
  Guilt: '#A52A2A',
  Longing: '#FF69B4',
  Confusion: '#808080',
  Desperation: '#5D4037',
  Frustration: '#E64A19',
  Spirituality: '#7B1FA2',
  Paranoia: '#4E342E'
};

const EmotionMeter = ({ selectedText, darkMode, onEmotionResult }) => {
  const [emotions, setEmotions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState('0px');

  const handleClick = async () => {
    if (emotions) {
      setExpanded(!expanded);
    } else {
      if (!selectedText) return;
      setLoading(true);
      try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/emotion-meter`, {
          lyrics: selectedText
        });
        
        const emotionData = JSON.parse(res.data.emotions); // ensure stringified JSON
        setEmotions(emotionData);
        setExpanded(true);
        if (onEmotionResult) {
          onEmotionResult(emotionData);
        }
      } catch (err) {
        console.error('Emotion analysis failed:', err);
        setEmotions(null);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (expanded && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight('0px');
    }
  }, [expanded, emotions]);

  return (
    <div style={{ marginTop: '2rem' }}>
      <AppButton
        onClick={handleClick}
        disabled={loading || !selectedText}
        loading={loading}
      >
        {emotions ? (expanded ? 'Hide Emotions' : 'Show Emotions') : 'Analyze Emotions'}
      </AppButton>

      <div
        ref={contentRef}
        style={{
          maxHeight: height,
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
        }}
      >
        {emotions && Object.entries(emotions).map(([emotion, percent]) => (
          <div key={emotion} style={{ marginBottom: '12px' }}>
            <h2> </h2>
            <strong>{emotion}</strong>
            <div
              style={{
                height: '12px',
                width: '100%',
                backgroundColor: '#ddd',
                borderRadius: '6px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  backgroundColor: emotionColors[emotion] || '#007acc',
                  height: '100%',
                  transition: 'width 0.5s'
                }}
              />
            </div>
            <span style={{ fontSize: '0.85rem' }}>{percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmotionMeter;
