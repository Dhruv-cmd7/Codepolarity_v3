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
  Moon
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
    <header className={`h-11 border-b px-3 flex items-center justify-between gap-3 select-none shrink-0 z-30 transition-colors ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#090a0f] border-white/[0.08] text-slate-100'
    }`}>
      {/* Left: Brand Logo, Breadcrumb, Title & Language Indicator */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Brand */}
        <button
          onClick={() => setCurrentPage && setCurrentPage('landing')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer shrink-0"
          title="Back to Codepolarity Home"
        >
          <img
            src={logoMark}
            alt="Codepolarity"
            className="h-4.5 w-auto"
            style={{ filter: isLight ? 'none' : 'var(--logo-filter)' }}
          />
          <img
            src={logoText}
            alt="Codepolarity"
            className="h-3.5 w-auto hidden md:block"
            style={{ filter: isLight ? 'none' : 'var(--logo-filter)' }}
          />
        </button>

        <span className={`select-none font-mono text-xs ${isLight ? 'text-slate-300' : 'text-zinc-700'}`}>/</span>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
            sidebarOpen
              ? isLight
                ? 'text-slate-900 bg-slate-100'
                : 'text-zinc-200 bg-white/[0.08]'
              : isLight
              ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.05]'
          }`}
          title={sidebarOpen ? 'Hide Languages (Ctrl+B)' : 'Choose Language (Ctrl+B)'}
        >
          {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
        </button>

        {/* Snippet Title */}
        <div className="flex items-center gap-1 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`bg-transparent text-xs font-medium outline-none w-28 sm:w-36 focus:w-44 transition-all px-2 py-1 rounded-md border truncate ${
              isLight
                ? 'border-transparent hover:border-slate-200 focus:border-slate-300 focus:bg-slate-50 text-slate-800'
                : 'border-transparent hover:border-white/[0.08] focus:border-white/[0.18] focus:bg-zinc-900/50 text-zinc-200'
            }`}
            placeholder="File name"
            title="Click to rename snippet"
          />
          {isModified && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" title="Unsaved changes" />
          )}
        </div>

        {/* Active Language Badge (clicking opens left sidebar) */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          className={`text-xs font-semibold py-1 px-2.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer border ${
            isLight
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/70 shadow-xs'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
          }`}
          title="Change Language (opens sidebar)"
        >
          <span>{activeLangObj.name}</span>
        </button>
      </div>

      {/* Center: Hero Run Button */}
      <div className="flex items-center gap-2">
        {/* Minimal Modern Run Button */}
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className={`group h-7 px-3 rounded-md text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-[0.97] select-none ${
            isLight
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs border border-emerald-700/20'
              : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-xs border border-emerald-400/30'
          }`}
          title="Run Code (Ctrl + Enter)"
        >
          <Play size={11} className={`fill-current transition-transform duration-150 group-hover:scale-105 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Running...' : 'Run'}</span>
          <span className={`text-[10px] font-mono tracking-tight ml-0.5 ${
            isLight ? 'text-emerald-100/75' : 'text-zinc-950/60'
          }`}>
            ⌘↵
          </span>
        </button>

        {/* Test Button (if challenge mode) */}
        {hasTests && (
          <button
            onClick={onRunTests}
            disabled={isTesting}
            className={`font-medium text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 border ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.08] text-zinc-200'
            }`}
            title="Run Problem Tests"
          >
            <Check size={12} className={isTesting ? 'animate-spin' : ''} />
            <span>{isTesting ? 'Testing...' : 'Test'}</span>
          </button>
        )}
      </div>

      {/* Right: Layout Switcher (Split vs Full Editor), Copy & Theme Toggle */}
      <div className="flex items-center gap-1.5">
        {/* Layout Toggle: Split View vs Editor Focus */}
        <div className={`flex items-center p-0.5 rounded-md border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900/60 border-white/[0.08]'
        }`}>
          <button
            onClick={() => setLayoutMode('split-h')}
            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
              layoutMode === 'split-h'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-white/[0.12] text-white'
                : isLight
                ? 'text-slate-400 hover:text-slate-700'
                : 'text-zinc-500 hover:text-zinc-200'
            }`}
            title="Side-by-Side Split"
          >
            <Columns2 size={13} />
          </button>
          <button
            onClick={() => setLayoutMode('editor-only')}
            className={`p-1 rounded text-xs transition-colors cursor-pointer ${
              layoutMode === 'editor-only'
                ? isLight
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-white/[0.12] text-white'
                : isLight
                ? 'text-slate-400 hover:text-slate-700'
                : 'text-zinc-500 hover:text-zinc-200'
            }`}
            title="Editor Focus"
          >
            <Maximize2 size={13} />
          </button>
        </div>

        <div className={`h-3.5 w-[1px] mx-0.5 ${isLight ? 'bg-slate-200' : 'bg-white/[0.08]'}`} />

        {/* Copy Code */}
        <button
          onClick={onCopyCode}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            isLight ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]'
          }`}
          title="Copy Code"
        >
          {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>

        {/* Theme Toggle */}
        {onToggleTheme && (
          <button
            onClick={(e) => onToggleTheme && onToggleTheme(e)}
            className={`p-1.5 rounded-md transition-all duration-300 cursor-pointer ${
              isLight
                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                : 'text-zinc-400 hover:text-amber-300 hover:bg-white/[0.06]'
            }`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <div className="transition-transform duration-500 hover:rotate-45 active:scale-75 flex items-center justify-center">
              {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-600" />}
            </div>
          </button>
        )}

        {/* More Options */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isLight ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]'
            }`}
            title="More Options"
          >
            <MoreHorizontal size={14} />
          </button>

          {showMoreMenu && (
            <div className={`absolute right-0 top-full mt-1.5 w-44 rounded-lg shadow-xl py-1 text-xs z-50 animate-fade-in border ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#12141c] border-white/[0.1] text-zinc-300'
            }`}>
              <button
                onClick={() => {
                  onDownloadCode();
                  setShowMoreMenu(false);
                }}
                className={`w-full px-3 py-1.5 text-left flex items-center gap-2 cursor-pointer ${
                  isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Download size={13} />
                <span>Download File</span>
              </button>
              <button
                onClick={() => {
                  onToggleFullscreen();
                  setShowMoreMenu(false);
                }}
                className={`w-full px-3 py-1.5 text-left flex items-center gap-2 cursor-pointer ${
                  isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Maximize2 size={13} />
                <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>
              <div className={`h-[1px] my-1 ${isLight ? 'bg-slate-100' : 'bg-white/[0.08]'}`} />
              <button
                onClick={() => {
                  onOpenSettings();
                  setShowMoreMenu(false);
                }}
                className={`w-full px-3 py-1.5 text-left flex items-center gap-2 cursor-pointer ${
                  isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Sliders size={13} />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  onOpenShortcuts();
                  setShowMoreMenu(false);
                }}
                className={`w-full px-3 py-1.5 text-left flex items-center gap-2 cursor-pointer ${
                  isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <HelpCircle size={13} />
                <span>Shortcuts</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
