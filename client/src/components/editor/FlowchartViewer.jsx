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

  const scrollViewportRef = useRef(null);
  const containerRef = useRef(null);
  const nodeRefs = useRef({});
  const [nodePositions, setNodePositions] = useState({});

  // Mouse drag-to-pan state
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

  const isLight = theme === 'light';

  // Drag-to-pan handlers (like Figma, Miro, Lucidchart)
  const handleMouseDown = (e) => {
    // Don't pan if clicking an interactive node or button
    if (e.target.closest('button') || e.target.closest('[data-node-block]')) {
      return;
    }
    // Left click or middle click
    if (e.button !== 0 && e.button !== 1) return;

    setIsPanning(true);
    if (scrollViewportRef.current) {
      panStartRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        scrollLeft: scrollViewportRef.current.scrollLeft,
        scrollTop: scrollViewportRef.current.scrollTop,
      };
    }
  };

  useEffect(() => {
    if (!isPanning) return;

    const onMouseMove = (e) => {
      if (!scrollViewportRef.current) return;
      e.preventDefault();
      const dx = e.clientX - panStartRef.current.startX;
      const dy = e.clientY - panStartRef.current.startY;
      scrollViewportRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
      scrollViewportRef.current.scrollTop = panStartRef.current.scrollTop - dy;
    };

    const onMouseUp = () => {
      setIsPanning(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isPanning]);

  // Support Ctrl/Cmd + Mouse Wheel Zoom
  useEffect(() => {
    const el = scrollViewportRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoomScale((prev) => Math.min(1.5, Math.max(0.6, Number((prev + delta).toFixed(1)))));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

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

  // Measure node positions for pixel-perfect SVG connector drawing (scale-invariant)
  const updatePositions = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const scale = zoomScale || 1;
    const positions = {};

    flowchartNodes.forEach((node) => {
      const el = nodeRefs.current[node.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        const left = (rect.left - containerRect.left) / scale;
        const top = (rect.top - containerRect.top) / scale;
        const width = rect.width / scale;
        const height = rect.height / scale;

        positions[node.id] = {
          x: left + width / 2,
          y: top + height / 2,
          top: top,
          bottom: top + height,
          left: left,
          right: left + width,
          width: width,
          height: height,
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
    <div className={`h-full min-h-0 flex flex-col overflow-hidden font-sans transition-colors ${
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
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white font-semibold'
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
            Step <span className="font-bold text-blue-600 dark:text-blue-400">{currentNodeIndex + 1}</span> of {flowchartNodes.length}
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

      {/* 2. Interactive Flowchart Blueprint Canvas (Supports mouse wheel scroll & click-and-drag pan) */}
      <div
        ref={scrollViewportRef}
        onMouseDown={handleMouseDown}
        className={`flex-1 min-h-0 overflow-auto relative p-8 select-none scrollbar-thin transition-colors ${
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        } ${
          isLight
            ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]'
            : 'bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px]'
        }`}
      >
        <div
          ref={containerRef}
          className="relative mx-auto flex flex-col items-center py-6 transition-transform duration-150 origin-top"
          style={{
            transform: `scale(${zoomScale})`,
            width: '640px',
            marginBottom: zoomScale > 1 ? `${Math.round((zoomScale - 1) * 750 + 60)}px` : '40px',
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
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#3b82f6" />
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
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#3b82f6" />
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

              // 1. Orthogonal Loop Back (re-entering Decision diamond from the left)
              if (conn.type === 'loop') {
                const cornerX = pFrom.left - 55;
                const pathD = `M ${pFrom.left} ${pFrom.y} L ${cornerX} ${pFrom.y} L ${cornerX} ${pTo.y} L ${pTo.left} ${pTo.y}`;

                return (
                  <g key={`loop-${idx}`} className="transition-all">
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth={isFromActive ? '2.5' : '1.8'}
                      strokeDasharray={isFromActive ? '4,4' : 'none'}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className={isFromActive ? 'animate-pulse' : ''}
                      markerEnd="url(#flow-arrow-loop)"
                    />
                    {/* Floating Badge */}
                    <rect
                      x={cornerX - 32}
                      y={(pFrom.y + pTo.y) / 2 - 10}
                      width="54"
                      height="20"
                      rx="5"
                      fill={isLight ? '#eff6ff' : '#0f172a'}
                      stroke="#3b82f6"
                      strokeWidth="1.2"
                    />
                    <text
                      x={cornerX - 5}
                      y={(pFrom.y + pTo.y) / 2 + 4}
                      fill="#3b82f6"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      ↻ Loop
                    </text>
                  </g>
                );
              }

              // 2. Decision False Branch (exiting right tip of diamond, bypassing loop body)
              if (conn.type === 'false') {
                const cornerX = pFrom.right + 55;
                const pathD = `M ${pFrom.right} ${pFrom.y} L ${cornerX} ${pFrom.y} L ${cornerX} ${pTo.y} L ${pTo.right} ${pTo.y}`;

                return (
                  <g key={`false-${idx}`} className="transition-all">
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth={isFromActive ? '2.5' : '1.8'}
                      strokeDasharray="4,3"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      markerEnd="url(#flow-arrow-false)"
                    />
                    {/* Fork label at diamond right exit point */}
                    <text
                      x={pFrom.right + 6}
                      y={pFrom.y - 6}
                      fill="#f43f5e"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      False ➔
                    </text>
                    {/* Floating Badge on corridor */}
                    <rect
                      x={cornerX - 12}
                      y={(pFrom.y + pTo.y) / 2 - 10}
                      width="56"
                      height="20"
                      rx="5"
                      fill={isLight ? '#fff1f2' : '#2a0a10'}
                      stroke="#f43f5e"
                      strokeWidth="1.2"
                    />
                    <text
                      x={cornerX + 16}
                      y={(pFrom.y + pTo.y) / 2 + 4}
                      fill="#f43f5e"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      ✗ False
                    </text>
                  </g>
                );
              }

              // 3. Decision True Branch (going straight down to loop body)
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
                    {/* Fork label right below diamond bottom tip */}
                    <text
                      x={pFrom.x + 8}
                      y={pFrom.bottom + 12}
                      fill="#10b981"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      True ↓
                    </text>
                    <rect
                      x={pFrom.x + 8}
                      y={(pFrom.bottom + pTo.top) / 2 - 10}
                      width="52"
                      height="20"
                      rx="5"
                      fill={isLight ? '#ecfdf5' : '#062d1f'}
                      stroke="#10b981"
                      strokeWidth="1.2"
                    />
                    <text
                      x={pFrom.x + 34}
                      y={(pFrom.bottom + pTo.top) / 2 + 4}
                      fill="#10b981"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="sans-serif"
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
                  stroke={isPathActive ? '#3b82f6' : isLight ? '#cbd5e1' : '#3f3f46'}
                  strokeWidth={isPathActive ? '2.2' : '1.5'}
                  markerEnd={isPathActive ? 'url(#flow-arrow-active)' : 'url(#flow-arrow-default)'}
                />
              );
            })}
          </svg>

          {/* Authentic Flowchart Nodes Stack */}
          <div className="flex flex-col items-center gap-7 w-full z-10 relative">
            {flowchartNodes.map((node, index) => {
              const isActive = index === currentNodeIndex;
              const isSelected = selectedNodeId === node.id;

              const isTerminal = node.type === 'terminal';
              const isDecision = node.type === 'decision';
              const isIO = node.type === 'io';

              return (
                <div
                  key={node.id}
                  data-node-block="true"
                  ref={(el) => {
                    nodeRefs.current[node.id] = el;
                  }}
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    setCurrentNodeIndex(index);
                    if (onSelectNode) onSelectNode(node);
                  }}
                  className={`group relative transition-all duration-200 cursor-pointer ${
                    isSelected ? 'scale-105' : ''
                  }`}
                >
                  {/* Active Indicator Pulse Ring */}
                  {isActive && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 z-20">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 text-[9px] text-white font-bold items-center justify-center">
                        ✓
                      </span>
                    </span>
                  )}

                  {/* ──────────────── 1. TERMINAL: STADIUM / CAPSULE SHAPE ──────────────── */}
                  {isTerminal && (() => {
                    const isStart = node.id === 'start' || node.label.toLowerCase().includes('start') || node.label.toLowerCase().includes('entry');
                    return (
                      <div className={`w-52 h-11 rounded-full border-2 flex items-center justify-center px-4 transition-all shadow-xs ${
                        isActive
                          ? isStart
                            ? isLight
                              ? 'border-emerald-600 bg-emerald-100 text-emerald-950 font-bold'
                              : 'border-emerald-400 bg-emerald-500/25 text-white font-bold ring-2 ring-emerald-500/30'
                            : isLight
                            ? 'border-rose-600 bg-rose-100 text-rose-950 font-bold'
                            : 'border-rose-400 bg-rose-500/25 text-white font-bold ring-2 ring-rose-500/30'
                          : isStart
                          ? isLight
                            ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold'
                            : 'border-emerald-500/50 bg-[#06241a] text-emerald-200'
                          : isLight
                          ? 'border-rose-400 bg-rose-50/80 text-rose-900 font-semibold'
                          : 'border-rose-500/50 bg-[#250e14] text-rose-200'
                      }`}>
                        <div className="flex items-center gap-2 text-xs font-semibold">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${isStart ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          <span>{node.label}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ──────────────── 2. DECISION: TRUE DIAMOND (RHOMBUS) SHAPE ──────────────── */}
                  {isDecision && (
                    <div className="relative w-64 h-28 flex items-center justify-center select-none">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 256 112">
                        <polygon
                          points="128,4 252,56 128,108 4,56"
                          className={`transition-all duration-200 ${
                            isActive
                              ? isLight ? 'stroke-amber-600 fill-amber-100 stroke-[2.5]' : 'stroke-amber-400 fill-amber-500/25 stroke-[2.5]'
                              : isLight ? 'stroke-amber-500 fill-amber-50 stroke-2' : 'stroke-amber-500/60 fill-[#16120b] stroke-2'
                          }`}
                        />
                      </svg>
                      <div className="relative z-10 px-8 py-2 text-center flex flex-col items-center justify-center max-w-[200px]">
                        <span className={`text-xs font-bold leading-tight ${isLight ? 'text-amber-950' : 'text-amber-100'}`}>
                          {node.label.replace(' (Condition check)', '')}
                        </span>
                        {node.code && (
                          <code className={`text-[11px] font-mono mt-1 px-1.5 py-0.5 rounded font-semibold ${
                            isLight ? 'bg-amber-200/60 text-amber-900' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {node.code}
                          </code>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ──────────────── 3. I/O: SLANTED PARALLELOGRAM SHAPE ──────────────── */}
                  {isIO && (
                    <div className="relative w-60 h-13 flex items-center justify-center select-none">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 240 52">
                        <polygon
                          points="24,3 237,3 216,49 3,49"
                          className={`transition-all duration-200 ${
                            isActive
                              ? isLight ? 'stroke-cyan-600 fill-cyan-100 stroke-[2.5]' : 'stroke-cyan-400 fill-cyan-500/25 stroke-[2.5]'
                              : isLight ? 'stroke-cyan-500 fill-cyan-50 stroke-2' : 'stroke-cyan-500/60 fill-[#091824] stroke-2'
                          }`}
                        />
                      </svg>
                      <div className="relative z-10 px-8 py-1.5 text-center flex flex-col items-center justify-center">
                        <span className={`text-xs font-semibold ${isLight ? 'text-cyan-950' : 'text-cyan-100'}`}>
                          {node.label}
                        </span>
                        {node.code && (
                          <code className={`text-[11px] font-mono mt-0.5 ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>
                            {node.code}
                          </code>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ──────────────── 4. PROCESS: CLEAN RECTANGLE SHAPE ──────────────── */}
                  {!isTerminal && !isDecision && !isIO && (
                    <div className={`w-64 min-h-[50px] rounded-[3px] border-2 flex flex-col items-center justify-center p-2.5 text-center transition-all ${
                      isActive
                        ? isLight
                          ? 'border-blue-600 bg-white text-slate-900 shadow-md font-semibold ring-2 ring-blue-500/30'
                          : 'border-blue-400 bg-blue-500/15 text-white font-semibold ring-2 ring-blue-500/20'
                        : isLight
                        ? 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 shadow-xs'
                        : 'border-white/[0.14] bg-[#0c1017] text-zinc-200 hover:border-white/[0.25]'
                    }`}>
                      <span className="text-xs font-medium leading-snug">{node.label}</span>
                      {node.code && (
                        <code className={`text-[11px] font-mono mt-0.5 px-1.5 py-0.2 rounded ${
                          isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/[0.06] text-zinc-400'
                        }`}>
                          {node.code}
                        </code>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Bottom Flowchart Legend (Real Flowchart Symbols) */}
      <div className={`h-8 border-t px-4 flex items-center justify-between text-xs shrink-0 select-none transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-[#0f131a] border-white/[0.06] text-zinc-400'
      }`}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-full border border-emerald-400 bg-emerald-400/20 inline-block" />
            <span className="text-[11px]">Start</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-full border border-rose-400 bg-rose-400/20 inline-block" />
            <span className="text-[11px]">End</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-xs border border-zinc-400 bg-zinc-400/20 inline-block" />
            <span className="text-[11px]">Process (Rectangle)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 border border-amber-400 bg-amber-400/20 inline-block" />
            <span className="text-[11px]">Decision (Rhombus)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 -skew-x-12 border border-cyan-400 bg-cyan-400/20 inline-block" />
            <span className="text-[11px]">I/O (Parallelogram)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-blue-400 font-bold">↻</span>
            <span className="text-[11px]">Loop Back</span>
          </span>
        </div>
      </div>
    </div>
  );
};
