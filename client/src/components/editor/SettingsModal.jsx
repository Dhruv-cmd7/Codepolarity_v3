import React from 'react';
import { X, Sliders, Sun, Moon } from 'lucide-react';

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  theme = 'dark',
  onToggleTheme,
}) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  const lightEditorThemes = [
    { id: 'codepolarity-light', name: 'Minimal Light' },
    { id: 'vs', name: 'VS Code Light' },
  ];

  const darkEditorThemes = [
    { id: 'codepolarity-minimal', name: 'Minimal Studio' },
    { id: 'tokyo-night', name: 'Tokyo Night' },
    { id: 'dracula', name: 'Dracula' },
    { id: 'vs-dark', name: 'VS Code Dark' },
  ];

  const currentThemeList = isLight ? lightEditorThemes : darkEditorThemes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in select-none">
      <div className={`w-full max-w-sm rounded-xl shadow-2xl p-5 relative flex flex-col gap-4 text-xs transition-colors border ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#0f131a] border-white/[0.1] text-zinc-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-white/[0.08]'
        }`}>
          <div className="flex items-center gap-2">
            <Sliders size={15} className={isLight ? 'text-slate-600' : 'text-zinc-400'} />
            <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Editor Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <X size={15} />
          </button>
        </div>

        {/* Options Body */}
        <div className="space-y-4">
          {/* 1. Interface Mode Toggle (Light / Dark) */}
          <div>
            <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              Interface Mode
            </label>
            <div className={`flex p-0.5 rounded-lg border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900/80 border-white/[0.08]'
            }`}>
              <button
                onClick={(e) => {
                  if (!isLight && onToggleTheme) onToggleTheme(e);
                }}
                className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
                  isLight
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sun size={13} className={isLight ? 'text-amber-500' : ''} />
                <span>Light</span>
              </button>
              <button
                onClick={(e) => {
                  if (isLight && onToggleTheme) onToggleTheme(e);
                }}
                className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs ${
                  !isLight
                    ? 'bg-white/[0.12] text-white shadow-xs border border-white/[0.1]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Moon size={13} className={!isLight ? 'text-blue-400' : ''} />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* 2. Editor Color Themes */}
          <div>
            <label className={`block font-medium mb-1.5 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              Code Editor Palette
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {currentThemeList.map((t) => {
                const isSelected = isLight
                  ? (settings.theme === t.id || (t.id === 'codepolarity-light' && !settings.theme.includes('vs')))
                  : settings.theme === t.id;

                return (
                  <button
                    key={t.id}
                    onClick={() => onUpdateSettings({ theme: t.id })}
                    className={`p-2 rounded-md border text-left transition-all cursor-pointer text-xs ${
                      isSelected
                        ? isLight
                          ? 'bg-blue-50 border-blue-300 text-blue-950 font-semibold shadow-xs'
                          : 'bg-blue-500/10 border-blue-500/30 text-blue-300 font-semibold'
                        : isLight
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        : 'bg-zinc-900/50 hover:bg-zinc-900 border-white/[0.06] text-zinc-400'
                    }`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Font Size & Tab Size */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                Font Size
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
                className={`w-full rounded-md p-1.5 outline-none cursor-pointer border transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300'
                    : 'bg-zinc-900 border-white/[0.08] text-zinc-200 focus:border-white/[0.18]'
                }`}
              >
                <option value={12}>12px</option>
                <option value={14}>14px</option>
                <option value={16}>16px</option>
              </select>
            </div>

            <div>
              <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                Tab Size
              </label>
              <select
                value={settings.tabSize}
                onChange={(e) => onUpdateSettings({ tabSize: Number(e.target.value) })}
                className={`w-full rounded-md p-1.5 outline-none cursor-pointer border transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300'
                    : 'bg-zinc-900 border-white/[0.08] text-zinc-200 focus:border-white/[0.18]'
                }`}
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
              </select>
            </div>
          </div>

          {/* 4. Toggles (Word Wrap, Line Numbers, Minimap) */}
          <div className={`space-y-2.5 pt-2.5 border-t ${
            isLight ? 'border-slate-200' : 'border-white/[0.08]'
          }`}>
            <label className={`flex items-center justify-between cursor-pointer ${
              isLight ? 'text-slate-700' : 'text-zinc-300'
            }`}>
              <span>Word Wrap</span>
              <input
                type="checkbox"
                checked={settings.wordWrap}
                onChange={(e) => onUpdateSettings({ wordWrap: e.target.checked })}
                className={`w-4 h-4 rounded cursor-pointer ${isLight ? 'accent-slate-900' : 'accent-blue-500'}`}
              />
            </label>

            <label className={`flex items-center justify-between cursor-pointer ${
              isLight ? 'text-slate-700' : 'text-zinc-300'
            }`}>
              <span>Line Numbers</span>
              <input
                type="checkbox"
                checked={settings.lineNumbers}
                onChange={(e) => onUpdateSettings({ lineNumbers: e.target.checked })}
                className={`w-4 h-4 rounded cursor-pointer ${isLight ? 'accent-slate-900' : 'accent-blue-500'}`}
              />
            </label>

            <label className={`flex items-center justify-between cursor-pointer ${
              isLight ? 'text-slate-700' : 'text-zinc-300'
            }`}>
              <span>Show Minimap</span>
              <input
                type="checkbox"
                checked={settings.minimap}
                onChange={(e) => onUpdateSettings({ minimap: e.target.checked })}
                className={`w-4 h-4 rounded cursor-pointer ${isLight ? 'accent-slate-900' : 'accent-blue-500'}`}
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 font-semibold rounded-md transition-all cursor-pointer text-xs shadow-sm ${
              isLight
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-white hover:bg-zinc-200 text-zinc-950 font-medium'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
