// src/hooks/useDominantColor.js
import { useEffect, useState } from 'react';
import { FastAverageColor } from 'fast-average-color'; // ✅ CORRECT


const useDominantColor = (imgUrl) => {
  const [color, setColor] = useState('#007acc');

  useEffect(() => {
    if (!imgUrl) return;

    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgUrl;

    img.onload = () => {
      const result = fac.getColor(img);
      setColor(result.hex);
    };

    img.onerror = () => {
      console.warn('Failed to load image for color extraction');
    };
  }, [imgUrl]);

  return color;
};

export default useDominantColor;
