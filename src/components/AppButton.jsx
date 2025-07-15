// src/components/AppButton.jsx
import React from 'react';

const AppButton = ({ onClick, disabled, loading, children, className = '', style = {} }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: disabled ? '#aaa' : '#007acc',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        minWidth: '140px',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {loading ? 'Generating...' : children}
      {/* {loading ? <div className="app-loader" /> : children} */}

    </button>
  );
};

export default AppButton;
