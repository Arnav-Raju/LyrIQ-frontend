import React, { useState, useEffect, useRef } from 'react';
import AppButton from './AppButton';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ChordsGenerator = ({ title, artist, lyrics }) => {
  const [loading, setLoading] = useState(false);
  const [chords, setChords] = useState('');
  const [error, setError] = useState('');
  const chordRef = useRef();

  const getFallbackLinks = (title, artist) => {
    const query = encodeURIComponent(`${title} ${artist}`.toLowerCase());
    const slug = encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'));
    return {
      yousician: `https://yousician.com/chords/${slug}/fallback`,
      ultimateGuitar: `https://www.ultimate-guitar.com/search.php?search_type=title&value=${query}`,
      chordify: `https://chordify.net/search/${query}`
    };
  };

  const fallbackLinks = getFallbackLinks(title, artist);

  const fetchChordsIfNeeded = async () => {
    if (chords || loading) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/generate-chords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, artist, lyrics })
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setChords(data.chords);
        setTimeout(() => {
          chordRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
    } catch (err) {
      setError('Failed to generate chords.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChordsIfNeeded();
  }, []);

  const exportAsPNG = async () => {
    if (!chordRef.current) return;
    const canvas = await html2canvas(chordRef.current);
    const link = document.createElement('a');
    link.download = `${title}-chords.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportAsPDF = async () => {
    if (!chordRef.current) return;
    const canvas = await html2canvas(chordRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${title}-chords.pdf`);
  };

  const formatChords = (raw) => {
    const lines = raw.split("\n");
    const result = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const isChordLine = /^[A-G][#b]?(m|dim|aug|sus[24])?[0-9]?(\/[A-G][#b]?)?$/.test(line.split(" ")[0]);

      if (isChordLine && i + 1 < lines.length) {
        result.push(
          <div key={i} style={{ marginBottom: "1rem" }}>
            <div style={{ fontWeight: "bold", fontFamily: "monospace" }}>{lines[i]}</div>
            <div>{lines[i + 1]}</div>
          </div>
        );
        i++; // Skip next line (already paired)
      } else {
        result.push(<div key={i}>{lines[i]}</div>);
      }
    }

    return result;
  };

  return (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      {loading && <p>Loading chords...</p>}

      {chords && (
        <>
          <div
            ref={chordRef}
            style={{
              marginTop: '1rem',
              textAlign: 'left',
              fontFamily: 'monospace',
              background: 'rgba(255,255,255,0.5)',
              padding: '1rem',
              borderRadius: '8px',
              lineHeight: '1.6'
            }}
          >
            {formatChords(chords)}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <AppButton onClick={exportAsPNG}>Export PNG</AppButton>
            <AppButton onClick={exportAsPDF}>Export PDF</AppButton>
          </div>
        </>
      )}

      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <p>{error}</p>
          <p>Try one of the fallback chord sites:</p>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li><a href={fallbackLinks.yousician} target="_blank" rel="noopener noreferrer">🎸 Yousician</a></li>
            <li><a href={fallbackLinks.ultimateGuitar} target="_blank" rel="noopener noreferrer">🎼 Ultimate Guitar</a></li>
            <li><a href={fallbackLinks.chordify} target="_blank" rel="noopener noreferrer">🎶 Chordify</a></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChordsGenerator;
