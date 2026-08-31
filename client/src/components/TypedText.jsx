import React, { useState, useEffect, useRef } from 'react';

// Typed text animation matching official antigravity.google
const TypedText = ({ words, speed = 80, pause = 1800 }) => {
  const [displayText, setDisplayText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const word = words[wordIdx];

    let timeout;
    if (!deleting && charIdx < word.length) {
      timeout = setTimeout(() => {
        setDisplayText(word.slice(0, charIdx + 1));
        setCharIdx(c => c + 1);
      }, speed);
    } else if (!deleting && charIdx === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplayText(word.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      }, speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return (
    <span style={{ display: 'inline', whiteSpace: 'nowrap' }}>
      <span>{displayText}</span>
      <span style={styles.cursor} aria-hidden="true" />
    </span>
  );
};

const styles = {
  cursor: {
    display: 'inline-block',
    width: '2px',
    height: '0.85em',
    background: 'currentColor',
    marginLeft: '2px',
    verticalAlign: 'middle',
    animation: 'blink 0.85s infinite',
  },
};

export default TypedText;
