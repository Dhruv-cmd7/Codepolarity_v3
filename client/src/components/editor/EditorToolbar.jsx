import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Check,
  Columns2,
  Maximize2,
  Sliders,
  Copy,
  Download,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  MoreHorizontal,
  Sun,
  Moon,
  ArrowLeft,
  Code2,
  FileCode2,
  Sparkles
} from 'lucide-react';
import logoMark from '../../assets/logo.svg';
import logoText from '../../assets/logo_text.svg';
import { supportedLanguages } from '../../data/languagesCatalog';

export const EditorToolbar = ({
  title,
  setTitle,
  language,
  onRunCode,
  onRunTests,
  hasTests,
  isRunning,
  isTesting,
  onDownloadCode,
  onCopyCode,
  isCopied,
  sidebarOpen,
  setSidebarOpen,
  layoutMode,
  setLayoutMode,
  onOpenSettings,
  onOpenShortcuts,
  onToggleFullscreen,
  isFullscreen,
  isModified,
  theme,
  onToggleTheme,
  setCurrentPage,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  // Live formatted time ticker with UTC offset matching Climblabs Hero & SignInPage
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      const offsetMinutes = -now.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const utcStr = `UTC${sign}${offsetHours}`;

      setTimeString(`${hours}:${minutes} ${ampm}, ${utcStr}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const activeLangObj = supportedLanguages.find((l) => l.id === language) || supportedLanguages[0];

  // Close more menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLight = theme === 'light';

  return (
    <header className={`relative h-14 border-b px-3 sm:px-5 flex items-center justify-between gap-3 select-none shrink-0 z-30 transition-colors backdrop-blur-xl ${
      isLight ? 'bg-white/95 border-slate-200 text-slate-800 shadow-xs' : 'bg-[#0a0d14]/95 border-white/[0.08] text-slate-100 shadow-sm'
    }`}>
      {/* ────────────────── LEFT: CLEAN BACK BUTTON & RUNTIME CONTROLS ────────────────── */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 z-10">
        {/* Clean Back Button */}
        <button
          type="button"
          onClick={() => {
            if (setCurrentPage) {
              setCurrentPage('landing');
            } else if (typeof window !== 'undefined' && window.history.length > 1) {
              window.history.back();
            }
          }}
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 cursor-pointer ${
            isLight
              ? 'border-slate-200 bg-slate-100/70 text-slate-800 hover:bg-slate-200 hover:border-slate-300'
              : 'border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.06]'
          }`}
          title="Return to platform overview"
          aria-label="Return to platform overview"
        >
          <ArrowLeft size={14} className="transition-transform duration-150 group-hover:-translate-x-0.5 text-blue-400" />
          <span>Back</span>
        </button>

        <div className={`h-4 w-[1px] hidden sm:block ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />

        {/* Sidebar Toggle & Active Language Tag */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium tracking-wide transition-all cursor-pointer ${
            sidebarOpen
              ? isLight
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs font-semibold'
                : 'bg-white/[0.08] border-white/20 text-white font-medium'
              : isLight
                ? 'bg-slate-100/60 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                : 'bg-white/[0.02] border-white/[0.08] text-zinc-300 hover:border-white/[0.2] hover:bg-white/[0.05]'
          }`}
          title={sidebarOpen ? 'Hide Languages (Ctrl+B)' : 'Browse Languages (Ctrl+B)'}
        >
          <Code2 size={13} className="text-blue-400 shrink-0" />
          <span>{activeLangObj.name}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${sidebarOpen ? 'bg-blue-400 animate-pulse' : 'bg-zinc-600'} shrink-0`} />
        </button>

        {/* Snippet Title with File Icon */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
          isLight
            ? 'bg-slate-50 border-slate-200 focus-within:border-blue-400 focus-within:bg-white shadow-xs'
            : 'bg-white/[0.02] border-white/[0.08] focus-within:border-blue-500/50 focus-within:bg-blue-500/[0.04]'
        }`}>
          <FileCode2 size={13} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`bg-transparent text-xs font-sans font-medium outline-none w-24 sm:w-32 focus:w-44 transition-all truncate ${
              isLight ? 'text-slate-900 placeholder-slate-400' : 'text-zinc-100 placeholder-zinc-500'
            }`}
            placeholder="untitled"
            title="Click to rename snippet file"
          />
          {isModified && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 animate-pulse" title="Unsaved changes" />
          )}
        </div>
      </div>

      {/* ────────────────── CENTER: BRAND LOGO & CLEAN BADGE (PERFECTLY CENTERED) ────────────────── */}
      <div className="hidden xl:flex items-center gap-3 absolute left-1/2 -translate-x-1/2 pointer-events-auto">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (setCurrentPage) setCurrentPage('landing');
          }}
          className="flex items-center gap-2 hover:opacity-85 transition-opacity cursor-pointer"
          title="Back to Codepolarity Home"
        >
          <img
            src={logoMark}
            alt="Codepolarity"
            className="h-[22px] w-auto block shrink-0"
            style={{ filter: isLight ? 'none' : 'brightness(0) invert(1)' }}
          />
          <img
            src={logoText}
            alt="Codepolarity"
            className="h-[18px] w-auto block shrink-0"
            style={{ filter: isLight ? 'none' : 'brightness(0) invert(1)' }}
          />
        </a>
      </div>

      {/* ────────────────── RIGHT: EXECUTE BUTTON & PLATFORM CONTROLS ────────────────── */}
      <div className="flex items-center gap-2 sm:gap-2.5 z-10">
        {/* High-Contrast Execute Run Button */}
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className={`h-7 px-3 rounded-md text-xs font-semibold tracking-wide transition-all duration-150 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.97] select-none ${
            isLight
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-blue-700/30'
              : 'bg-white hover:bg-zinc-100 text-zinc-950 border-none'
          }`}
          title="Execute Code (Ctrl + Enter)"
        >
          <Play size={10} className={`fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Compiling...' : 'Run'}</span>
        </button>

        {/* Test Button (if challenge mode) */}
        {hasTests && (
          <button
            onClick={onRunTests}
            disabled={isTesting}
            className={`h-7 font-medium text-xs px-2.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-200'
            }`}
            title="Run Problem Tests"
          >
            <Check size={11} className={isTesting ? 'animate-spin' : ''} />
            <span>{isTesting ? 'Testing...' : 'Test'}</span>
          </button>
        )}

        {/* Live Local & UTC Time Pill */}
        <div
          className={`hidden 2xl:flex items-center font-mono text-xs px-3 h-9 rounded-lg border ${
            isLight
              ? 'bg-slate-100/70 border-slate-200 text-slate-600'
              : 'bg-white/[0.03] border-white/[0.08] text-zinc-400'
          }`}
          title="Live Local & UTC Time"
        >
          <span>{timeString}</span>
        </div>

        {/* Layout Switcher (Split vs Full Editor) */}
        <div className={`flex items-center p-0.5 rounded-lg border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/[0.02] border-white/[0.08]'
        }`}>
          <button
            onClick={() => setLayoutMode('split-h')}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              layoutMode === 'split-h'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-white/[0.12] text-white shadow-xs'
                : isLight
                ? 'text-slate-400 hover:text-slate-700'
                : 'text-zinc-500 hover:text-zinc-200'
            }`}
            title="Side-by-Side Split View"
          >
            <Columns2 size={13} />
          </button>
          <button
            onClick={() => setLayoutMode('editor-only')}
            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              layoutMode === 'editor-only'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-white/[0.12] text-white shadow-xs'
                : isLight
                ? 'text-slate-400 hover:text-slate-700'
                : 'text-zinc-500 hover:text-zinc-200'
            }`}
            title="Editor Focus View"
          >
            <Maximize2 size={13} />
          </button>
        </div>

        {/* Copy Code Button */}
        <button
          onClick={onCopyCode}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            isLight
              ? 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.2] hover:text-zinc-100'
          }`}
          title="Copy Code"
        >
          {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>

        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={(e) => onToggleTheme && onToggleTheme(e)}
            className={`p-2 rounded-lg border transition-all duration-300 cursor-pointer ${
              isLight
                ? 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.2] hover:text-zinc-100'
            }`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <div className="transition-transform duration-500 hover:rotate-45 active:scale-75 flex items-center justify-center">
              {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-600" />}
            </div>
          </button>
        )}

        {/* More Options Dropdown */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isLight
                ? 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                : 'border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:border-white/[0.2] hover:text-zinc-100'
            }`}
            title="More Options"
          >
            <MoreHorizontal size={14} />
          </button>

          {showMoreMenu && (
            <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-2xl py-1.5 text-xs z-50 animate-fade-in border font-sans ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 shadow-slate-200/50'
                : 'bg-[#0f131a] border-white/[0.12] text-zinc-300 shadow-black/80'
            }`}>
              <button
                onClick={() => {
                  onDownloadCode();
                  setShowMoreMenu(false);
                }}
                className={`w-full px-3.5 py-2 text-left flex items-center gap-2.5 cursor-pointer ${
                  isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Download size={13} className="text-blue-400" />
                <span>Download file</span>
              </button>
              <button
                onClick={() => {
                  onToggleFullscreen();
                  setShowMoreMenu(false);
                }}
                className={`w-full px-3.5 py-2 text-left flex items-center gap-2.5 cursor-pointer ${
                  isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Maximize2 size={13} className="text-blue-400" />
                <span>{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
              </button>
              <div className={`h-[1px] my-1 ${isLight ? 'bg-slate-100' : 'bg-white/[0.08]'}`} />
              <button
                onClick={() => {
                  onOpenSettings();
                  setShowMoreMenu(false);
                }}
                className={`w-full px-3.5 py-2 text-left flex items-center gap-2.5 cursor-pointer ${
                  isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Sliders size={13} className="text-blue-400" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  onOpenShortcuts();
                  setShowMoreMenu(false);
                }}
                className={`w-full px-3.5 py-2 text-left flex items-center gap-2.5 cursor-pointer ${
                  isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <HelpCircle size={13} className="text-blue-400" />
                <span>Shortcuts</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default EditorToolbar;
