import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  Terminal,
  GitCommit,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { FlowchartViewer } from './FlowchartViewer';
import { VariableTraceTable } from './VariableTraceTable';

export const OutputPanel = ({
  activeTab = 'trace',
  setActiveTab,
  language,
  terminalOutput = '',
  onClearOutput,
  flowchartNodes = [],
  activeStepNodeId = null,
  trace = [],
  variables = [],
  currentStepIndex = 0,
  onStepChange,
  code = '',
  executionStats = null,
  isRunning = false,
  theme,
}) => {
  const [copied, setCopied] = useState(false);

  const containerRef = useRef(null);
  const outputTabRef = useRef(null);
  const flowchartTabRef = useRef(null);
  const traceTabRef = useRef(null);

  const tabRefs = {
    output: outputTabRef,
    flowchart: flowchartTabRef,
    trace: traceTabRef,
  };

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeEl = tabRefs[activeTab]?.current;
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          ready: true,
        });
      }
    };

    updateIndicator();

    const container = containerRef.current;
    if (!container) return;

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateIndicator();
      });
      resizeObserver.observe(container);
    }

    window.addEventListener('resize', updateIndicator);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab, trace.length]);

  const isLight = theme === 'light';

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(terminalOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={`h-full flex flex-col border-l overflow-hidden select-none transition-colors ${
      isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0a0d14] border-white/[0.08] text-zinc-200'
    }`}>
      {/* Top Header with Modern Sliding Toggle */}
      <div className={`h-11 border-b px-2.5 flex items-center justify-between shrink-0 transition-colors ${
        isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#0f131a] border-white/[0.08]'
      }`}>
        {/* Sliding Segmented Toggle Control */}
        <div
          ref={containerRef}
          className={`relative flex items-center p-0.5 rounded-lg border text-xs font-medium w-full max-w-sm transition-colors ${
            isLight ? 'bg-slate-200/60 border-slate-200' : 'bg-[#151b26] border-white/[0.06]'
          }`}
        >
          {/* Sliding Active Pill Background */}
          {indicatorStyle.ready && (
            <div
              className={`absolute top-0.5 bottom-0.5 rounded-md transition-all duration-200 ease-out shadow-xs pointer-events-none ${
                isLight
                  ? 'bg-white border border-slate-200/90 shadow-xs'
                  : 'bg-white/[0.14] border border-white/[0.1] shadow-xs'
              }`}
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          )}

          {/* Option 1: Output */}
          <button
            ref={outputTabRef}
            onClick={() => setActiveTab('output')}
            className={`relative z-10 flex-1 py-1 px-2 text-xs rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
              activeTab === 'output'
                ? isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'
                : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal size={12} className="shrink-0" />
            <span className="truncate">Output</span>
          </button>

          {/* Option 2: Flowchart */}
          <button
            ref={flowchartTabRef}
            onClick={() => setActiveTab('flowchart')}
            className={`relative z-10 flex-1 py-1 px-2 text-xs rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
              activeTab === 'flowchart'
                ? isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'
                : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <GitCommit size={12} className="shrink-0" />
            <span className="truncate">Flowchart</span>
          </button>

          {/* Option 3: Visual Execution */}
          <button
            ref={traceTabRef}
            onClick={() => setActiveTab('trace')}
            className={`relative z-10 flex-1 py-1 px-2 text-xs rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-w-0 ${
              activeTab === 'trace'
                ? isLight ? 'text-blue-950 font-bold' : 'text-blue-400 font-semibold'
                : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles size={12} className={`shrink-0 ${activeTab === 'trace' ? (isLight ? 'text-blue-600' : 'text-blue-400') : ''}`} />
            <span className="truncate">Visual Execution</span>
            {trace.length > 0 && (
              <span className={`text-[10px] font-mono px-1 py-0.2 rounded shrink-0 ${
                activeTab === 'trace'
                  ? isLight ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-blue-500/20 text-blue-300'
                  : isLight ? 'text-slate-400' : 'text-zinc-500'
              }`}>
                {trace.length}
              </span>
            )}
          </button>
        </div>

        {/* Right Output Action Buttons */}
        <div className="flex items-center gap-1">
          {activeTab === 'output' && (
            <>
              {executionStats && (
                <span className={`text-[10px] font-mono mr-1.5 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                  {executionStats.timeMs}ms
                </span>
              )}
              <button
                onClick={handleCopyOutput}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06]'
                }`}
                title="Copy Terminal Output"
              >
                {copied ? <Check size={13} className="text-blue-400" /> : <Copy size={13} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Tab Viewport */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {/* ================= 1. TERMINAL OUTPUT TAB ================= */}
        {activeTab === 'output' && (
          <div className={`flex-1 p-3 overflow-y-auto font-mono text-xs select-text scrollbar-thin space-y-2 transition-colors ${
            isLight ? 'bg-white text-slate-800' : 'bg-[#0a0d14] text-zinc-200'
          }`}>
            {isRunning ? (
              <div className={`flex items-center gap-2 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span>Compiling and executing {language?.toUpperCase()} program...</span>
              </div>
            ) : terminalOutput ? (
              <div className={`whitespace-pre-wrap leading-relaxed ${isLight ? 'text-slate-900 font-medium' : 'text-zinc-200'}`}>
                {terminalOutput}
              </div>
            ) : (
              <div className={`h-full flex flex-col items-center justify-center text-xs gap-1.5 ${
                isLight ? 'text-slate-400' : 'text-zinc-600'
              }`}>
                <Terminal size={20} className={isLight ? 'text-slate-300' : 'text-zinc-700'} />
                <p className={isLight ? 'text-slate-600 font-medium' : 'text-zinc-400'}>Program terminal ready</p>
                <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>Click "Run (⌘↵)" to compile and execute</span>
              </div>
            )}
          </div>
        )}

        {/* ================= 2. FLOWCHART TAB ================= */}
        {activeTab === 'flowchart' && (
          <FlowchartViewer
            flowchartNodes={flowchartNodes}
            activeStepNodeId={activeStepNodeId}
            theme={theme}
          />
        )}

        {/* ================= 3. VALUE CHANGE TRACE TABLE TAB (DO NOT TOUCH UI) ================= */}
        {activeTab === 'trace' && (
          <VariableTraceTable
            trace={trace}
            variables={variables}
            currentStepIndex={currentStepIndex}
            onStepChange={onStepChange}
            code={code}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
};
