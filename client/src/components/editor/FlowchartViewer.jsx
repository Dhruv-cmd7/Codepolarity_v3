import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Terminal,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Repeat,
  ArrowRight
} from 'lucide-react';

export const FlowchartViewer = ({
  flowchartNodes = [],
  activeStepNodeId = null,
  onSelectNode,
  theme,
}) => {
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const [nodePositions, setNodePositions] = useState({});

  const isLight = theme === 'light';

  // Sync active node index when activeStepNodeId changes externally
  useEffect(() => {
    if (activeStepNodeId) {
      const idx = flowchartNodes.findIndex((n) => n.id === activeStepNodeId);
      if (idx !== -1) {
        setCurrentNodeIndex(idx);
      }
    }
  }, [activeStepNodeId, flowchartNodes]);

  // Auto-stepping loop
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentNodeIndex((prev) => {
          if (prev >= flowchartNodes.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, flowchartNodes.length]);

  // Measure node positions for pixel-perfect SVG connector drawing
  const updatePositions = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const positions = {};

    flowchartNodes.forEach((node) => {
      const el = nodeRefs.current[node.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        positions[node.id] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
          top: rect.top - containerRect.top,
          bottom: rect.bottom - containerRect.top,
          left: rect.left - containerRect.left,
          right: rect.right - containerRect.left,
          width: rect.width,
          height: rect.height,
        };
      }
    });

    setNodePositions(positions);
  };

  useEffect(() => {
    updatePositions();
    const timer = setTimeout(updatePositions, 100);
    window.addEventListener('resize', updatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
    };
  }, [flowchartNodes, zoomScale]);

  // Scroll active node into view smoothly
  useEffect(() => {
    const activeNode = flowchartNodes[currentNodeIndex];
    if (activeNode && nodeRefs.current[activeNode.id]) {
      nodeRefs.current[activeNode.id].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentNodeIndex]);

  // Build connection links
  const connections = useMemo(() => {
    const links = [];
    const nodeIndexMap = {};
    flowchartNodes.forEach((node, idx) => {
      nodeIndexMap[node.id] = idx;
    });

    flowchartNodes.forEach((node, idx) => {
      if (node.type === 'decision') {
        if (node.nextTrue) {
          links.push({
            from: node.id,
            to: node.nextTrue,
            type: 'true',
            label: 'True (Execute)',
            color: '#10b981',
          });
        }
        if (node.nextFalse) {
          links.push({
            from: node.id,
            to: node.nextFalse,
            type: 'false',
            label: 'False (Exit)',
            color: '#f43f5e',
          });
        }
      } else if (node.next) {
        const targetIdx = nodeIndexMap[node.next];
        const isLoopBack = targetIdx !== undefined && targetIdx <= idx;
        links.push({
          from: node.id,
          to: node.next,
          type: isLoopBack ? 'loop' : 'direct',
          label: isLoopBack ? 'Loop Back' : '',
          color: isLoopBack ? '#3b82f6' : isLight ? '#94a3b8' : '#475569',
        });
      }
    });

    return links;
  }, [flowchartNodes, isLight]);

  if (!flowchartNodes || flowchartNodes.length === 0) {
    return (
      <div className={`h-full flex items-center justify-center text-xs ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>
        No flowchart generated for this script
      </div>
    );
  }

  const activeNode = flowchartNodes[currentNodeIndex];

  return (
    <div className={`h-full flex flex-col overflow-hidden select-none font-sans transition-colors ${
      isLight ? 'bg-slate-50/60 text-slate-800' : 'bg-[#0a0b10] text-zinc-200'
    }`}>
      {/* 1. Header Toolbar with Step-Through Controls & Zoom */}
      <div className={`h-11 border-b px-3 flex items-center justify-between shrink-0 transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0d0e14] border-white/[0.08]'
      }`}>
        {/* Left: Execution Step Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentNodeIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentNodeIndex === 0}
            className={`p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-40 ${
              isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/[0.08] text-zinc-300'
            }`}
            title="Previous Step"
          >
            <ChevronLeft size={14} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isPlaying
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : isLight
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
            }`}
            title={isPlaying ? 'Pause Auto Step' : 'Auto Step Flowchart'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} className="fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Auto Step'}</span>
          </button>

          <button
            onClick={() => setCurrentNodeIndex((prev) => Math.min(flowchartNodes.length - 1, prev + 1))}
            disabled={currentNodeIndex === flowchartNodes.length - 1}
            className={`p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-40 ${
              isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/[0.08] text-zinc-300'
            }`}
            title="Next Step"
          >
            <ChevronRight size={14} />
          </button>

          <button
            onClick={() => {
              setCurrentNodeIndex(0);
              setIsPlaying(false);
            }}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/[0.08] text-zinc-400'
            }`}
            title="Reset to Start"
          >
            <RotateCcw size={13} />
          </button>

          <div className={`h-3.5 w-[1px] mx-1 ${isLight ? 'bg-slate-200' : 'bg-white/[0.08]'}`} />

          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
            isLight ? 'bg-slate-100 text-slate-600' : 'bg-zinc-800/80 text-zinc-400'
          }`}>
            Step <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentNodeIndex + 1}</span> of {flowchartNodes.length}
          </span>
        </div>

        {/* Right: Zoom & Reset Fit Controls */}
        <div className="flex items-center gap-1">
          <div className={`flex items-center p-0.5 rounded-md border text-xs ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-white/[0.08]'
          }`}>
            <button
              onClick={() => setZoomScale((s) => Math.max(0.7, Number((s - 0.1).toFixed(1))))}
              className={`p-1 rounded cursor-pointer ${isLight ? 'hover:bg-white text-slate-600' : 'hover:bg-white/[0.1] text-zinc-300'}`}
              title="Zoom Out"
            >
              <ZoomOut size={12} />
            </button>
            <span className="px-1.5 font-mono text-[10px] min-w-[36px] text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((s) => Math.min(1.4, Number((s + 0.1).toFixed(1))))}
              className={`p-1 rounded cursor-pointer ${isLight ? 'hover:bg-white text-slate-600' : 'hover:bg-white/[0.1] text-zinc-300'}`}
              title="Zoom In"
            >
              <ZoomIn size={12} />
            </button>
          </div>

          <button
            onClick={() => setZoomScale(1)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/[0.08] text-zinc-400'
            }`}
            title="Reset Zoom to 100%"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* 2. Interactive Flowchart Blueprint Canvas */}
      <div
        className={`flex-1 overflow-auto relative p-8 transition-all scrollbar-thin ${
          isLight
            ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]'
            : 'bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px]'
        }`}
      >
        <div
          ref={containerRef}
          className="relative mx-auto flex flex-col items-center py-6 min-h-full transition-transform duration-150 origin-top"
          style={{
            transform: `scale(${zoomScale})`,
            width: '640px',
          }}
        >
          {/* SVG Overlay: Real Branch Lines, Loop-Back Curves & Arrows */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
            style={{ width: '100%', height: '100%' }}
          >
            <defs>
              {/* Arrowhead Markers */}
              <marker
                id="flow-arrow-default"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill={isLight ? '#94a3b8' : '#475569'} />
              </marker>

              <marker
                id="flow-arrow-active"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
              </marker>

              <marker
                id="flow-arrow-true"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981" />
              </marker>

              <marker
                id="flow-arrow-false"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#f43f5e" />
              </marker>

              <marker
                id="flow-arrow-loop"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#3b82f6" />
              </marker>
            </defs>

            {/* Render Flowchart Connecting Paths */}
            {connections.map((conn, idx) => {
              const pFrom = nodePositions[conn.from];
              const pTo = nodePositions[conn.to];
              if (!pFrom || !pTo) return null;

              const isFromActive = activeNode && activeNode.id === conn.from;

              // 1. Loop Back Curve (re-entering earlier node)
              if (conn.type === 'loop') {
                const offsetX = pFrom.left - 55;
                const pathD = `M ${pFrom.left} ${pFrom.y} 
                               C ${offsetX} ${pFrom.y}, ${offsetX} ${pTo.y}, ${pTo.left} ${pTo.y}`;

                return (
                  <g key={`loop-${idx}`} className="transition-all">
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth={isFromActive ? '2.5' : '1.8'}
                      strokeDasharray={isFromActive ? '4,4' : 'none'}
                      className={isFromActive ? 'animate-pulse' : ''}
                      markerEnd="url(#flow-arrow-loop)"
                    />
                    {/* Floating Badge */}
                    <rect
                      x={offsetX - 32}
                      y={(pFrom.y + pTo.y) / 2 - 10}
                      width="52"
                      height="18"
                      rx="4"
                      fill={isLight ? '#eff6ff' : '#172554'}
                      stroke="#3b82f6"
                      strokeWidth="1"
                    />
                    <text
                      x={offsetX - 6}
                      y={(pFrom.y + pTo.y) / 2 + 3}
                      fill="#3b82f6"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      ↻ LOOP
                    </text>
                  </g>
                );
              }

              // 2. Decision False Branch (bypassing loop body to exit)
              if (conn.type === 'false') {
                const offsetX = pFrom.right + 55;
                const pathD = `M ${pFrom.right} ${pFrom.y} 
                               C ${offsetX} ${pFrom.y}, ${offsetX} ${pTo.y}, ${pTo.right} ${pTo.y}`;

                return (
                  <g key={`false-${idx}`} className="transition-all">
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth={isFromActive ? '2.5' : '1.8'}
                      strokeDasharray="4,3"
                      markerEnd="url(#flow-arrow-false)"
                    />
                    {/* Floating Badge */}
                    <rect
                      x={offsetX - 10}
                      y={(pFrom.y + pTo.y) / 2 - 10}
                      width="54"
                      height="18"
                      rx="4"
                      fill={isLight ? '#fff1f2' : '#4c0519'}
                      stroke="#f43f5e"
                      strokeWidth="1"
                    />
                    <text
                      x={offsetX + 17}
                      y={(pFrom.y + pTo.y) / 2 + 3}
                      fill="#f43f5e"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      ✗ False
                    </text>
                  </g>
                );
              }

              // 3. Decision True Branch (going down to loop body)
              if (conn.type === 'true') {
                return (
                  <g key={`true-${idx}`}>
                    <path
                      d={`M ${pFrom.x} ${pFrom.bottom} L ${pTo.x} ${pTo.top}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={isFromActive ? '2.5' : '2'}
                      markerEnd="url(#flow-arrow-true)"
                    />
                    <rect
                      x={pFrom.x + 8}
                      y={(pFrom.bottom + pTo.top) / 2 - 9}
                      width="48"
                      height="18"
                      rx="4"
                      fill={isLight ? '#ecfdf5' : '#064e3b'}
                      stroke="#10b981"
                      strokeWidth="1"
                    />
                    <text
                      x={pFrom.x + 32}
                      y={(pFrom.bottom + pTo.top) / 2 + 4}
                      fill="#10b981"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      ✓ True
                    </text>
                  </g>
                );
              }

              // 4. Standard Sequential Connection
              const isPathActive = isFromActive;
              return (
                <path
                  key={`direct-${idx}`}
                  d={`M ${pFrom.x} ${pFrom.bottom} L ${pTo.x} ${pTo.top}`}
                  fill="none"
                  stroke={isPathActive ? '#10b981' : isLight ? '#cbd5e1' : '#3f3f46'}
                  strokeWidth={isPathActive ? '2.2' : '1.5'}
                  markerEnd={isPathActive ? 'url(#flow-arrow-active)' : 'url(#flow-arrow-default)'}
                />
              );
            })}
          </svg>

          {/* Flowchart Nodes Stack */}
          <div className="flex flex-col items-center gap-9 w-full z-10 relative">
            {flowchartNodes.map((node, index) => {
              const isActive = index === currentNodeIndex;
              const isSelected = selectedNodeId === node.id;

              // Shape & Styling categorization
              const isTerminal = node.type === 'terminal';
              const isDecision = node.type === 'decision';
              const isIO = node.type === 'io';

              return (
                <div
                  key={node.id}
                  ref={(el) => {
                    nodeRefs.current[node.id] = el;
                  }}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    setCurrentNodeIndex(index);
                    if (onSelectNode) onSelectNode(node);
                  }}
                  className={`group relative w-80 p-3.5 transition-all duration-200 cursor-pointer ${
                    isTerminal
                      ? isLight
                        ? 'rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 text-blue-950 px-6 text-center shadow-xs'
                        : 'rounded-full bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border-2 border-blue-500/60 text-blue-100 px-6 text-center'
                      : isDecision
                      ? isLight
                        ? 'rounded-2xl bg-amber-50/90 border-2 border-amber-400 text-amber-950 shadow-xs'
                        : 'rounded-2xl bg-amber-950/30 border-2 border-amber-500/60 text-amber-100'
                      : isIO
                      ? isLight
                        ? 'rounded-xl bg-emerald-50/80 border-2 border-emerald-400 text-emerald-950 shadow-xs'
                        : 'rounded-xl bg-emerald-950/30 border-2 border-emerald-500/50 text-emerald-100'
                      : isLight
                      ? 'rounded-xl bg-white border border-slate-200/90 text-slate-800 shadow-sm hover:border-slate-300'
                      : 'rounded-xl bg-[#12141f] border border-white/[0.08] text-zinc-100 hover:border-white/[0.16]'
                  } ${
                    isActive
                      ? isLight
                        ? 'ring-4 ring-emerald-500/30 border-emerald-500 shadow-lg scale-102'
                        : 'ring-4 ring-emerald-400/30 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.3)] scale-102'
                      : ''
                  } ${isSelected ? 'outline-2 outline-blue-500' : ''}`}
                >
                  {/* Active Indicator Pulse Ring */}
                  {isActive && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] text-white font-bold items-center justify-center">
                        ✓
                      </span>
                    </span>
                  )}

                  {/* Node Header Pill & Index */}
                  <div className={`flex items-center justify-between gap-2 mb-1.5 ${isTerminal ? 'justify-center' : ''}`}>
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                      isTerminal
                        ? isLight ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/50 text-blue-300'
                        : isDecision
                        ? isLight ? 'bg-amber-100 text-amber-900' : 'bg-amber-900/50 text-amber-300'
                        : isIO
                        ? isLight ? 'bg-emerald-100 text-emerald-900' : 'bg-emerald-900/50 text-emerald-300'
                        : isLight ? 'bg-slate-100 text-slate-700' : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {isTerminal ? (index === 0 ? 'Start' : 'End') : isDecision ? '◆ Decision' : isIO ? '▲ Output (IO)' : '■ Process'}
                    </span>

                    {!isTerminal && (
                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                        #{index + 1}
                      </span>
                    )}
                  </div>

                  {/* Main Node Label */}
                  <div className={`text-xs font-semibold leading-snug ${isTerminal ? 'text-center' : ''}`}>
                    {node.label}
                  </div>

                  {/* Syntax Code Pill */}
                  {node.code && (
                    <div className={`mt-2 p-1.5 rounded-md font-mono text-[11px] border overflow-x-auto ${
                      isLight
                        ? 'bg-slate-100/80 border-slate-200 text-slate-900'
                        : 'bg-black/50 border-white/[0.06] text-zinc-200'
                    }`}>
                      <code>{node.code}</code>
                    </div>
                  )}

                  {/* Decision Branch Clues */}
                  {isDecision && (
                    <div className={`mt-2 pt-1.5 flex items-center justify-between text-[10px] font-mono border-t ${
                      isLight ? 'border-amber-200' : 'border-amber-500/20'
                    }`}>
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                        <CheckCircle2 size={11} /> True: Body
                      </span>
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-bold">
                        False: Exit <XCircle size={11} />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Bottom Flowchart Legend */}
      <div className={`h-7 border-t px-3 flex items-center justify-between text-[11px] font-mono shrink-0 select-none transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#0d0e14] border-white/[0.06] text-zinc-400'
      }`}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span className="font-sans text-[10px]">Start/End</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-slate-400 inline-block" />
            <span className="font-sans text-[10px]">Process</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rotate-45 bg-amber-500 inline-block" />
            <span className="font-sans text-[10px]">Decision</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-emerald-500 inline-block" />
            <span className="font-sans text-[10px]">Output</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-blue-500 font-bold">↻</span>
            <span className="font-sans text-[10px]">Loop Back</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span>Click any block to inspect</span>
        </div>
      </div>
    </div>
  );
};
