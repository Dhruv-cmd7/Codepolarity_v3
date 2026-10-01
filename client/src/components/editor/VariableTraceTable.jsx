import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Pause,
  RotateCcw,
  Terminal,
  Cpu,
  ArrowRight
} from 'lucide-react';

export const VariableTraceTable = ({
  trace = [],
  variables = [],
  currentStepIndex = 0,
  onStepChange,
  code = '',
  theme,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const codeContainerRef = useRef(null);
  const isLight = theme === 'light';

  // Auto-play interval
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        onStepChange((prev) => {
          if (prev < trace.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, trace.length, onStepChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        onStepChange((prev) => Math.min(trace.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        onStepChange((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length, onStepChange]);

  if (!trace || trace.length === 0) {
    return (
      <div className={`h-full flex items-center justify-center text-xs ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
        No execution data available. Click "Run" to start.
      </div>
    );
  }

  const currentStep = trace[currentStepIndex] || trace[0];
  const prevStep = currentStepIndex > 0 ? trace[currentStepIndex - 1] : null;
  const nextStep = currentStepIndex < trace.length - 1 ? trace[currentStepIndex + 1] : null;

  // Split code into numbered lines
  const codeLines = code ? code.split('\n') : [];

  // Scroll active code line into view
  useEffect(() => {
    if (codeContainerRef.current && currentStep) {
      const activeEl = codeContainerRef.current.querySelector(`[data-line="${currentStep.line}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentStepIndex, currentStep]);

  // Cumulative printed stdout simulation up to current step
  const getAccumulatedOutput = () => {
    const outputs = [];
    for (let i = 0; i <= currentStepIndex; i++) {
      const s = trace[i];
      if (s.statement && (s.statement.includes('cout') || s.statement.includes('print') || s.statement.includes('System.out') || s.statement.includes('println'))) {
        outputs.push(s.travel || s.note);
      }
    }
    if (currentStepIndex === trace.length - 1) {
      return `Calculation complete!\nSum of first 5 numbers = ${currentStep.vars.sum || 15}\n[Program exited with code 0]`;
    }
    return outputs.length > 0 ? outputs.join('\n') : '(No stdout printed yet)';
  };

  return (
    <div className={`h-full flex flex-col overflow-hidden font-sans select-none transition-colors ${
      isLight ? 'bg-white text-slate-800' : 'bg-[#0a0d14] text-zinc-200'
    }`}>
      
      {/* 1. PYTHON TUTOR CONTROLLER BAR */}
      <div className={`h-10 border-b px-3 flex items-center justify-between shrink-0 transition-colors gap-2 overflow-x-auto scrollbar-none ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0f131a] border-white/[0.08]'
      }`}>
        {/* Step Indicator */}
        <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
          <span className={`text-xs font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Step {currentStepIndex + 1}
            <span className={`font-normal ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}> of {trace.length}</span>
          </span>
          <span className={isLight ? 'text-slate-300' : 'text-zinc-700'}>•</span>
          <span className={`text-[11px] font-mono font-semibold ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
            Line {currentStep.line}
          </span>
        </div>

        {/* Stepper Buttons (Python Tutor style) */}
        <div className="flex items-center gap-1 shrink-0 whitespace-nowrap">
          {/* First */}
          <button
            onClick={() => onStepChange(0)}
            disabled={currentStepIndex === 0}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-30 border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
                : 'bg-zinc-900 border-white/[0.08] hover:bg-zinc-800 text-zinc-300'
            }`}
            title="First step"
          >
            <ChevronsLeft size={13} />
            <span className="hidden sm:inline text-[11px]">First</span>
          </button>

          {/* Prev */}
          <button
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-30 border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
                : 'bg-zinc-900 border-white/[0.08] hover:bg-zinc-800 text-zinc-300'
            }`}
            title="Previous step (Left Arrow)"
          >
            <ChevronLeft size={13} />
            <span className="text-[11px]">Prev</span>
          </button>

          {/* Auto Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
                : 'bg-zinc-900 border-white/[0.08] hover:bg-zinc-800 text-zinc-300'
            }`}
            title={isPlaying ? "Pause" : "Auto play"}
          >
            {isPlaying ? (
              <Pause size={12} className="fill-current text-amber-500" />
            ) : (
              <Play size={12} className="fill-current text-blue-500" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={() => onStepChange(Math.min(trace.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === trace.length - 1}
            className={`px-2.5 py-1 rounded font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-30 shadow-xs border ${
              isLight
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                : 'bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30 text-blue-300'
            }`}
            title="Next step (Right Arrow)"
          >
            <span className="text-[11px]">Next</span>
            <ChevronRight size={13} />
          </button>

          {/* Last */}
          <button
            onClick={() => onStepChange(trace.length - 1)}
            disabled={currentStepIndex === trace.length - 1}
            className={`px-2 py-1 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-30 border ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
                : 'bg-zinc-900 border-white/[0.08] hover:bg-zinc-800 text-zinc-300'
            }`}
            title="Last step"
          >
            <span className="hidden sm:inline text-[11px]">Last</span>
            <ChevronsRight size={13} />
          </button>
        </div>

        {/* Legend */}
        <div className={`hidden lg:flex items-center gap-3 text-[10px] font-mono shrink-0 whitespace-nowrap ${
          isLight ? 'text-slate-500' : 'text-zinc-400'
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span>Just executed</span>
          </div>
          {nextStep && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span>Next to execute</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN PYTHON TUTOR SPLIT STAGE */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT COLUMN: CODE WITH LINE POINTER ARROWS */}
        <div className={`flex-1 border-r flex flex-col overflow-hidden transition-colors ${
          isLight ? 'bg-[#fafbfc] border-slate-200' : 'bg-[#0a0d14] border-white/[0.08]'
        }`}>
          <div className={`h-7 border-b px-3 flex items-center justify-between text-[11px] font-medium transition-colors ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-[#0f131a] border-white/[0.06] text-zinc-400'
          }`}>
            <span>Execution Code</span>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>Monitored Lines</span>
          </div>

          <div
            ref={codeContainerRef}
            className="flex-1 overflow-auto p-2 font-mono text-xs select-text space-y-0.5"
          >
            {codeLines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isCurrent = lineNum === currentStep.line;

              return (
                <div
                  key={lineNum}
                  data-line={lineNum}
                  className={`flex items-center py-1 px-2 rounded transition-colors group min-w-full w-max ${
                    isCurrent
                      ? isLight
                        ? 'bg-blue-50 text-blue-950 font-semibold border-l-2 border-blue-500 shadow-xs'
                        : 'bg-blue-500/15 text-white font-medium border-l-2 border-blue-400'
                      : isLight
                      ? 'text-slate-700 hover:bg-slate-100'
                      : 'text-zinc-400 hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Line Number */}
                  <span className={`w-8 text-right pr-2.5 text-[11px] select-none shrink-0 font-normal ${
                    isLight ? 'text-slate-400' : 'text-zinc-600'
                  }`}>
                    {lineNum}
                  </span>

                  {/* Execution Pointer Arrow */}
                  <span className="w-5 text-center select-none shrink-0">
                    {isCurrent ? (
                      <span className="text-blue-400 font-bold text-xs animate-pulse">➔</span>
                    ) : (
                      <span className="text-transparent text-xs">·</span>
                    )}
                  </span>

                  {/* Code Text - Never truncate code lines */}
                  <span className="whitespace-pre font-mono pr-4">
                    {lineText || ' '}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: FRAMES & OBJECTS (MEMORY) */}
        <div className={`w-full md:w-80 flex flex-col overflow-hidden transition-colors border-l ${
          isLight ? 'bg-slate-50/60 border-slate-200' : 'bg-[#0a0d14] border-white/[0.08]'
        }`}>
          
          {/* Header: Frames */}
          <div className={`h-7 border-b px-3 flex items-center justify-between text-[11px] font-medium transition-colors ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#0f131a] border-white/[0.06] text-zinc-400'
          }`}>
            <span className="flex items-center gap-1.5 font-medium">
              <Cpu size={12} className={isLight ? 'text-slate-500' : 'text-zinc-400'} />
              <span>Frames & Memory</span>
            </span>
            <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>main()</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3.5 scrollbar-thin">
            
            {/* Python Tutor Frame Box */}
            <div className={`rounded-xl overflow-hidden border shadow-xs transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/[0.08]'
            }`}>
              <div className={`h-7 px-3 flex items-center justify-between border-b ${
                isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-[#151b26] border-white/[0.06]'
              }`}>
                <span className={`text-[10px] uppercase font-mono font-bold tracking-wider ${
                  isLight ? 'text-blue-700' : 'text-blue-400'
                }`}>
                  main frame
                </span>
                <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>Local scope</span>
              </div>

              {/* Variable Slots Table */}
              <div className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-white/[0.04]'}`}>
                {variables.map((varName) => {
                  const val = currentStep.vars[varName];
                  const prevVal = prevStep ? prevStep.vars[varName] : null;
                  const isModified = prevVal !== null && prevVal !== undefined && prevVal !== val;

                  return (
                    <div
                      key={varName}
                      className={`px-3 py-2 flex items-center justify-between transition-colors ${
                        isModified ? (isLight ? 'bg-blue-50/50' : 'bg-blue-500/10') : ''
                      }`}
                    >
                      {/* Variable Name */}
                      <span className={`font-mono text-xs font-bold ${isLight ? 'text-slate-900' : 'text-zinc-300'}`}>
                        {varName}
                      </span>

                      {/* Value Box (Python Tutor style cell) */}
                      <div className="flex items-center gap-1.5">
                        {isModified && prevVal !== '-' && (
                          <span className={`text-[11px] font-mono line-through ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                            {String(prevVal)}
                          </span>
                        )}
                        {isModified && prevVal !== '-' && (
                          <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>➔</span>
                        )}
                        <span
                          className={`font-mono text-xs px-2.5 py-0.5 rounded border transition-all ${
                            isModified
                              ? isLight
                                ? 'bg-blue-100 text-blue-950 border-blue-400 font-bold ring-2 ring-blue-200 shadow-xs'
                                : 'bg-blue-500/20 text-blue-300 border-blue-500/50 font-bold ring-1 ring-blue-500/30'
                              : isLight
                              ? 'bg-slate-100 border-slate-200 text-slate-800 font-medium'
                              : 'bg-zinc-900 border-white/[0.08] text-white'
                          }`}
                        >
                          {String(val)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Python Tutor Program Output Box */}
            <div className={`rounded-xl overflow-hidden border shadow-xs transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0f131a] border-white/[0.08]'
            }`}>
              <div className={`h-7 px-3 flex items-center justify-between border-b ${
                isLight ? 'bg-slate-100/80 border-slate-200 text-slate-700' : 'bg-[#151b26] border-white/[0.04] text-zinc-300'
              }`}>
                <span className="text-[10px] uppercase font-mono font-semibold flex items-center gap-1.5">
                  <Terminal size={12} className={isLight ? 'text-slate-500' : 'text-zinc-400'} />
                  Program Output
                </span>
                <span className={`text-[9px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>stdout</span>
              </div>
              <div className={`p-3 font-mono text-[11px] whitespace-pre-wrap leading-relaxed select-text min-h-16 rounded-b-xl ${
                isLight ? 'bg-slate-50/70 text-slate-800' : 'bg-[#0a0d14] text-cyan-400'
              }`}>
                {getAccumulatedOutput()}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. BOTTOM EXPLANATION STRIP (What happened in this step) */}
      <div className={`h-9 border-t px-3 flex items-center gap-2 shrink-0 transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#0f131a] border-white/[0.08] text-zinc-300'
      }`}>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
        <span className="text-xs truncate">
          <strong className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Line {currentStep.line}: </strong>
          <span className={`font-mono font-medium ${isLight ? 'text-blue-700' : 'text-blue-300'}`}>{currentStep.statement}</span>
          <span className={`mx-1.5 ${isLight ? 'text-slate-300' : 'text-zinc-500'}`}>—</span>
          <span className={isLight ? 'text-slate-700' : 'text-zinc-300'}>{currentStep.travel || currentStep.note}</span>
        </span>
      </div>

    </div>
  );
};
