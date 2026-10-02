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
      {/* 1. Slim Activity Rail (44px) matching signature brutalist palette */}
      <aside className={`w-11 border-r flex flex-col items-center justify-between py-3 shrink-0 transition-colors ${
        isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-[#0a0d14] border-white/[0.08]'
      }`}>
        {/* Top Rail: Language Picker Toggle */}
        <div className="flex flex-col items-center gap-2.5 w-full">
          <button
            onClick={() => onToggleOpen(!isOpen)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer relative border ${
              isOpen
                ? isLight
                  ? 'bg-blue-50 border-blue-300 text-blue-600 shadow-xs font-semibold'
                  : 'bg-white/[0.08] border-white/20 text-white font-medium'
                : isLight
                  ? 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
                  : 'border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06]'
            }`}
            title={isOpen ? 'Close Languages (Ctrl+B)' : 'Browse Languages (Ctrl+B)'}
          >
            <Code2 size={15} />
            {isOpen && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-blue-500 rounded-r" />
            )}
          </button>
        </div>

        {/* Bottom Rail: Settings & Shortcuts */}
        <div className="flex flex-col items-center gap-2 w-full">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border border-transparent ${
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
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border border-transparent ${
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
        <aside className={`w-56 border-r flex flex-col shrink-0 overflow-hidden transition-all duration-150 animate-fade-in ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0e131d] border-white/[0.08] text-slate-100'
        }`}>
          {/* Drawer Header */}
          <div className={`h-11 px-3 border-b flex items-center justify-between shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0a0d14] border-white/[0.06]'
          }`}>
            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
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
          <div className={`px-3 py-2 border-b ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-white/[0.04] bg-white/[0.01]'}`}>
            <div className="relative flex items-center">
              <Search size={12} className={`absolute left-2.5 pointer-events-none ${isLight ? 'text-slate-400' : 'text-zinc-500'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter languages..."
                className={`w-full rounded-md pl-7 pr-6 py-1.5 text-xs font-sans outline-none transition-colors border ${
                  isLight
                    ? 'bg-white border-slate-200 focus:border-blue-400 text-slate-800 placeholder:text-slate-400'
                    : 'bg-black/30 border-white/[0.08] focus:border-blue-500/50 text-zinc-200 placeholder:text-zinc-600'
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
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isActive = activeLanguageId === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => onSelectLanguage(lang)}
                    className={`w-full group px-3 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-between gap-2 text-xs text-left border ${
                      isActive
                        ? isLight
                          ? 'bg-blue-50 text-blue-950 font-semibold border-blue-300 shadow-xs'
                          : 'bg-white/[0.08] text-white font-medium border-white/20'
                        : isLight
                          ? 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200'
                          : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] hover:border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode2 size={14} style={{ color: lang.color || '#3b82f6' }} className="shrink-0" />
                      <span className="truncate font-sans">{lang.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                        {lang.ext ? `.${lang.ext.toLowerCase()}` : lang.fileName}
                      </span>
                      {isActive && (
                        <Check size={12} className="text-blue-400 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className={`text-center py-8 text-xs ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                No matching languages found
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};

export default EditorSidebar;
