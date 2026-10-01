import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Code2,
  FileCode2,
  Check,
  Settings,
  HelpCircle
} from 'lucide-react';
import { supportedLanguages } from '../../data/languagesCatalog';

export const EditorSidebar = ({
  languages = supportedLanguages,
  activeLanguageId,
  onSelectLanguage,
  isOpen,
  onToggleOpen,
  theme,
  onOpenSettings,
  onOpenShortcuts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const isLight = theme === 'light';

  const filteredLanguages = useMemo(() => {
    return languages.filter((l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [languages, searchQuery]);

  return (
    <div className="flex h-full shrink-0 select-none z-20">
      {/* 1. Slim Activity Rail (44px) */}
      <aside className={`w-11 border-r flex flex-col items-center justify-between py-2.5 shrink-0 transition-colors ${
        isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-[#0a0d14] border-white/[0.08]'
      }`}>
        {/* Top Rail: Language Picker Toggle */}
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            onClick={() => onToggleOpen(!isOpen)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer relative ${
              isOpen
                ? isLight
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200 font-semibold'
                  : 'bg-white/[0.12] text-blue-400 font-semibold'
                : isLight
                ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06]'
            }`}
            title={isOpen ? 'Close Languages (Ctrl+B)' : 'Choose Language (Ctrl+B)'}
          >
            <Code2 size={16} />
            {isOpen && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-blue-500 rounded-r" />
            )}
          </button>
        </div>

        {/* Bottom Rail: Settings & Shortcuts */}
        <div className="flex flex-col items-center gap-1.5 w-full">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06]'
              }`}
              title="Editor Settings"
            >
              <Settings size={15} />
            </button>
          )}
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06]'
              }`}
              title="Keyboard Shortcuts"
            >
              <HelpCircle size={15} />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Clean Dedicated Languages Drawer */}
      {isOpen && (
        <aside className={`w-52 border-r flex flex-col shrink-0 overflow-hidden transition-all duration-150 animate-fade-in ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0f131a] border-white/[0.08] text-slate-100'
        }`}>
          {/* Drawer Header */}
          <div className={`h-9 px-3 border-b flex items-center justify-between shrink-0 ${
            isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#0a0d14] border-white/[0.06]'
          }`}>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
              Languages ({languages.length})
            </span>
            <button
              onClick={() => onToggleOpen(false)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isLight ? 'hover:bg-slate-200 text-slate-400 hover:text-slate-700' : 'hover:bg-white/[0.08] text-zinc-500 hover:text-zinc-200'
              }`}
              title="Close panel (Ctrl+B)"
            >
              <X size={13} />
            </button>
          </div>

          {/* Quick Filter */}
          <div className={`px-2.5 py-1.5 border-b ${isLight ? 'border-slate-100' : 'border-white/[0.04]'}`}>
            <div className="relative flex items-center">
              <Search size={12} className={`absolute left-2.5 pointer-events-none ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter languages..."
                className={`w-full rounded-md pl-7 pr-6 py-1 text-xs outline-none transition-colors border ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 focus:border-slate-300 text-slate-800 placeholder:text-slate-400'
                    : 'bg-zinc-900/60 border-white/[0.06] focus:border-white/[0.18] text-zinc-200 placeholder:text-zinc-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-2 p-0.5 cursor-pointer ${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <X size={10} />
                </button>
              )}
            </div>
          </div>

          {/* Languages List */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isActive = activeLanguageId === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => onSelectLanguage(lang)}
                    className={`w-full group px-2.5 py-2 rounded-md transition-all cursor-pointer flex items-center justify-between gap-2 text-xs text-left ${
                      isActive
                        ? isLight
                          ? 'bg-blue-50 text-blue-950 font-semibold border border-blue-300/80 shadow-xs'
                          : 'bg-blue-500/10 text-blue-300 font-semibold border border-blue-500/20'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode2 size={14} style={{ color: lang.color || '#3b82f6' }} className="shrink-0" />
                      <span className="truncate">{lang.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                        {lang.fileName}
                      </span>
                      {isActive && (
                        <Check size={12} className="text-blue-500 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className={`text-center py-6 text-xs ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>
                No languages found
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};
