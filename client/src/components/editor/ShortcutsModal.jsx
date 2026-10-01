import React from 'react';
import { X, Keyboard } from 'lucide-react';

export const ShortcutsModal = ({ isOpen, onClose, theme = 'dark' }) => {
  if (!isOpen) return null;

  const isLight = theme === 'light';

  const shortcuts = [
    { key: 'Ctrl + Enter', desc: 'Run Code' },
    { key: 'Ctrl + S', desc: 'Save Snippet' },
    { key: 'Ctrl + B', desc: 'Toggle Sidebar' },
    { key: 'Ctrl + F', desc: 'Find' },
    { key: 'Ctrl + H', desc: 'Replace' },
    { key: 'Ctrl + /', desc: 'Toggle Comment' },
    { key: 'Ctrl + Space', desc: 'IntelliSense' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in select-none">
      <div className={`w-full max-w-sm rounded-xl shadow-2xl p-5 relative flex flex-col gap-3.5 text-xs transition-colors border ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#0f131a] border-white/[0.1] text-zinc-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-white/[0.08]'
        }`}>
          <div className="flex items-center gap-2">
            <Keyboard size={15} className={isLight ? 'text-slate-600' : 'text-zinc-400'} />
            <h3 className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Keyboard Shortcuts
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

        {/* Shortcuts List */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5 scrollbar-thin">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2 rounded-md border transition-colors ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-zinc-900/50 border-white/[0.06] text-zinc-300'
              }`}
            >
              <span>{s.desc}</span>
              <kbd className={`px-2 py-0.5 rounded font-mono text-[10px] border shadow-2xs ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-700'
                  : 'bg-zinc-800 border-white/[0.1] text-zinc-300'
              }`}>
                {s.key}
              </kbd>
            </div>
          ))}
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
