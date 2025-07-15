import React, { useEffect, useState } from 'react';

const ArtworkBackground = ({ artwork }) => {
  const [loaded, setLoaded] = useState(false);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY * 0.3); // Parallax factor
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!artwork) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none', // Prevent blocking interactions
      }}
    >
      <img
        src={artwork}
        onLoad={() => setLoaded(true)}
        alt="Background artwork"
        style={{
          width: '100%',
          height: '120%', // Slightly taller for parallax movement
          objectFit: 'cover',
          transform: `translateY(${offsetY}px)`, // Move image with scroll
          transition: loaded ? 'opacity 0.5s ease-in-out' : 'none',
          opacity: loaded ? 1 : 0,
          filter: 'blur(08px) brightness(0.85)',
        }}
      />
    </div>
  );
};

export default ArtworkBackground;
