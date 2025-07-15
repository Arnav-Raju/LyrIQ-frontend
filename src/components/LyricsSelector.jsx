import React, { useState } from 'react';
import axios from 'axios';
import useTypingEffect from '../hooks/useTypingEffect';


const LyricsSelector = ({ lyrics, darkMode }) => {
  const [selectedLines, setSelectedLines] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const typedExplanation = useTypingEffect(explanation, 18); // You can tweak speed if needed


  const handleSelect = (line) => {
    if (selectedLines.includes(line)) {
      setSelectedLines(selectedLines.filter(l => l !== line));
    } else if (selectedLines.length < 5) {
      setSelectedLines([...selectedLines, line]);
    }
  };

  const explainSelection = async () => {
    if (selectedLines.length === 0) return;

    setLoading(true);
    setExplanation('');

    try {
      const res = await axios.post('http://localhost:8000/explain-section', {
        lines: selectedLines
      });

      console.log('🧠 Explanation response:', res.data);

      // Defensive fallback in case .explanation is undefined
      setExplanation(res.data.explanation || 'No explanation returned.');
    } catch (err) {
      console.error('❌ Failed to fetch explanation:', err);
      setExplanation('Failed to explain the selected section.');
    } finally {
      setLoading(false);
    }
  };

  const selectedStyle = {
    backgroundColor: darkMode ? '#2c3e50' : '#d0ebff',
    color: '#000'
  };

  return (
    <div style={{ marginTop: '2rem' }}>
    <h3 style={{ color: '#000000' }}>
      Select Lines (max 5):
    </h3>
      <div style={{ whiteSpace: 'pre-wrap' }}>
        {lyrics.split('\n').map((line, idx) => (
          <div
            key={idx}
            onClick={() => handleSelect(line)}
            style={{
              cursor: 'pointer',
              backgroundColor: selectedLines.includes(line) ? selectedStyle.backgroundColor : 'transparent',
              color: selectedLines.includes(line) ? selectedStyle.color : '#000',
              padding: '0.5rem',
              borderRadius: '6px',
              marginBottom: '4px',
              border: '1px solid #ccc'
            }}
          >
            {line}
          </div>
        ))}
      </div>

      <button
        onClick={explainSelection}
        disabled={loading || selectedLines.length === 0}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: darkMode ? '#007acc' : '#007acc',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Explaining...' : 'Explain Selected'}
      </button>

      {explanation && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            color:'#000',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6'
          }}
        >
          <h4 style={{ marginBottom: '0.75rem' }}>Explanation:</h4>
          <p>{typedExplanation}</p>
        </div>
      )}
    </div>
  );
};

export default LyricsSelector;
