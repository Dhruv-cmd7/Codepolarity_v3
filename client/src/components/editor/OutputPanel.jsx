import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  Terminal,
  GitCommit,
  Sparkles,
  Copy,
  Check,
  RotateCcw
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
      {/* Top Header with Signature Brutalist Tabs */}
      <div className={`h-11 border-b px-3 flex items-center justify-between gap-2 shrink-0 transition-colors ${
        isLight ? 'bg-slate-50/95 border-slate-200' : 'bg-[#0c1017] border-white/[0.08]'
      }`}>
        {/* Sliding Segmented Toggle Control */}
        <div
          ref={containerRef}
          className={`relative inline-flex items-center p-1 rounded-xl border font-mono text-xs font-semibold transition-colors ${
            isLight ? 'bg-slate-200/60 border-slate-200' : 'bg-black/40 border-white/[0.08]'
          }`}
        >
          {/* Sliding Active Pill Background */}
          {indicatorStyle.ready && (
            <div
              className={`absolute top-1 bottom-1 rounded-lg transition-all duration-200 ease-out shadow-xs pointer-events-none ${
                isLight
                  ? 'bg-white border border-slate-200/90 shadow-xs'
                  : 'bg-white/[0.12] border border-white/[0.1] shadow-xs'
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
            className={`relative z-10 py-1.5 px-3.5 text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap select-none font-medium ${
              activeTab === 'output'
                ? isLight ? 'text-slate-950 font-semibold' : 'text-white font-semibold'
                : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Terminal size={13} className="shrink-0 text-blue-400" />
            <span>Output</span>
          </button>

          {/* Option 2: Flowchart */}
          <button
            ref={flowchartTabRef}
            onClick={() => setActiveTab('flowchart')}
            className={`relative z-10 py-1.5 px-3.5 text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap select-none font-medium ${
              activeTab === 'flowchart'
                ? isLight ? 'text-slate-950 font-semibold' : 'text-white font-semibold'
                : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <GitCommit size={13} className="shrink-0 text-emerald-400" />
            <span>Flowchart</span>
          </button>

          {/* Option 3: Visual Execution */}
          <button
            ref={traceTabRef}
            onClick={() => setActiveTab('trace')}
            className={`relative z-10 py-1.5 px-3.5 text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap select-none font-medium ${
              activeTab === 'trace'
                ? isLight ? 'text-blue-700 font-semibold' : 'text-blue-400 font-semibold'
                : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles size={13} className={`shrink-0 ${activeTab === 'trace' ? (isLight ? 'text-blue-600' : 'text-blue-400') : 'text-amber-400'}`} />
            <span>Trace</span>
            {trace.length > 0 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full shrink-0 font-medium ${
                activeTab === 'trace'
                  ? isLight ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-blue-500/25 text-blue-300 border border-blue-500/40'
                  : isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/[0.06] text-zinc-400'
              }`}>
                {trace.length}
              </span>
            )}
          </button>
        </div>

        {/* Right Output Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'output' && (
            <>
              {executionStats && (
                <div className={`hidden sm:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg border ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-700'
                    : 'bg-white/[0.03] border-white/[0.08] text-zinc-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${executionStats.status === 'error' ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                  <span>{executionStats.timeMs}ms</span>
                </div>
              )}
              {onClearOutput && terminalOutput && (
                <button
                  onClick={onClearOutput}
                  className={`p-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                    isLight
                      ? 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                      : 'border-white/[0.08] text-zinc-400 hover:border-white/[0.2] hover:text-white'
                  }`}
                  title="Clear Terminal Output"
                >
                  <RotateCcw size={13} />
                </button>
              )}
              <button
                onClick={handleCopyOutput}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer border ${
                  isLight
                    ? 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    : 'border-white/[0.08] text-zinc-400 hover:border-white/[0.2] hover:text-white'
                }`}
                title="Copy Terminal Output"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Tab Viewport */}
      <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
        {/* ================= 1. TERMINAL OUTPUT TAB ================= */}
        {activeTab === 'output' && (
          <div className={`flex-1 p-4 overflow-y-auto font-mono text-xs select-text scrollbar-thin space-y-2 transition-colors ${
            isLight ? 'bg-white text-slate-800' : 'bg-[#0a0d14] text-zinc-200'
          }`}>
            {isRunning ? (
              <div className={`flex items-center gap-2.5 p-3 rounded-lg border font-mono ${
                isLight ? 'bg-blue-50/70 border-blue-200 text-blue-800' : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              }`}>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span>Compiling and executing runtime...</span>
              </div>
            ) : terminalOutput ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1 border-b border-white/[0.06]">
                  <span className="font-sans font-medium text-zinc-400">Execution Output</span>
                  <span className="text-emerald-400 font-mono">Process completed (exit 0)</span>
                </div>
                <div className={`whitespace-pre-wrap leading-relaxed font-mono ${isLight ? 'text-slate-900 font-medium' : 'text-zinc-200'}`}>
                  {terminalOutput}
                </div>
              </div>
            ) : (
              <div className={`h-full flex flex-col items-center justify-center text-xs gap-2 py-12 ${
                isLight ? 'text-slate-400' : 'text-zinc-600'
              }`}>
                <Terminal size={22} className={isLight ? 'text-slate-300' : 'text-zinc-700'} />
                <p className={`text-xs ${isLight ? 'text-slate-700 font-semibold' : 'text-zinc-300 font-semibold'}`}>
                  Terminal Ready
                </p>
                <span className={`text-[11px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                  Click Run or press ⌘↵ to execute code
                </span>
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

export default OutputPanel;
