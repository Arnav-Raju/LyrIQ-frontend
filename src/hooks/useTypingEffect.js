// src/hooks/useTypingEffect.js
import { useEffect, useState } from 'react';

const useTypingEffect = (text, speed = 20) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;

    const interval = setInterval(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      currentIndex++;

      if (currentIndex >= text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
};

export default useTypingEffect;
