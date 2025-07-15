// src/components/LineByLine.jsx
import React from 'react';
import LineExplainer from './LineExplainer';

const LineByLine = ({ lyrics }) => {
  const lines = lyrics.split('\n').filter(line => line.trim().length > 0);

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Line-by-Line Explorer (Click a Line)</h3>
      {lines.map((line, idx) => (
        <LineExplainer key={idx} line={line} />
      ))}
    </div>
  );
};

export default LineByLine;
