import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Code2,
  FileText,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import logoMark from '../assets/logo.svg';

const COMMON_WORDS = [
  'own', 'well', 'most', 'on', 'world', 'great', 'from', 'take', 'first', 'before',
  'must', 'also', 'could', 'off', 'have', 'point', 'consider', 'between', 'can', 'even',
  'call', 'home', 'think', 'give', 'point', 'never', 'about', 'move', 'they', 'well',
  'how', 'turn', 'both', 'only', 'again', 'lead', 'such', 'group', 'play', 'right',
  'still', 'state', 'long', 'while', 'life', 'hand', 'small', 'another', 'large', 'number',
  'system', 'program', 'build', 'order', 'place', 'water', 'follow', 'high', 'might', 'story'
];

const CODE_SNIPPETS = {
  typescript: `interface TelemetryMetric<T> {
  data: T;
  latencyMs: number;
  status: 'idle' | 'success' | 'error';
}
async function executeQuery<T>(query: string): Promise<TelemetryMetric<T>> {
  const start = performance.now();
  const res = await database.query<T>(query);
  return { data: res, status: 'success', latencyMs: performance.now() - start };
}`,
  javascript: `const useDebounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};`,
  python: `def binary_search(array: list[int], target: int) -> int:
    low, high = 0, len(array) - 1
    while low <= high:
        mid = (low + high) // 2
        if array[mid] == target:
            return mid
        elif array[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
  rust: `pub fn parse_packet(buffer: &[u8]) -> Result<Header, ProtocolError> {
    match buffer.first() {
        Some(&MAGIC_BYTE) => {
            let payload_len = buffer[1..5].try_into()?;
            Ok(Header::new(payload_len))
        }
        Some(_) => Err(ProtocolError::InvalidMagic),
        None => Err(ProtocolError::UnexpectedEof),
    }
}`,
  go: `func workerPool(jobs <-chan Task, results chan<- Result, workers int) {
    var wg sync.WaitGroup
    for w := 1; w <= workers; w++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- job.Execute()
            }
        }()
    }
    wg.Wait()
}`,
  sql: `SELECT 
    user_id,
    DATE_TRUNC('month', created_at) AS active_month,
    COUNT(event_id) AS total_events,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rank
FROM telemetry_logs
WHERE status = 'SUCCESS'
GROUP BY user_id, active_month;`
};

const MODES = [
  { id: 'time', label: 'time', icon: Clock },
  { id: 'words', label: 'words', icon: FileText },
  { id: 'code', label: 'code', icon: Code2 }
];

const TIME_CONFIGS = [15, 30, 60, 120];
const WORD_COUNT_CONFIGS = [10, 25, 50, 100];
const LANGUAGES = ['typescript', 'javascript', 'python', 'rust', 'go', 'sql'];

const ACCENT_THEMES = [
  { id: 'cyan', label: 'Polarity Cyan', hex: '#22d3ee', textClass: 'text-cyan-400', bgClass: 'bg-cyan-400', borderClass: 'border-cyan-400' },
  { id: 'amber', label: 'Serika Amber', hex: '#e2b714', textClass: 'text-[#e2b714]', bgClass: 'bg-[#e2b714]', borderClass: 'border-[#e2b714]' },
  { id: 'emerald', label: 'Matrix Green', hex: '#10b981', textClass: 'text-emerald-400', bgClass: 'bg-emerald-400', borderClass: 'border-emerald-400' }
];

const Typlab = ({ setCurrentPage }) => {
  const [mode, setMode] = useState('code'); // default to code mode for Codepolarity developer platform
  const [timeConfig, setTimeConfig] = useState(30);
  const [wordCountConfig, setWordCountConfig] = useState(25);
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [accentTheme, setAccentTheme] = useState(ACCENT_THEMES[0]); // default Polarity Cyan

  const [targetText, setTargetText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isFocused, setIsFocused] = useState(true);

  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Synthesize mechanical keyboard switch click
  const playTactileClick = useCallback((isCorrect) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isCorrect) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650 + Math.random() * 60, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(170, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, []);

  // Reset drill test
  const resetTest = useCallback((customMode = mode, customTime = timeConfig, customLang = codeLanguage) => {
    clearInterval(timerRef.current);
    setInputText('');
    setIsStarted(false);
    setIsFinished(false);
    setTimeRemaining(customTime);
    setSecondsElapsed(0);
    setTotalKeystrokes(0);
    setCorrectChars(0);
    setErrorCount(0);

    if (customMode === 'code') {
      setTargetText(CODE_SNIPPETS[customLang] || CODE_SNIPPETS.typescript);
    } else {
      const count = customMode === 'words' ? wordCountConfig : 45;
      const shuffled = [];
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * COMMON_WORDS.length);
        shuffled.push(COMMON_WORDS[idx]);
      }
      setTargetText(shuffled.join(' '));
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setTimeout(focusInput, 30);
  }, [mode, timeConfig, codeLanguage, wordCountConfig, focusInput]);

  useEffect(() => {
    resetTest();
  }, []);

  const finishTest = useCallback(() => {
    clearInterval(timerRef.current);
    setIsFinished(true);
  }, []);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);

      if (mode === 'time') {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
  }, [mode, finishTest]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Global keydown listeners: Tab + Enter or Esc
  useEffect(() => {
    let tabPressed = false;

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        tabPressed = true;
        setTimeout(() => { tabPressed = false; }, 800);
      } else if (e.key === 'Enter' && tabPressed) {
        e.preventDefault();
        resetTest();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        resetTest();
        return;
      }

      // If user typed Tab in code mode, insert 2 spaces
      if (e.key === 'Tab' && mode === 'code' && !isFinished && inputRef.current) {
        e.preventDefault();
        const curr = inputRef.current.value;
        if (targetText.slice(curr.length, curr.length + 2) === '  ') {
          const nextVal = curr + '  ';
          inputRef.current.value = nextVal;
          handleInputChange({ target: { value: nextVal } });
        }
      }

      if (!isFocused && !isFinished && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        focusInput();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, isFinished, resetTest, mode, targetText, focusInput]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (isFinished) return;

    if (!isStarted && value.length > 0) {
      setIsStarted(true);
      startTimer();
    }

    const prevLen = inputText.length;
    const newLen = value.length;

    if (newLen > prevLen) {
      const addedChar = value[newLen - 1];
      const expectedChar = targetText[newLen - 1];
      const isCorrect = addedChar === expectedChar;

      setTotalKeystrokes((prev) => prev + 1);
      if (isCorrect) {
        setCorrectChars((prev) => prev + 1);
      } else {
        setErrorCount((prev) => prev + 1);
      }
      playTactileClick(isCorrect);
    }

    setInputText(value);

    if (value.length >= targetText.length) {
      finishTest();
    }
  };

  // Metrics
  const activeSeconds = mode === 'time' ? (timeConfig - timeRemaining) : secondsElapsed;
  const timeInMinutes = activeSeconds > 0 ? activeSeconds / 60 : 0.016;
  const rawWpm = Math.round((correctChars / 5) / timeInMinutes);
  const wpm = isNaN(rawWpm) || rawWpm < 0 ? 0 : rawWpm;
  const rawTotalWpm = Math.round((totalKeystrokes / 5) / timeInMinutes);
  const rawWpmVal = isNaN(rawTotalWpm) || rawTotalWpm < 0 ? 0 : rawTotalWpm;
  const accuracy = totalKeystrokes > 0
    ? Math.max(0, Math.round(((totalKeystrokes - errorCount) / totalKeystrokes) * 100))
    : 100;

  return (
    <div
      className="min-h-screen bg-[#0a0d14] text-[#f1f5f9] font-mono flex flex-col justify-between items-center px-4 sm:px-8 py-6 select-none transition-colors duration-300 relative"
      onClick={focusInput}
    >
      {/* Subtle ambient Codepolarity background glow */}
      <div
        className="fixed top-12 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Hidden textarea to capture keys accurately */}
      <textarea
        ref={inputRef}
        value={inputText}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute -top-9999 -left-9999 opacity-0 pointer-events-none w-1 h-1 resize-none"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        disabled={isFinished}
        aria-label="Codepolarity Typlab input"
      />

      {/* Top Header Bar: Codepolarity Branding & Quick Controls */}
      <header
        className={`w-full max-w-5xl flex items-center justify-between transition-opacity duration-300 relative z-10 ${
          isStarted && !isFinished ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Codepolarity Logo & Typlab Badge */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => {
              if (setCurrentPage) setCurrentPage('landing');
            }}
            title="Codepolarity Home"
          >
            <img
              src={logoMark}
              alt="Codepolarity"
              className="h-6 w-auto block shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{ filter: 'var(--logo-filter, invert(1))' }}
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 leading-none tracking-wider font-sans font-medium uppercase">
                CODEPOLARITY
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-zinc-200 tracking-tight group-hover:text-white transition-colors">
                  typlab
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${accentTheme.bgClass} shadow-[0_0_8px_${accentTheme.hex}]`} />
              </div>
            </div>
          </div>

          {/* Quick Platform Nav Icons */}
          <div className="hidden md:flex items-center gap-3 ml-4 pl-4 border-l border-white/[0.08] text-zinc-500 text-xs">
            {setCurrentPage && (
              <>
                <button
                  onClick={() => setCurrentPage('roadmaps')}
                  className="hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  roadmaps
                </button>
                <button
                  onClick={() => setCurrentPage('editor')}
                  className="hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  cloud ide
                </button>
                <button
                  onClick={() => setCurrentPage('assessment')}
                  className="hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  benchmark
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Utility Bar: Audio, Accent Picker */}
        <div className="flex items-center gap-4 text-zinc-500 text-xs">
          {/* Audio toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSoundEnabled(!soundEnabled);
            }}
            type="button"
            className="hover:text-zinc-200 cursor-pointer transition-colors p-1"
            title={soundEnabled ? 'Mute Mechanical Switch Audio' : 'Enable Mechanical Audio'}
          >
            {soundEnabled ? <Volume2 size={16} className={accentTheme.textClass} /> : <VolumeX size={16} />}
          </button>

          {/* Accent theme quick switcher */}
          <div className="flex items-center gap-1 bg-[#121622] border border-white/[0.06] rounded-full p-1">
            {ACCENT_THEMES.map((th) => (
              <button
                key={th.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setAccentTheme(th);
                }}
                type="button"
                className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                  accentTheme.id === th.id ? 'scale-125 ring-2 ring-white/20' : 'opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: th.hex }}
                title={th.label}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Testing Centerpiece */}
      <main className="w-full max-w-5xl flex flex-col items-center justify-center my-auto gap-8 relative z-10">

        {/* Monkeytype-Style Pill Configuration Bar (Adapted to Codepolarity surface tokens) */}
        <div
          className={`flex items-center justify-center flex-wrap gap-4 text-xs text-zinc-500 bg-[#10141f] border border-white/[0.08] px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300 ${
            isStarted && !isFinished ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100'
          }`}
        >
          {/* Mode Selector */}
          <div className="flex items-center gap-3">
            {MODES.map((m) => {
              const active = mode === m.id;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode(m.id);
                    resetTest(m.id);
                  }}
                  type="button"
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    active ? `${accentTheme.textClass} font-bold` : 'hover:text-zinc-300'
                  }`}
                >
                  <Icon size={13} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-3.5 bg-white/[0.1]" />

          {/* Sub-config: Time options / Word counts / Programming Languages */}
          {mode === 'time' && (
            <div className="flex items-center gap-3">
              {TIME_CONFIGS.map((t) => {
                const active = timeConfig === t;
                return (
                  <button
                    key={t}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimeConfig(t);
                      resetTest('time', t);
                    }}
                    type="button"
                    className={`transition-colors cursor-pointer ${
                      active ? `${accentTheme.textClass} font-bold` : 'hover:text-zinc-300'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}

          {mode === 'words' && (
            <div className="flex items-center gap-3">
              {WORD_COUNT_CONFIGS.map((cnt) => {
                const active = wordCountConfig === cnt;
                return (
                  <button
                    key={cnt}
                    onClick={(e) => {
                      e.stopPropagation();
                      setWordCountConfig(cnt);
                      resetTest('words');
                    }}
                    type="button"
                    className={`transition-colors cursor-pointer ${
                      active ? `${accentTheme.textClass} font-bold` : 'hover:text-zinc-300'
                    }`}
                  >
                    {cnt}
                  </button>
                );
              })}
            </div>
          )}

          {mode === 'code' && (
            <div className="flex items-center gap-3">
              {LANGUAGES.map((lang) => {
                const active = codeLanguage === lang;
                return (
                  <button
                    key={lang}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCodeLanguage(lang);
                      resetTest('code', timeConfig, lang);
                    }}
                    type="button"
                    className={`transition-colors cursor-pointer uppercase text-[11px] ${
                      active ? `${accentTheme.textClass} font-bold` : 'hover:text-zinc-300'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Subtitle language indicator (when idle) */}
        {!isStarted && !isFinished && (
          <div className="text-xs text-zinc-500 flex items-center gap-1.5 -mb-2">
            <span>🌐</span>
            <span>{mode === 'code' ? codeLanguage : 'english'}</span>
          </div>
        )}

        {/* Live Timer: Large floating countdown number above text */}
        {isStarted && !isFinished && (
          <div className={`w-full flex justify-start text-2xl sm:text-3xl font-mono font-normal pl-2 -mb-4 transition-all ${accentTheme.textClass}`}>
            {mode === 'time' ? timeRemaining : `${secondsElapsed}s`}
          </div>
        )}

        {/* Main Code/Text Stream Area */}
        {!isFinished && (
          <div className="w-full relative py-2">
            {/* Click to focus hint if blurred */}
            {!isFocused && (
              <div
                className="absolute inset-0 bg-[#0a0d14]/85 backdrop-blur-xs flex items-center justify-center z-10 cursor-pointer"
                onClick={focusInput}
              >
                <div className="text-xs font-mono text-zinc-300 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] shadow-xl">
                  Click anywhere or press any key to focus
                </div>
              </div>
            )}

            {/* Character Stream with Caret */}
            <div className="font-mono text-xl sm:text-2xl md:text-[27px] leading-[1.65] sm:leading-[1.75] tracking-wide select-none whitespace-pre-wrap break-normal">
              {targetText.split('').map((char, index) => {
                const isCurrent = index === inputText.length;
                const isTyped = index < inputText.length;

                let charStyle = 'text-zinc-600'; // untyped muted grey

                if (isTyped) {
                  const wasCorrect = inputText[index] === char;
                  charStyle = wasCorrect
                    ? 'text-zinc-100' // correct off-white
                    : 'text-[#ef4444] underline decoration-[#ef4444] decoration-2'; // mistake soft red
                }

                if (char === '\n') {
                  return (
                    <span key={index} className="relative inline">
                      {isCurrent && (
                        <span
                          className={`inline-block w-[2.5px] h-[1.15em] align-middle ${accentTheme.bgClass} -mr-[2.5px] animate-pulse`}
                          style={{ boxShadow: `0 0 10px ${accentTheme.hex}` }}
                        />
                      )}
                      <span className="text-zinc-700 text-xs opacity-50">↵</span>
                      {'\n'}
                    </span>
                  );
                }

                return (
                  <span key={index} className="relative inline">
                    {/* The iconic vertical caret */}
                    {isCurrent && (
                      <span
                        className={`inline-block w-[2.5px] h-[1.15em] align-middle ${accentTheme.bgClass} -mr-[2.5px] animate-pulse`}
                        style={{ boxShadow: `0 0 10px ${accentTheme.hex}` }}
                      />
                    )}
                    <span className={charStyle}>
                      {char}
                    </span>
                  </span>
                );
              })}
            </div>

            {/* Quick Restart Circular Arrow Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetTest();
                }}
                type="button"
                className="text-zinc-600 hover:text-zinc-200 p-2 rounded-full transition-colors cursor-pointer"
                title="Restart Test (Esc)"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {isFinished && (
          <div className="w-full flex flex-col items-center gap-8 py-4 animate-in fade-in duration-200">
            {/* Primary Hero Metrics */}
            <div className="grid grid-cols-2 gap-12 sm:gap-20 text-left">
              <div className="flex flex-col">
                <span className="text-sm text-zinc-500 uppercase font-semibold">wpm</span>
                <span className={`text-6xl sm:text-7xl font-bold leading-tight mt-1 ${accentTheme.textClass}`}>
                  {wpm}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-zinc-500 uppercase font-semibold">acc</span>
                <span className={`text-6xl sm:text-7xl font-bold leading-tight mt-1 ${accentTheme.textClass}`}>
                  {accuracy}%
                </span>
              </div>
            </div>

            {/* Secondary Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 text-left border-t border-white/[0.08] pt-6 w-full max-w-xl text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500">test type</span>
                <span className="text-zinc-200 font-semibold">{mode} {mode === 'time' ? `${timeConfig}s` : ''}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500">raw wpm</span>
                <span className="text-zinc-200 font-semibold">{rawWpmVal}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500">characters</span>
                <span className="text-zinc-200 font-semibold">
                  <span className="text-zinc-100">{correctChars}</span>/
                  <span className="text-[#ef4444]">{errorCount}</span>/
                  <span className="text-zinc-500">{totalKeystrokes}</span>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500">time</span>
                <span className="text-zinc-200 font-semibold">{activeSeconds}s</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
              <button
                onClick={() => resetTest()}
                type="button"
                className="px-6 py-2.5 rounded-lg bg-[#141a29] border border-white/[0.1] text-zinc-200 hover:text-white hover:border-white/[0.2] text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Next Test (Tab + Enter)</span>
              </button>

              {setCurrentPage && (
                <button
                  onClick={() => setCurrentPage('editor')}
                  type="button"
                  className="px-6 py-2.5 rounded-lg bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/30 text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Open in Cloud IDE</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Shortcuts Prompt */}
        {!isFinished && (
          <div className="flex flex-col items-center gap-1.5 text-[11px] text-zinc-600 mt-2">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#121622] border border-white/[0.06] text-zinc-400 text-[10px]">tab</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#121622] border border-white/[0.06] text-zinc-400 text-[10px]">enter</kbd>
              <span className="ml-1">- restart test</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#121622] border border-white/[0.06] text-zinc-400 text-[10px]">esc</kbd>
              <span className="ml-1">- quick reset</span>
            </div>
          </div>
        )}

      </main>

      {/* Monkeytype-Style Minimal Footer adapted to Codepolarity */}
      <footer
        className={`w-full max-w-5xl flex items-center justify-between text-[11px] text-zinc-500 pt-4 transition-opacity duration-300 relative z-10 ${
          isStarted && !isFinished ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Left Platform Links */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span
            className="hover:text-zinc-300 cursor-pointer"
            onClick={() => setCurrentPage && setCurrentPage('landing')}
          >
            codepolarity
          </span>
          <span
            className="hover:text-zinc-300 cursor-pointer"
            onClick={() => setCurrentPage && setCurrentPage('roadmaps')}
          >
            roadmaps
          </span>
          <span
            className="hover:text-zinc-300 cursor-pointer"
            onClick={() => setCurrentPage && setCurrentPage('editor')}
          >
            cloud ide
          </span>
          <span
            className="hover:text-zinc-300 cursor-pointer"
            onClick={() => setCurrentPage && setCurrentPage('assessment')}
          >
            assessment
          </span>
          <a
            href="https://github.com/Dhruv-cmd7/Codepolarity_v3"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 flex items-center gap-1"
          >
            <span>github</span>
            <ExternalLink size={10} />
          </a>
        </div>

        {/* Right Brand Theme & Version */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-zinc-400">
            <span className={`w-2 h-2 rounded-full ${accentTheme.bgClass}`} />
            <span>{accentTheme.label.toLowerCase()}</span>
          </span>
          <span className="flex items-center gap-1 text-zinc-600">
            <span>typlab v3.0</span>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Typlab;
