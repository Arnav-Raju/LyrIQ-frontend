// src/components/LineExplainer.jsx
import React, { useState } from 'react';
import axios from 'axios';

const LineExplainer = ({ line, darkMode }) => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const textColor = darkMode ? '#ddd' : '#000';
  const bgColor = darkMode ? '#1e1e1e' : '#f9f9f9';
  const hoverBg = darkMode ? '#2c2c2c' : '#f0f8ff';
  const explanationColor = darkMode ? '#aaa' : '#444';

  const handleClick = async () => {
    if (loading || !line.trim()) return;

    setClicked(true);
    setExpanded(!expanded);

    if (!explanation && !loading) {
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:8000/explain-line', { line });
        setExplanation(res.data.explanation);
      } catch (err) {
        setExplanation('Failed to explain line.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        marginBottom: clicked ? '1rem' : '0.5rem',
        cursor: 'pointer',
        backgroundColor: bgColor,
        color: textColor,
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        transition: 'background-color 0.2s',
        borderLeft: expanded ? '4px solid #007acc' : '4px solid transparent'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
    >
      <strong style={{ color: textColor }}>{line}</strong>
      <div
        style={{
          maxHeight: expanded ? '500px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
          marginTop: expanded ? '0.75rem' : '0',
          color: explanationColor,
          fontSize: '0.95rem'
        }}
      >
        {loading ? 'Explaining...' : explanation}
      </div>
    </div>
  );
};

export default LineExplainer;
