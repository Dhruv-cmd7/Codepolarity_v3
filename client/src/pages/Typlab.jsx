import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Terminal, Play, RotateCcw, Volume2, VolumeX, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'react',
    name: 'React Hook Telemetry',
    code: `const [telemetry, setTelemetry] = useState({ wpm: 0, accuracy: 100 });
useEffect(() => {
  const handler = logKeystrokes();
  return () => destroyHandler(handler);
}, [telemetry]);`
  },
  {
    id: 'python',
    name: 'Python Quick Sort',
    code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`
  },
  {
    id: 'css',
    name: 'CSS Glassmorphism',
    code: `.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.3s ease;
}`
  },
  {
    id: 'sql',
    name: 'SQL Data Aggregation',
    code: `SELECT name, COUNT(nodes.id) AS completed
FROM students
JOIN progress ON students.id = progress.student_id
GROUP BY name
HAVING completed > 5
ORDER BY completed DESC;`
  }
];

const Typlab = () => {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [inputText, setInputText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 second sessions
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastTypedKey, setLastTypedKey] = useState(null);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const targetCode = selectedCat.code;

  // Reset function
  const resetTest = (cat = selectedCat) => {
    clearInterval(timerRef.current);
    setSelectedCat(cat);
    setInputText('');
    setIsStarted(false);
    setIsFinished(false);
    setTimeRemaining(30);
    setTotalKeystrokes(0);
    setCorrectChars(0);
    setLastTypedKey(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Handle typing input
  const handleChange = (e) => {
    const value = e.target.value;
    if (isFinished) return;

    // Start timer on first keystroke
    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      startTimer();
    }

    setTotalKeystrokes((prev) => prev + 1);

    const charIndex = value.length - 1;
    const isCorrect = value[charIndex] === targetCode[charIndex];

    if (isCorrect) {
      setCorrectChars((prev) => prev + 1);
    }

    // Play tactile mechanical audio click
    playTactileClick(isCorrect);

    // Save last typed key for keyboard visualizer highlighting
    if (charIndex >= 0) {
      setLastTypedKey(value[charIndex].toLowerCase());
      setTimeout(() => setLastTypedKey(null), 120);
    }

    setInputText(value);

    // If fully typed the code block
    if (value.length >= targetCode.length) {
      finishTest();
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishTest = () => {
    clearInterval(timerRef.current);
    setIsFinished(true);
  };

  // Synthesize mechanical keyboard click using Web Audio API
  const playTactileClick = (isCorrect) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isCorrect) {
        osc.type = 'triangle';
        // Mechanical switch click (high frequency quick pop)
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      } else {
        // Warning buzz on error
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate live telemetry metrics
  const timeElapsed = 30 - timeRemaining;
  const timeInMinutes = timeElapsed > 0 ? timeElapsed / 60 : 0.01;
  // WPM = (correct character count / 5) / time elapsed in minutes
  const rawWpm = Math.round((correctChars / 5) / timeInMinutes);
  const wpm = isNaN(rawWpm) || rawWpm < 0 ? 0 : rawWpm;
  
  const accuracy = totalKeystrokes > 0 ? Math.round((correctChars / totalKeystrokes) * 100) : 100;

  // Determine Badge/Title Awarded
  const getPerformanceBadge = () => {
    if (wpm >= 75) return { text: 'Compiler Speed', icon: '🚀', desc: 'Execution faster than JavaScript engines.' };
    if (wpm >= 55) return { text: 'Keyboard Warrior', icon: '⚔️', desc: 'Impressive muscle memory and accuracy.' };
    if (wpm >= 35) return { text: 'Code Ninja', icon: '🥷', desc: 'Swift algorithms and clean syntax flow.' };
    if (wpm >= 20) return { text: 'Logic Builder', icon: '🧠', desc: 'Solid fundamental keystrokes.' };
    return { text: 'Syntax Apprentice', icon: '📝', desc: 'Keep practicing to release cognitive friction.' };
  };

  const badge = getPerformanceBadge();

  // Focus hidden typing catcher input
  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    focusInput();
  }, [selectedCat]);

  // Visual Keyboard rows
  const keysRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const keysRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];
  const keysRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'];

  // Figure out the NEXT character to press (for guide highlight)
  const nextChar = targetCode[inputText.length]?.toLowerCase() || '';

  return (
    <div style={styles.container} className="animate-fade-in" onClick={focusInput}>
      {/* Dynamic Orbs */}
      <div className="glow-orb glow-orb-cyan" style={{ top: '8%', left: '10%', width: '450px', height: '450px' }} />
      <div className="glow-orb glow-orb-purple" style={{ bottom: '10%', right: '10%', width: '480px', height: '480px' }} />

      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={styles.titleArea}>
              <div style={styles.chip}>
                <Terminal size={12} style={{ color: 'var(--accent-cyan)' }} />
                <span>Typing Speed Lab</span>
              </div>
              <h1 style={styles.title}>Typlab</h1>
              <p style={styles.tagline}>Calibrate your coding velocity and keystroke dexterity.</p>
            </div>
            {/* Controls */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }} 
                style={styles.controlBtn}
                title="Toggle Tactile Sounds"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); resetTest(); }} style={styles.controlBtn} title="Reset">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Category selector row */}
        <div style={styles.tabsRow}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={(e) => {
                e.stopPropagation();
                resetTest(cat);
              }}
              style={{
                ...styles.tab,
                borderColor: selectedCat.id === cat.id ? 'var(--accent-cyan)' : 'var(--border-light)',
                background: selectedCat.id === cat.id ? 'rgba(6, 182, 212, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                color: selectedCat.id === cat.id ? 'var(--text-main)' : 'var(--text-muted)'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Live Telemetry Display */}
        <div style={styles.statsBar} className="glass-panel">
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Words Per Min</span>
            <span style={styles.statVal} className="text-glow-cyan">{wpm}</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Accuracy</span>
            <span style={styles.statVal} className="text-glow-purple">{accuracy}%</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Timer</span>
            <span style={{ ...styles.statVal, color: timeRemaining < 10 ? 'var(--accent-red)' : 'var(--text-main)' }}>
              {timeRemaining}s
            </span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statBox}>
            <span style={styles.statLabel}>Completion</span>
            <span style={styles.statVal}>
              {Math.min(100, Math.round((inputText.length / targetCode.length) * 100))}%
            </span>
          </div>
        </div>

        {/* Hidden Input field catcher */}
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleChange}
          style={styles.hiddenInput}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          disabled={isFinished}
        />

        {/* Code Typing Container */}
        <div 
          style={{
            ...styles.editorBox,
            borderColor: isStarted ? 'var(--accent-cyan)' : 'var(--border-light)',
          }} 
          className="glass-panel"
        >
          {/* Editor Chrome Bar */}
          <div style={styles.editorChrome}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '10', height: '10', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '10', height: '10', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '10', height: '10', borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <span style={styles.editorFile}>{selectedCat.id === 'react' ? 'hook.js' : selectedCat.id === 'python' ? 'sort.py' : selectedCat.id === 'css' ? 'theme.css' : 'query.sql'}</span>
            <div style={styles.focusIndicator}>
              <span style={styles.pulseDot} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>TYPING CONTAINER ACTIVE</span>
            </div>
          </div>

          {/* Typing Area */}
          <div style={styles.codeTextContainer}>
            {targetCode.split('').map((char, index) => {
              let style = styles.charDefault;
              const isCurrent = index === inputText.length;
              const isTyped = index < inputText.length;
              
              if (isTyped) {
                const wasCorrect = inputText[index] === char;
                style = wasCorrect ? styles.charCorrect : styles.charIncorrect;
              } else if (isCurrent) {
                style = styles.charCurrent;
              }

              // Special representation for space or tab/new-line
              if (char === '\n') {
                return (
                  <span key={index} style={{ ...style, display: 'block', height: '2px' }}>
                    {isCurrent ? '↵\n' : '\n'}
                  </span>
                );
              }

              return (
                <span key={index} style={style}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* guide focus box */}
        {!isStarted && !isFinished && (
          <div style={styles.guideBox}>
            <Play size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>Start typing inside the code panel to activate the timer.</span>
          </div>
        )}

        {/* Visual Keyboard Guide */}
        <div style={styles.keyboardContainer} className="glass-panel">
          <div style={styles.keyRow}>
            {keysRow1.map((k) => {
              const isActive = lastTypedKey === k;
              const isTarget = nextChar === k;
              return (
                <div
                  key={k}
                  style={{
                    ...styles.key,
                    borderColor: isActive ? 'var(--accent-purple)' : isTarget ? 'var(--accent-cyan)' : 'var(--border-light)',
                    background: isActive ? 'rgba(139, 92, 246, 0.2)' : isTarget ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.01)',
                    boxShadow: isActive ? '0 0 10px rgba(139, 92, 246, 0.3)' : isTarget ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none',
                    transform: isActive ? 'scale(0.95)' : 'scale(1)'
                  }}
                >
                  {k.toUpperCase()}
                </div>
              );
            })}
          </div>
          <div style={{ ...styles.keyRow, paddingLeft: '15px' }}>
            {keysRow2.map((k) => {
              const isActive = lastTypedKey === k;
              const isTarget = nextChar === k;
              return (
                <div
                  key={k}
                  style={{
                    ...styles.key,
                    borderColor: isActive ? 'var(--accent-purple)' : isTarget ? 'var(--accent-cyan)' : 'var(--border-light)',
                    background: isActive ? 'rgba(139, 92, 246, 0.2)' : isTarget ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.01)',
                    boxShadow: isActive ? '0 0 10px rgba(139, 92, 246, 0.3)' : isTarget ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none',
                    transform: isActive ? 'scale(0.95)' : 'scale(1)'
                  }}
                >
                  {k.toUpperCase()}
                </div>
              );
            })}
          </div>
          <div style={{ ...styles.keyRow, paddingLeft: '30px' }}>
            {keysRow3.map((k) => {
              const isActive = lastTypedKey === k;
              const isTarget = nextChar === k;
              return (
                <div
                  key={k}
                  style={{
                    ...styles.key,
                    borderColor: isActive ? 'var(--accent-purple)' : isTarget ? 'var(--accent-cyan)' : 'var(--border-light)',
                    background: isActive ? 'rgba(139, 92, 246, 0.2)' : isTarget ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.01)',
                    boxShadow: isActive ? '0 0 10px rgba(139, 92, 246, 0.3)' : isTarget ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none',
                    transform: isActive ? 'scale(0.95)' : 'scale(1)'
                  }}
                >
                  {k.toUpperCase()}
                </div>
              );
            })}
          </div>
          <div style={{ ...styles.keyRow, justifyContent: 'center', marginTop: '4px' }}>
            <div
              style={{
                ...styles.key,
                width: '280px',
                borderColor: lastTypedKey === ' ' ? 'var(--accent-purple)' : nextChar === ' ' ? 'var(--accent-cyan)' : 'var(--border-light)',
                background: lastTypedKey === ' ' ? 'rgba(139, 92, 246, 0.2)' : nextChar === ' ' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.01)',
                boxShadow: lastTypedKey === ' ' ? '0 0 10px rgba(139, 92, 246, 0.3)' : nextChar === ' ' ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none',
                transform: lastTypedKey === ' ' ? 'scale(0.95)' : 'scale(1)'
              }}
            >
              SPACEBAR
            </div>
          </div>
        </div>

        {/* Test Completion Modal */}
        {isFinished && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent} className="glass-panel animate-float">
              <div style={styles.modalHeader}>
                <span style={{ fontSize: '2.5rem' }}>{badge.icon}</span>
                <h2 style={styles.modalTitle}>{badge.text}</h2>
                <p style={styles.modalDesc}>{badge.desc}</p>
              </div>

              <div style={styles.modalStats}>
                <div style={styles.modalStatCard}>
                  <span style={styles.modalStatLabel}>SPEED</span>
                  <span style={styles.modalStatVal}>{wpm} WPM</span>
                </div>
                <div style={styles.modalStatCard}>
                  <span style={styles.modalStatLabel}>ACCURACY</span>
                  <span style={styles.modalStatVal}>{accuracy}%</span>
                </div>
                <div style={styles.modalStatCard}>
                  <span style={styles.modalStatLabel}>TYPED</span>
                  <span style={styles.modalStatVal}>{inputText.length} chars</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={() => resetTest()} className="btn-primary" style={{ flex: 1, padding: '12px' }}>
                  Practice Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    color: 'var(--text-main)',
    padding: '100px 24px 80px',
    position: 'relative',
    overflow: 'hidden',
  },
  inner: {
    maxWidth: '850px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-light)',
    paddingBottom: '20px',
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(6, 182, 212, 0.05)',
    border: '1px solid rgba(6, 182, 212, 0.15)',
    padding: '4px 10px',
    borderRadius: '99px',
    fontSize: '0.7rem',
    fontWeight: '500',
    color: 'var(--accent-cyan)',
    width: 'fit-content',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    margin: 0,
    background: 'linear-gradient(to right, #ffffff, #9ca3af)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  tagline: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    margin: 0,
  },
  controlBtn: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    outline: 'none',
    ':hover': {
      color: 'var(--text-main)',
      borderColor: 'var(--accent-cyan)',
      background: 'rgba(6, 182, 212, 0.05)',
    }
  },
  tabsRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    outline: 'none',
  },
  statsBar: {
    display: 'flex',
    padding: '16px 24px',
    borderRadius: '16px',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  statLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
  },
  statVal: {
    fontSize: '1.5rem',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  statDivider: {
    width: '1px',
    height: '30px',
    background: 'var(--border-light)',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
  },
  editorBox: {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid',
    transition: 'border-color 0.3s ease',
    boxShadow: 'var(--shadow-box)',
  },
  editorChrome: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 18px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid var(--border-light)',
  },
  editorFile: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  focusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  pulseDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--accent-cyan)',
    boxShadow: '0 0 6px rgba(6, 182, 212, 0.7)',
    animation: 'pulse 1.5s infinite',
  },
  codeTextContainer: {
    padding: '24px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    lineHeight: '1.8',
    background: 'rgba(0, 0, 0, 0.15)',
    whiteSpace: 'pre-wrap',
    minHeight: '180px',
    userSelect: 'none',
  },
  charDefault: {
    color: 'var(--text-dim)',
  },
  charCorrect: {
    color: 'var(--text-main)',
    background: 'rgba(6, 182, 212, 0.08)',
    borderBottom: '1px solid rgba(6, 182, 212, 0.3)',
  },
  charIncorrect: {
    color: 'var(--accent-red)',
    background: 'rgba(239, 68, 68, 0.12)',
    borderBottom: '1px solid var(--accent-red)',
  },
  charCurrent: {
    color: '#ffffff',
    background: 'rgba(255,255,255,0.08)',
    borderBottom: '2px solid var(--accent-cyan)',
    animation: 'blink 1s step-end infinite',
  },
  guideBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: 'var(--accent-cyan)',
    justifyContent: 'center',
    padding: '6px',
  },
  keyboardContainer: {
    padding: '16px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    background: 'rgba(10, 13, 20, 0.5)',
  },
  keyRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4px',
  },
  key: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    border: '1px solid var(--border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-mono)',
    fontWeight: '600',
    color: 'var(--text-muted)',
    transition: 'all 0.15s ease',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContent: {
    width: '440px',
    padding: '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-light)',
    borderRadius: '24px',
    textAlign: 'center',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: 0,
  },
  modalDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    margin: 0,
    lineHeight: '1.4',
  },
  modalStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  modalStatCard: {
    padding: '12px 6px',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  modalStatLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-dim)',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  modalStatVal: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  }
};

export default Typlab;
