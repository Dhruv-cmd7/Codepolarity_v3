import React, { useState, useEffect, useRef } from 'react';
import { Terminal, RotateCcw, Volume2, VolumeX, Play, ArrowRight, Award } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'react',
    name: 'React Hook Telemetry',
    file: 'telemetryHook.js',
    code: `const [telemetry, setTelemetry] = useState({ wpm: 0, accuracy: 100 });
useEffect(() => {
  const handler = logKeystrokes();
  return () => destroyHandler(handler);
}, [telemetry]);`
  },
  {
    id: 'python',
    name: 'Python Quick Sort',
    file: 'quick_sort.py',
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
    file: 'glassmorphism.css',
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
    name: 'SQL Aggregation',
    file: 'aggregate.sql',
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
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastTypedKey, setLastTypedKey] = useState(null);

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const targetCode = selectedCat.code;

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
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    if (isFinished) return;

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

    playTactileClick(isCorrect);

    if (charIndex >= 0) {
      setLastTypedKey(value[charIndex].toLowerCase());
      setTimeout(() => setLastTypedKey(null), 120);
    }

    setInputText(value);

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

  // Synthesize realistic mechanical switch audio click
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
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      } else {
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
      // Audio context might be restricted before interaction
    }
  };

  const timeElapsed = 30 - timeRemaining;
  const timeInMinutes = timeElapsed > 0 ? timeElapsed / 60 : 0.01;
  const rawWpm = Math.round((correctChars / 5) / timeInMinutes);
  const wpm = isNaN(rawWpm) || rawWpm < 0 ? 0 : rawWpm;
  const accuracy = totalKeystrokes > 0 ? Math.round((correctChars / totalKeystrokes) * 100) : 100;

  const getPerformanceBadge = () => {
    if (wpm >= 75) return { text: 'COMPILER SPEED', desc: 'Velocity faster than V8 JavaScript JIT optimization.' };
    if (wpm >= 55) return { text: 'KEYBOARD WARRIOR', desc: 'Superior muscle memory and structural precision.' };
    if (wpm >= 35) return { text: 'CODE NINJA', desc: 'Swift algorithms and clean tactile syntax flow.' };
    if (wpm >= 20) return { text: 'LOGIC BUILDER', desc: 'Solid foundational keystrokes and cadence.' };
    return { text: 'SYNTAX APPRENTICE', desc: 'Continue daily velocity drills to eliminate cognitive drag.' };
  };

  const badge = getPerformanceBadge();

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    focusInput();
  }, [selectedCat]);

  const keysRow1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const keysRow2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'];
  const keysRow3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'];
  const nextChar = targetCode[inputText.length]?.toLowerCase() || '';

  return (
    <div className="signature-page-container" onClick={focusInput}>
      <div className="signature-ambient-glow" aria-hidden="true" />
      <div className="signature-grid-bg" aria-hidden="true" />

      <div className="signature-inner max-w-[960px]">
        {/* Header with Signature Brutalist Styling */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/[0.08]">
          <div className="signature-header">
            <div className="signature-badge">
              <span className="signature-bracket">[</span>
              <span>03 // VELOCITY DRILLS</span>
              <span className="signature-bracket">]</span>
            </div>
            <h1 className="signature-title">Typlab Velocity Engine</h1>
            <p className="signature-subtitle">
              Calibrate software keystroke telemetry, tactile dexterity, and speed across production syntax patterns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled(!soundEnabled);
              }}
              type="button"
              className="signature-btn-secondary py-2 px-3 text-xs"
              title="Toggle Mechanical Key Switch Audio"
            >
              {soundEnabled ? <Volume2 size={14} className="text-blue-400" /> : <VolumeX size={14} className="text-zinc-500" />}
              <span>{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                resetTest();
              }}
              type="button"
              className="signature-btn-secondary py-2 px-3 text-xs"
              title="Reset Session"
            >
              <RotateCcw size={14} />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Category Tabs Strip */}
        <div className="signature-tabs-wrap">
          {CATEGORIES.map((cat, idx) => {
            const isActive = selectedCat.id === cat.id;
            const num = idx + 1 < 10 ? `0${idx + 1}` : idx + 1;

            return (
              <button
                key={cat.id}
                onClick={(e) => {
                  e.stopPropagation();
                  resetTest(cat);
                }}
                type="button"
                className={`signature-tab-btn ${isActive ? 'active' : ''}`}
              >
                <span>[ {num} // {cat.name.toUpperCase()} ]</span>
              </button>
            );
          })}
        </div>

        {/* Live Telemetry HUD Bar: 4 Metric Bento Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="signature-metric-box">
            <span className="signature-metric-label">[ 01 // VELOCITY ]</span>
            <div className="flex items-baseline gap-1">
              <span className="signature-metric-value text-blue-400">{wpm}</span>
              <span className="text-xs font-mono text-zinc-500 font-semibold">WPM</span>
            </div>
          </div>

          <div className="signature-metric-box">
            <span className="signature-metric-label">[ 02 // ACCURACY ]</span>
            <div className="flex items-baseline gap-1">
              <span className="signature-metric-value text-purple-400">{accuracy}%</span>
              <span className="text-xs font-mono text-zinc-500 font-semibold">TRUE</span>
            </div>
          </div>

          <div className="signature-metric-box">
            <span className="signature-metric-label">[ 03 // TIMER ]</span>
            <div className="flex items-baseline gap-1">
              <span className={`signature-metric-value ${timeRemaining < 10 ? 'text-red-400' : 'text-zinc-100'}`}>
                {timeRemaining}
              </span>
              <span className="text-xs font-mono text-zinc-500 font-semibold">SEC</span>
            </div>
          </div>

          <div className="signature-metric-box">
            <span className="signature-metric-label">[ 04 // PROGRESS ]</span>
            <div className="flex items-baseline gap-1">
              <span className="signature-metric-value text-emerald-400">
                {Math.min(100, Math.round((inputText.length / targetCode.length) * 100))}%
              </span>
              <span className="text-xs font-mono text-zinc-500 font-semibold">RAW</span>
            </div>
          </div>
        </div>

        {/* Hidden Input Key Catcher */}
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleChange}
          className="absolute opacity-0 pointer-events-none"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          disabled={isFinished}
        />

        {/* Terminal Code Typing Container */}
        <div className={`signature-card p-0 overflow-hidden transition-all duration-300 ${
          isStarted ? 'border-blue-500/50 shadow-[0_4px_30px_rgba(59,130,246,0.15)]' : ''
        }`}>
          {/* Terminal Chrome Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="ml-2 font-mono text-xs text-zinc-400 font-semibold">
                [ {selectedCat.file} ]
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-mono text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                TELEMETRY ACTIVE
              </span>
            </div>
          </div>

          {/* Code Text Area */}
          <div className="p-6 md:p-8 font-mono text-sm md:text-base leading-relaxed bg-black/20 select-none min-h-[190px] whitespace-pre-wrap">
            {targetCode.split('').map((char, index) => {
              const isCurrent = index === inputText.length;
              const isTyped = index < inputText.length;
              let charClass = 'text-zinc-500';

              if (isTyped) {
                const wasCorrect = inputText[index] === char;
                charClass = wasCorrect ? 'text-zinc-100 bg-blue-500/10 border-b border-blue-400' : 'text-red-400 bg-red-500/20 border-b border-red-500';
              } else if (isCurrent) {
                charClass = 'text-white bg-white/10 border-b-2 border-blue-400 animate-pulse';
              }

              if (char === '\n') {
                return (
                  <span key={index} className={`${charClass} block h-3`}>
                    {isCurrent ? '↵\n' : '\n'}
                  </span>
                );
              }

              return (
                <span key={index} className={charClass}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Start Guide Box */}
        {!isStarted && !isFinished && (
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-400 py-1">
            <Play size={12} className="text-blue-400 animate-pulse" />
            <span>[ PRESS ANY KEY OR CLICK HERE TO BEGIN TELEMETRY RECORDING ]</span>
          </div>
        )}

        {/* Tactile Mechanical Keyboard Visualizer */}
        <div className="signature-card p-5 flex flex-col gap-2 bg-white/[0.01]">
          <div className="signature-card-top mb-3 pb-3">
            <span className="signature-card-tag">
              <span className="signature-bracket">[</span>
              <span>TACTILE SWITCH MATRIX // QWERTY GUIDE</span>
              <span className="signature-bracket">]</span>
            </span>
            <span className="signature-pill">HARDWARE VISUALIZER</span>
          </div>

          <div className="flex justify-center gap-1.5">
            {keysRow1.map((k) => {
              const isActive = lastTypedKey === k;
              const isTarget = nextChar === k;

              return (
                <div
                  key={k}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all duration-100 select-none ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)] scale-95'
                      : isTarget
                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                        : 'bg-white/[0.02] border-white/[0.08] text-zinc-500'
                  }`}
                >
                  {k.toUpperCase()}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-1.5 pl-3 md:pl-5">
            {keysRow2.map((k) => {
              const isActive = lastTypedKey === k;
              const isTarget = nextChar === k;

              return (
                <div
                  key={k}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all duration-100 select-none ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)] scale-95'
                      : isTarget
                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                        : 'bg-white/[0.02] border-white/[0.08] text-zinc-500'
                  }`}
                >
                  {k.toUpperCase()}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-1.5 pl-6 md:pl-10">
            {keysRow3.map((k) => {
              const isActive = lastTypedKey === k;
              const isTarget = nextChar === k;

              return (
                <div
                  key={k}
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all duration-100 select-none ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)] scale-95'
                      : isTarget
                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                        : 'bg-white/[0.02] border-white/[0.08] text-zinc-500'
                  }`}
                >
                  {k.toUpperCase()}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-1">
            <div
              className={`w-64 md:w-80 h-8 md:h-10 rounded-lg border font-mono text-[11px] font-bold tracking-widest flex items-center justify-center transition-all duration-100 select-none ${
                lastTypedKey === ' '
                  ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)] scale-95'
                  : nextChar === ' '
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                    : 'bg-white/[0.02] border-white/[0.08] text-zinc-500'
              }`}
            >
              SPACEBAR
            </div>
          </div>
        </div>

        {/* Test Completion Verification Modal */}
        {isFinished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="signature-card max-w-md w-full flex flex-col items-center text-center gap-6 p-8 relative shadow-2xl border-white/[0.15]">
              <div className="signature-badge">
                <span className="signature-bracket">[</span>
                <span>VELOCITY TEST COMPLETED</span>
                <span className="signature-bracket">]</span>
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
                  {badge.text}
                </h2>
                <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                  {badge.desc}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full">
                <div className="signature-metric-box items-center text-center">
                  <span className="signature-metric-label">SPEED</span>
                  <span className="signature-metric-value text-blue-400 text-lg md:text-xl">{wpm} WPM</span>
                </div>
                <div className="signature-metric-box items-center text-center">
                  <span className="signature-metric-label">ACCURACY</span>
                  <span className="signature-metric-value text-purple-400 text-lg md:text-xl">{accuracy}%</span>
                </div>
                <div className="signature-metric-box items-center text-center">
                  <span className="signature-metric-label">KEYSTROKES</span>
                  <span className="signature-metric-value text-emerald-400 text-lg md:text-xl">{inputText.length}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetTest();
                }}
                className="signature-btn-primary w-full py-3"
              >
                <span>Practice Another Drill</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Typlab;
