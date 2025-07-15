import React from "react";

function LyricsDisplay({ lyrics }) {
  const lines = lyrics.split("\n");

  return (
    <div className="lyrics-box">
      <h3>📜 Lyrics</h3>
      {lines.map((line, idx) => (
        <p key={idx} className="lyric-line">
          {line}
        </p>
      ))}
    </div>
  );
}

export default LyricsDisplay;
