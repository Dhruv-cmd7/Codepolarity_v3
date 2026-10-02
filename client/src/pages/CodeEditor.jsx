import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  FileCode2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { EditorSidebar } from '../components/editor/EditorSidebar';
import { OutputPanel } from '../components/editor/OutputPanel';
import { SettingsModal } from '../components/editor/SettingsModal';
import { ShortcutsModal } from '../components/editor/ShortcutsModal';
import { defineCustomMonacoThemes } from '../components/editor/editorThemes';
import { supportedLanguages } from '../data/languagesCatalog';
import { apiUrl } from '../config/api';

const CodeEditor = ({ token, user, initialTemplateId, onClearTemplate, setCurrentPage, theme, onToggleTheme }) => {
  const isLight = theme === 'light';

  // Current Active Language (Default to C++)
  const [selectedLang, setSelectedLang] = useState(supportedLanguages[0]);
  const [languageId, setLanguageId] = useState(supportedLanguages[0].id);
  const [code, setCode] = useState(supportedLanguages[0].starterCode);
  const [title, setTitle] = useState(supportedLanguages[0].name + ' Practice');
  const [isModified, setIsModified] = useState(false);
  const [stdin, setStdin] = useState('');
  const [terminalOutput, setTerminalOutput] = useState(supportedLanguages[0].output);

  // Execution & Visualizer States
  const [outputTab, setOutputTab] = useState('trace'); // 'output' | 'flowchart' | 'trace' | 'stdin'
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [executionStats, setExecutionStats] = useState({ timeMs: 12, exitCode: 0 });
  const [saveStatus, setSaveStatus] = useState('');

  // Saved Snippets
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [activeSnippetId, setActiveSnippetId] = useState('');

  // Layout & UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState('split-h');
  const [splitRatio, setSplitRatio] = useState(52);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Editor Settings
  const [settings, setSettings] = useState({
    theme: 'codepolarity-minimal',
    fontSize: 14,
    tabSize: 4,
    minimap: false,
    lineNumbers: true,
    wordWrap: true,
  });

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const splitContainerRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2200);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Draggable Split Pane
  const handleSplitMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingSplit(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingSplit || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      if (newRatio >= 25 && newRatio <= 75) {
        setSplitRatio(newRatio);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingSplit) setIsDraggingSplit(false);
    };

    if (isDraggingSplit) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingSplit]);

  // Load Saved Snippets
  useEffect(() => {
    const fetchSavedSnippets = async () => {
      if (token) {
        try {
          const res = await fetch(apiUrl('/api/editor/snippets'), {
            headers: { 'x-auth-token': token }
          });
          if (res.ok) {
            const data = await res.json();
            setSavedSnippets(data);
            return;
          }
        } catch (err) {
          console.error(err);
        }
      }
      try {
        const local = localStorage.getItem('codepolarity_saved_programs');
        if (local) {
          setSavedSnippets(JSON.parse(local));
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchSavedSnippets();
  }, [token]);

  // Handle Language Switching
  const handleLanguageChange = (newLangId) => {
    const target = supportedLanguages.find(l => l.id === newLangId) || supportedLanguages[0];
    setSelectedLang(target);
    setLanguageId(target.id);
    setCode(target.starterCode);
    setTitle(target.name + ' Program');
    setTerminalOutput(target.output);
    setCurrentStepIndex(0);
    setIsModified(false);
    showToast(`Switched to ${target.name}`);
  };

  const handleSelectLanguageSidebar = (lang) => {
    setSelectedLang(lang);
    setLanguageId(lang.id);
    setCode(lang.starterCode);
    setTitle(lang.name + ' Program');
    setTerminalOutput(lang.output);
    setCurrentStepIndex(0);
    setIsModified(false);
    showToast(`Loaded ${lang.name} playground`);
  };

  // Select Saved Snippet
  const handleSelectSnippet = (snippet) => {
    setCode(snippet.code);
    setTitle(snippet.title);
    setLanguageId(snippet.language || 'cpp');
    const matchedLang = supportedLanguages.find(l => l.id === snippet.language) || supportedLanguages[0];
    setSelectedLang(matchedLang);
    setActiveSnippetId(snippet._id);
    setIsModified(false);
    showToast(`Opened ${snippet.title}`);
  };

  // Create New Blank Snippet
  const handleNewSnippet = () => {
    const starter = `// Write ${selectedLang.name} code here...\n`;
    setCode(starter);
    setTitle('Untitled ' + selectedLang.name);
    setActiveSnippetId('');
    setIsModified(false);
    showToast('New blank file created');
  };

  // Reset Code
  const handleResetCode = () => {
    setCode(selectedLang.starterCode);
    setTerminalOutput(selectedLang.output);
    setCurrentStepIndex(0);
    setIsModified(false);
    showToast('Reset to starter code');
  };

  // Monaco Editor Mounting
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    defineCustomMonacoThemes(monaco);
    const activeMonacoTheme = isLight ? 'codepolarity-light' : settings.theme;
    monaco.editor.setTheme(activeMonacoTheme);

    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({
        line: e.position.lineNumber,
        col: e.position.column
      });
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveCode();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => {
      setSidebarOpen(prev => !prev);
    });
  };

  // Sync Monaco editor theme when theme toggles
  useEffect(() => {
    if (monacoRef.current) {
      try {
        const targetTheme = isLight
          ? 'codepolarity-light'
          : (settings.theme === 'codepolarity-light' ? 'codepolarity-minimal' : settings.theme);
        monacoRef.current.editor.setTheme(targetTheme);
      } catch (err) {
        console.error('Error switching Monaco theme:', err);
      }
    }
  }, [theme, isLight, settings.theme]);

  // Sync active step line in Monaco
  useEffect(() => {
    if (editorRef.current && selectedLang.trace && selectedLang.trace[currentStepIndex]) {
      const activeLine = selectedLang.trace[currentStepIndex].line;
      try {
        editorRef.current.revealLineInCenter(activeLine);
      } catch (e) {}
    }
  }, [currentStepIndex, selectedLang]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveCode();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [code, languageId, title]);

  // Format Code
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
      showToast('Document formatted');
    }
  };

  // Copy Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    showToast('Code copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download Code File
  const handleDownloadCode = () => {
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${selectedLang.ext}`;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  };

  // Run Code (Online Compilation / Simulation)
  const handleRunCode = () => {
    setIsRunning(true);
    const startTime = performance.now();

    setTimeout(() => {
      const duration = Math.floor(Math.random() * 15 + 8);
      setExecutionStats({
        timeMs: duration,
        exitCode: 0
      });

      // Show terminal output
      let simulatedOut = selectedLang.output;
      if (stdin.trim()) {
        simulatedOut = `[Standard Input received: "${stdin.trim()}"]\n\n` + simulatedOut;
      }
      setTerminalOutput(simulatedOut);
      setCurrentStepIndex(0);
      setIsRunning(false);
      showToast('Compilation successful! Program executed.');
    }, 450);
  };

  // Save Snippet
  const handleSaveCode = async () => {
    if (!title.trim()) {
      showToast('Enter a program title');
      return;
    }

    setSaveStatus('saving');
    const newSnippet = {
      _id: activeSnippetId || 'prog_' + Date.now(),
      title,
      code,
      language: languageId,
      updatedAt: new Date().toISOString()
    };

    if (token) {
      try {
        const res = await fetch(apiUrl('/api/editor/save'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            title,
            code,
            language: languageId,
            snippetId: activeSnippetId || undefined
          })
        });
        if (res.ok) {
          const data = await res.json();
          setSavedSnippets(data);
          setSaveStatus('saved');
          setIsModified(false);
          showToast('Saved to Cloud');
          setTimeout(() => setSaveStatus(''), 2000);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Local Storage Save
    try {
      const updated = savedSnippets.some(s => s._id === newSnippet._id)
        ? savedSnippets.map(s => s._id === newSnippet._id ? newSnippet : s)
        : [newSnippet, ...savedSnippets];

      setSavedSnippets(updated);
      localStorage.setItem('codepolarity_saved_programs', JSON.stringify(updated));
      setActiveSnippetId(newSnippet._id);
      setSaveStatus('saved');
      setIsModified(false);
      showToast('Program saved locally');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (e) {
      console.error(e);
      setSaveStatus('');
    }
  };

  // Delete Snippet
  const handleDeleteSnippet = async (id) => {
    if (!confirm('Delete this program?')) return;

    if (token && !id.startsWith('prog_')) {
      try {
        const res = await fetch(apiUrl(`/api/editor/snippets/${id}`), {
          method: 'DELETE',
          headers: { 'x-auth-token': token }
        });
        if (res.ok) {
          const data = await res.json();
          setSavedSnippets(data);
          showToast('Deleted');
          if (activeSnippetId === id) handleNewSnippet();
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    const updated = savedSnippets.filter(s => s._id !== id);
    setSavedSnippets(updated);
    localStorage.setItem('codepolarity_saved_programs', JSON.stringify(updated));
    showToast('Deleted');
    if (activeSnippetId === id) handleNewSnippet();
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden font-sans select-none transition-colors ${
      isLight ? 'bg-[#f0f3f7] text-slate-900' : 'bg-[#0a0d14] text-slate-100'
    }`}>
      {/* Top Unified IDE Command Bar */}
      <EditorToolbar
        title={title}
        setTitle={(newTitle) => {
          setTitle(newTitle);
          setIsModified(true);
        }}
        language={languageId}
        onRunCode={handleRunCode}
        hasTests={false}
        isRunning={isRunning}
        onDownloadCode={handleDownloadCode}
        onCopyCode={handleCopyCode}
        isCopied={isCopied}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        isModified={isModified}
        theme={theme}
        onToggleTheme={onToggleTheme}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Dedicated Languages Explorer */}
        <EditorSidebar
          languages={supportedLanguages}
          activeLanguageId={languageId}
          onSelectLanguage={handleSelectLanguageSidebar}
          isOpen={sidebarOpen}
          onToggleOpen={setSidebarOpen}
          theme={theme}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />

        {/* Center / Right Split Views */}
        <div ref={splitContainerRef} className="flex-1 flex overflow-hidden relative">
          {/* Editor Container */}
          <div
            className={`flex flex-col overflow-hidden transition-colors ${
              isLight ? 'bg-white' : 'bg-[#0a0d14]'
            } ${
              layoutMode === 'editor-only' ? 'w-full h-full' : ''
            }`}
            style={{
              width: layoutMode === 'split-h' ? `${splitRatio}%` : undefined
            }}
          >
            {/* Editor File Tab Header */}
            <div className={`h-11 border-b px-3 flex items-center justify-between shrink-0 select-none transition-colors ${
              isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-[#0f131a] border-white/[0.08]'
            }`}>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-medium tracking-wide transition-colors ${
                  isLight
                    ? 'bg-white text-slate-800 border-slate-200'
                    : 'bg-white/[0.04] text-zinc-200 border-white/[0.08]'
                }`}>
                  <FileCode2 size={13} style={{ color: selectedLang.color || '#3b82f6' }} />
                  <span>{selectedLang.fileName}</span>
                  {isModified && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 ml-0.5 animate-pulse" />}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                  Ln {cursorPos.line}, Col {cursorPos.col}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/[0.03] border-white/[0.08] text-zinc-400'
                }`}>
                  {selectedLang.version}
                </span>
                <button
                  onClick={handleResetCode}
                  className={`flex items-center gap-1.5 text-xs font-sans px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                    isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900' : 'border-white/[0.08] text-zinc-400 hover:border-white/[0.2] hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                  title="Reset to starter program"
                >
                  <RotateCcw size={11} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor Component */}
            <div className={`flex-1 relative overflow-hidden ${isLight ? 'bg-white' : 'bg-[#0a0d14]'}`}>
              <Editor
                height="100%"
                language={selectedLang.monacoLang}
                value={code}
                theme={isLight ? 'codepolarity-light' : settings.theme}
                beforeMount={(monaco) => defineCustomMonacoThemes(monaco)}
                onChange={(val) => {
                  setCode(val || '');
                  setIsModified(true);
                }}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: settings.fontSize,
                  fontFamily: "'Google Sans Code', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                  fontLigatures: true,
                  minimap: { enabled: settings.minimap },
                  lineNumbers: settings.lineNumbers ? 'on' : 'off',
                  wordWrap: settings.wordWrap ? 'on' : 'off',
                  tabSize: settings.tabSize,
                  automaticLayout: true,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  bracketPairColorization: { enabled: true },
                  scrollBeyondLastLine: false,
                  padding: { top: 10, bottom: 10 },
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  renderLineHighlight: 'all',
                }}
                loading={
                  <div className={`h-full flex items-center justify-center text-xs ${
                    isLight ? 'bg-white text-slate-400' : 'bg-[#0a0d14] text-zinc-500'
                  }`}>
                    Loading compiler editor...
                  </div>
                }
              />
            </div>
          </div>

          {/* Draggable Divider Handle */}
          {layoutMode === 'split-h' && (
            <div
              onMouseDown={handleSplitMouseDown}
              className={`w-1 hover:w-1.5 cursor-col-resize transition-all shrink-0 z-20 ${
                isDraggingSplit
                  ? 'bg-blue-500 w-1.5'
                  : isLight
                  ? 'bg-slate-200 hover:bg-blue-400'
                  : 'bg-transparent hover:bg-white/[0.2] active:bg-blue-500'
              }`}
              title="Drag to resize panels"
            />
          )}

          {/* Right Panel: Output, Flowchart, Step Value Trace */}
          {layoutMode !== 'editor-only' && (
            <div className="flex-1 min-h-0 h-full overflow-hidden flex flex-col">
              <OutputPanel
                activeTab={outputTab}
                setActiveTab={setOutputTab}
                language={selectedLang.name}
                terminalOutput={terminalOutput}
                onClearOutput={() => setTerminalOutput('')}
                flowchartNodes={selectedLang.flowchart}
                activeStepNodeId={
                  selectedLang.flowchart && selectedLang.flowchart[currentStepIndex % selectedLang.flowchart.length]?.id
                }
                trace={selectedLang.trace}
                variables={selectedLang.variables}
                currentStepIndex={currentStepIndex}
                onStepChange={setCurrentStepIndex}
                code={code}
                executionStats={executionStats}
                isRunning={isRunning}
                theme={theme}
              />
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings(prev => ({ ...prev, ...newVals }))}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Shortcuts Cheatsheet Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        theme={theme}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-8 right-6 z-50 px-4 py-2 rounded-xl shadow-2xl text-xs flex items-center gap-2.5 animate-fade-in border ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50'
            : 'bg-[#0f131a] border-white/[0.15] text-zinc-100 shadow-black/80'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
          <span className="font-sans font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
