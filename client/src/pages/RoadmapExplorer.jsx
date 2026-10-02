import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, CheckCircle, Circle, Play, ArrowRight, ExternalLink, CheckCircle2, Terminal } from 'lucide-react';
import { apiUrl } from '../config/api';

const RoadmapExplorer = ({ token, user, onUpdateUser, setCurrentPage, onLoadTemplate }) => {
  const [roadmaps, setRoadmaps] = useState({});
  const [activeRoadmapId, setActiveRoadmapId] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingNode, setTogglingNode] = useState(false);

  useEffect(() => {
    fetchRoadmaps();
  }, [token]);

  useEffect(() => {
    if (user && user.activeRoadmap && roadmaps[user.activeRoadmap]) {
      setActiveRoadmapId(user.activeRoadmap);
      const firstNode = roadmaps[user.activeRoadmap].nodes[0];
      setSelectedNode(firstNode);
    } else if (Object.keys(roadmaps).length > 0) {
      const defaultId = Object.keys(roadmaps)[0];
      setActiveRoadmapId(defaultId);
      setSelectedNode(roadmaps[defaultId].nodes[0]);
    }
  }, [roadmaps, user]);

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/roadmaps'), {
        headers: {
          'x-auth-token': token
        }
      });
      const data = await res.json();
      if (res.ok) {
        setRoadmaps(data);
      } else {
        setError('Failed to fetch roadmaps');
      }
    } catch (err) {
      setError('Connection failed. Backend might be offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoadmap = async (roadmapId) => {
    try {
      const res = await fetch(apiUrl('/api/roadmaps/select'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ roadmapId })
      });
      const data = await res.json();
      if (res.ok) {
        onUpdateUser({
          ...user,
          activeRoadmap: data.activeRoadmap
        });
        setActiveRoadmapId(roadmapId);
        setSelectedNode(roadmaps[roadmapId].nodes[0]);
      }
    } catch (err) {
      console.error('Error selecting roadmap:', err);
    }
  };

  const handleToggleNodeComplete = async (nodeId) => {
    if (togglingNode) return;
    try {
      setTogglingNode(true);
      const res = await fetch(apiUrl('/api/roadmaps/complete-node'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ nodeId })
      });
      const data = await res.json();
      if (res.ok) {
        const updatedUser = {
          ...user,
          completedNodes: data.completedNodes
        };
        onUpdateUser(updatedUser);
        
        if (selectedNode && selectedNode.id === nodeId) {
          setSelectedNode({ ...selectedNode });
        }
      }
    } catch (err) {
      console.error('Error toggling node:', err);
    } finally {
      setTogglingNode(false);
    }
  };

  const handlePracticeInSandbox = (nodeId) => {
    let templateId = 'template-html';
    if (nodeId === 'fe-js-basics') templateId = 'template-revstring';
    if (nodeId === 'ai-python') templateId = 'template-fibonacci';
    if (nodeId === 'be-node-express') templateId = 'template-bubblesort';
    
    if (onLoadTemplate) onLoadTemplate(templateId);
    if (setCurrentPage) setCurrentPage('editor');
  };

  const activeRoadmap = roadmaps[activeRoadmapId];

  // Calculate Progress for Active Roadmap
  const totalNodesCount = activeRoadmap?.nodes?.length || 0;
  const completedCount = activeRoadmap?.nodes?.filter(n => user?.completedNodes?.includes(n.id)).length || 0;
  const progressPercent = totalNodesCount > 0 ? Math.round((completedCount / totalNodesCount) * 100) : 0;

  // Loading View
  if (loading) {
    return (
      <div className="signature-page-container flex items-center justify-center min-h-[80vh]">
        <div className="signature-ambient-glow" aria-hidden="true" />
        <div className="signature-grid-bg" aria-hidden="true" />
        <div className="signature-card text-center max-w-md w-full relative z-10 flex flex-col items-center gap-4 py-12 px-8">
          <div className="signature-badge">
            <span className="signature-bracket">[</span>
            <span>01 // SYLLABUS ENGINE</span>
            <span className="signature-bracket">]</span>
          </div>
          <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin my-2" />
          <h3 className="signature-card-title text-lg font-bold text-zinc-100">Assembling Learning Pathways</h3>
          <p className="text-xs font-mono text-zinc-400">Calibrating engineering curriculum nodes...</p>
        </div>
      </div>
    );
  }

  // Error View
  if (error) {
    return (
      <div className="signature-page-container flex items-center justify-center min-h-[80vh]">
        <div className="signature-ambient-glow" aria-hidden="true" />
        <div className="signature-grid-bg" aria-hidden="true" />
        <div className="signature-card text-center max-w-md w-full relative z-10 flex flex-col items-center gap-4 py-10 px-8 border-red-500/30">
          <div className="signature-badge text-red-400">
            <span className="signature-bracket">[</span>
            <span>CONNECTION ERROR</span>
            <span className="signature-bracket">]</span>
          </div>
          <p className="text-sm text-red-300">{error}</p>
          <button onClick={fetchRoadmaps} className="signature-btn-primary mt-2">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="signature-page-container">
      <div className="signature-ambient-glow" aria-hidden="true" />
      <div className="signature-grid-bg" aria-hidden="true" />

      <div className="signature-inner">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-white/[0.08]">
          <div className="signature-header">
            <div className="signature-badge">
              <span className="signature-bracket">[</span>
              <span>01 // LEARNING PATHWAYS</span>
              <span className="signature-bracket">]</span>
            </div>
            <h1 className="signature-title">Developer Roadmaps</h1>
            <p className="signature-subtitle">
              Structured engineering tracks calibrated for software craftsmanship. Master core web architectures, computer science, and cloud execution.
            </p>
          </div>

          {/* Overall Roadmap Completion Badge */}
          {activeRoadmap && (
            <div className="signature-metric-box shrink-0 min-w-[200px]">
              <span className="signature-metric-label">[ PATHWAY PROGRESS ]</span>
              <div className="flex items-baseline gap-2">
                <span className="signature-metric-value">{progressPercent}%</span>
                <span className="text-xs font-mono text-zinc-400">({completedCount}/{totalNodesCount} modules)</span>
              </div>
              <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Roadmap Track Selector Tabs */}
        <div className="signature-tabs-wrap">
          {Object.values(roadmaps).map((rm, idx) => {
            const isActive = activeRoadmapId === rm.id;
            const isUserActive = user?.activeRoadmap === rm.id;
            const num = (idx + 1 < 10) ? `0${idx + 1}` : idx + 1;

            return (
              <button
                key={rm.id}
                onClick={() => handleSelectRoadmap(rm.id)}
                className={`signature-tab-btn ${isActive ? 'active' : ''}`}
                type="button"
              >
                <Compass size={14} className={isActive ? 'text-blue-400' : 'text-zinc-400'} />
                <span>[ {num} // {rm.title.toUpperCase()} ]</span>
                {isUserActive && (
                  <span className="text-[10px] font-mono font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded">
                    CURRENT
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Roadmap Explorer Workspace: Flowchart Grid on Left + Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Interactive Timeline Node Pathway (7 cols on desktop) */}
          <div className="lg:col-span-7 signature-card flex flex-col min-h-[660px]">
            <div className="signature-card-top">
              <span className="signature-card-tag">
                <span className="signature-bracket">[</span>
                <span>CURRICULUM TIMELINE // {activeRoadmap?.title.toUpperCase()}</span>
                <span className="signature-bracket">]</span>
              </span>
              <span className="signature-pill">
                {totalNodesCount} MILESTONES
              </span>
            </div>

            {/* Scrollable Node List with SVG Connections */}
            <div className="relative flex-1 overflow-y-auto pr-2 py-4">
              <div className="relative w-full" style={{ minHeight: `${(activeRoadmap?.nodes?.length || 1) * 125}px` }}>
                
                {/* SVG Connections Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {activeRoadmap?.nodes?.map((node, idx) => {
                    if (idx === activeRoadmap.nodes.length - 1) return null;
                    const isCompleted = user?.completedNodes?.includes(node.id) && 
                                        user?.completedNodes?.includes(activeRoadmap.nodes[idx + 1]?.id);
                    
                    return (
                      <line
                        key={`line-${idx}`}
                        x1="50%"
                        y1={idx * 125 + 56}
                        x2="50%"
                        y2={(idx + 1) * 125 + 24}
                        stroke={isCompleted ? '#10b981' : 'rgba(255, 255, 255, 0.12)'}
                        strokeWidth="2.5"
                        strokeDasharray={isCompleted ? '0' : '4 4'}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>

                {/* Nodes List */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                  {activeRoadmap?.nodes?.map((node, idx) => {
                    const isCompleted = user?.completedNodes?.includes(node.id);
                    const isSelected = selectedNode?.id === node.id;
                    const matchesUserLevel = user?.studyLevel === node.level;
                    const nodeNum = (idx + 1 < 10) ? `0${idx + 1}` : idx + 1;

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNode(node)}
                        className={`w-full max-w-[420px] p-4 rounded-xl border cursor-pointer transition-all duration-200 select-none relative flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-blue-500/12 border-blue-500 shadow-[0_4px_24px_rgba(59,130,246,0.25)] translate-x-1'
                            : isCompleted
                              ? 'bg-emerald-500/[0.04] border-emerald-500/30 hover:border-emerald-500/60'
                              : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.04]'
                        }`}
                      >
                        {/* Target Level Ribbon */}
                        {matchesUserLevel && (
                          <span className="absolute -top-2.5 right-4 font-mono text-[9px] font-bold tracking-wider bg-blue-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                            TARGET LEVEL
                          </span>
                        )}

                        {/* Left: Completion Icon & Node Title */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          {isCompleted ? (
                            <CheckCircle2 size={22} className="text-emerald-400 shrink-0" />
                          ) : (
                            <Circle size={22} className="text-zinc-600 shrink-0" />
                          )}

                          <div className="flex flex-col min-w-0">
                            <span className="font-mono text-[11px] text-zinc-500 font-semibold">
                              STEP {nodeNum}
                            </span>
                            <h4 className={`text-sm md:text-base font-semibold truncate transition-colors ${
                              isSelected ? 'text-white' : 'text-zinc-200'
                            }`}>
                              {node.title}
                            </h4>
                          </div>
                        </div>

                        {/* Right: Level Pill */}
                        <span className={`shrink-0 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          node.level === 'Advanced'
                            ? 'text-purple-400 border-purple-500/30 bg-purple-500/10'
                            : node.level === 'Intermediate'
                              ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                              : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                        }`}>
                          {node.level}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </div>

          {/* Right Side: Module Details Panel Drawer (5 cols on desktop) */}
          <div className="lg:col-span-5 sticky top-28">
            {selectedNode ? (
              <div className="signature-card flex flex-col gap-6">
                <div className="signature-card-top">
                  <span className="signature-card-tag">
                    <span className="signature-bracket">[</span>
                    <span>MODULE SPECIFICATION // {selectedNode.id}</span>
                    <span className="signature-bracket">]</span>
                  </span>
                  <span className={`signature-pill ${
                    selectedNode.level === 'Advanced' ? 'text-purple-400' : selectedNode.level === 'Intermediate' ? 'text-blue-400' : 'text-emerald-400'
                  }`}>
                    {selectedNode.level.toUpperCase()}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                    {selectedNode.title}
                  </h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>

                {/* Curated Resources */}
                <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.08]">
                  <span className="signature-metric-label">
                    [ CURATED SYLLABUS & RESOURCES ]
                  </span>
                  <div className="flex flex-col gap-2">
                    {selectedNode.resources && selectedNode.resources.length > 0 ? (
                      selectedNode.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all text-zinc-200 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono text-[10px] font-bold text-zinc-400 bg-white/[0.06] px-1.5 py-0.5 rounded uppercase shrink-0">
                              {res.type}
                            </span>
                            <span className="text-xs md:text-sm font-medium truncate group-hover:text-blue-400 transition-colors">
                              {res.name}
                            </span>
                          </div>
                          <ExternalLink size={13} className="text-zinc-500 group-hover:text-blue-400 shrink-0 ml-2" />
                        </a>
                      ))
                    ) : (
                      <p className="text-xs font-mono text-zinc-500 py-2">
                        No external resources attached to this topic.
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/[0.08] mt-2">
                  <button
                    onClick={() => handleToggleNodeComplete(selectedNode.id)}
                    type="button"
                    className={`flex-1 py-2.5 px-4 rounded-lg font-mono text-xs font-semibold tracking-wider border transition-all cursor-pointer ${
                      user?.completedNodes?.includes(selectedNode.id)
                        ? 'border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/15'
                        : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15'
                    }`}
                  >
                    {user?.completedNodes?.includes(selectedNode.id)
                      ? '✕ Mark as Incomplete'
                      : '✓ Mark as Completed'}
                  </button>

                  <button
                    onClick={() => handlePracticeInSandbox(selectedNode.id)}
                    type="button"
                    className="signature-btn-primary flex-1 py-2.5 text-xs"
                  >
                    <span>Practice in IDE</span>
                    <Play size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="signature-card flex flex-col items-center justify-center text-center gap-3 py-16 px-6 text-zinc-500">
                <Compass size={36} className="text-zinc-600 animate-pulse" />
                <p className="font-mono text-xs text-zinc-400 max-w-xs">
                  [ SELECT A TIMELINE NODE TO INSPECT SYLLABUS SPECIFICATION ]
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoadmapExplorer;
