// src/components/FloatingInput.jsx
import React from 'react';
import './FloatingInput.css';

const FloatingInput = ({ label, value, onChange }) => {
  return (
    <div className="floating-input-container">
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`floating-input ${value ? 'has-value' : ''}`}
        required
      />
      <label className="floating-label">{label}</label>
    </div>
  );
};

export default FloatingInput;
