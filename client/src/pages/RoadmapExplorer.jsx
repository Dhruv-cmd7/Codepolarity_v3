import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, CheckCircle, Circle, Play, ArrowRight, ExternalLink } from 'lucide-react';

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
      // Auto select first node
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
      const res = await fetch('/api/roadmaps', {
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
      const res = await fetch('/api/roadmaps/select', {
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
      const res = await fetch('/api/roadmaps/complete-node', {
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
        
        // Refresh selected node state
        if (selectedNode && selectedNode.id === nodeId) {
          // Simply triggers state re-render
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
    // Map roadmap nodes to specific code templates
    let templateId = 'template-html';
    if (nodeId === 'fe-js-basics') templateId = 'template-revstring';
    if (nodeId === 'ai-python') templateId = 'template-fibonacci';
    if (nodeId === 'be-node-express') templateId = 'template-bubblesort';
    
    onLoadTemplate(templateId);
    setCurrentPage('editor');
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Advanced': return 'var(--accent-purple)';
      case 'Intermediate': return 'var(--accent-blue)';
      default: return 'var(--accent-cyan)';
    }
  };

  const activeRoadmap = roadmaps[activeRoadmapId];

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="glass-panel" style={styles.loadingBox}>
          <div className="animate-float" style={styles.loaderIcon}>⚛️</div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Assembling interactive roadmap vectors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div className="glass-panel" style={styles.errorBox}>
          <p style={{ color: 'var(--accent-error)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Background Decorative Orbs */}
      <div className="glow-orb glow-orb-cyan" style={{ top: '20%', left: '5%' }}></div>
      <div className="glow-orb glow-orb-purple" style={{ bottom: '15%', right: '5%' }}></div>

      {/* Roadmap Headers */}
      <div style={styles.headerSection}>
        <h1 style={styles.title}>
          Explore <span className="text-gradient-cyan text-gradient-glow">Roadmaps</span>
        </h1>
        <p style={styles.subtitle}>Select a profession track. Nodes represent topics calibrated for your study level.</p>

        {/* Roadmap Picker Tabs */}
        <div style={styles.tabContainer}>
          {Object.values(roadmaps).map((rm) => {
            const isActive = activeRoadmapId === rm.id;
            const isUserActive = user?.activeRoadmap === rm.id;
            return (
              <button
                key={rm.id}
                onClick={() => handleSelectRoadmap(rm.id)}
                style={{
                  ...styles.tabBtn,
                  background: isActive ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                  borderColor: isActive ? 'var(--accent-cyan)' : 'var(--border-light)',
                  boxShadow: isActive ? 'var(--glow-cyan)' : 'none',
                }}
              >
                <Compass size={16} style={{ color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                <span>{rm.title}</span>
                {isUserActive && <span style={styles.activeLabel}>Current</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Roadmap Explorer Workspace */}
      <div style={styles.workspace}>
        {/* Left Side: SVG Connected Nodes Flowchart */}
        <div className="glass-panel" style={styles.flowchartPanel}>
          <h3 style={styles.flowchartTitle}>Learning Pathway</h3>
          
          <div style={styles.flowchartScrollArea}>
            <div style={styles.graphContainer}>
              {/* Dynamic SVG Connections */}
              <svg style={styles.svgOverlay}>
                {activeRoadmap?.nodes.map((node, idx) => {
                  if (idx === activeRoadmap.nodes.length - 1) return null;
                  
                  // Connect node indices (spacing is defined by index * 120px)
                  const startX = 150;
                  const startY = idx * 140 + 70;
                  const endX = 150;
                  const endY = (idx + 1) * 140 + 30;
                  
                  const isCompleted = user?.completedNodes.includes(node.id) && 
                                      user?.completedNodes.includes(activeRoadmap.nodes[idx+1].id);

                  return (
                    <g key={`path-${idx}`}>
                      <line
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke={isCompleted ? 'var(--accent-success)' : 'rgba(255, 255, 255, 0.08)'}
                        strokeWidth="3"
                        strokeDasharray={isCompleted ? '0' : '4 4'}
                        style={{
                          transition: 'var(--transition-smooth)',
                          filter: isCompleted ? 'drop-shadow(0 0 5px var(--accent-success))' : 'none'
                        }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Roadmap Nodes */}
              <div style={styles.nodesList}>
                {activeRoadmap?.nodes.map((node, idx) => {
                  const isCompleted = user?.completedNodes.includes(node.id);
                  const isSelected = selectedNode?.id === node.id;
                  
                  // Check if node matches user's current diagnostic study level
                  const matchesUserLevel = user?.studyLevel === node.level;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{
                        ...styles.nodeItem,
                        top: `${idx * 140}px`,
                        borderColor: isSelected 
                          ? 'var(--accent-cyan)' 
                          : isCompleted 
                            ? 'var(--accent-success)' 
                            : 'var(--border-light)',
                        background: isSelected 
                          ? 'rgba(0, 242, 254, 0.06)' 
                          : 'var(--bg-card)',
                        boxShadow: isSelected 
                          ? 'var(--glow-cyan)' 
                          : isCompleted 
                            ? '0 0 15px rgba(0, 245, 212, 0.1)' 
                            : 'var(--shadow-box)',
                      }}
                    >
                      <div style={styles.nodeLeft}>
                        {isCompleted ? (
                          <CheckCircle size={22} style={{ color: 'var(--accent-success)' }} />
                        ) : (
                          <Circle size={22} style={{ color: 'var(--text-dim)' }} />
                        )}
                        <div style={styles.nodeInfo}>
                          <h4 style={{ 
                            ...styles.nodeName,
                            color: isSelected ? 'var(--accent-cyan)' : 'var(--text-main)'
                          }}>{node.title}</h4>
                          <span 
                            style={{ 
                              ...styles.nodeLevelTag, 
                              color: getLevelColor(node.level),
                              borderColor: getLevelColor(node.level) + '40'
                            }}
                          >
                            {node.level}
                          </span>
                        </div>
                      </div>

                      {matchesUserLevel && (
                        <div style={styles.recommendedBadge} title="Calibrated for your study level">
                          Target Level
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Learning Command Panel / Details Drawer */}
        <div style={styles.detailsPanelWrapper}>
          {selectedNode ? (
            <div className="glass-panel glass-panel-glow-purple" style={styles.detailsPanel}>
              <div style={styles.detailsHeader}>
                <div style={styles.detailsHeaderLeft}>
                  <BookOpen size={20} style={{ color: 'var(--accent-purple)' }} />
                  <span style={styles.detailsLevelTag}>TOPIC MODULE</span>
                </div>
                <span 
                  style={{
                    ...styles.levelBadgeDetail,
                    color: getLevelColor(selectedNode.level),
                    borderColor: getLevelColor(selectedNode.level)
                  }}
                >
                  {selectedNode.level}
                </span>
              </div>

              <h2 style={styles.detailsTitle}>{selectedNode.title}</h2>
              <p style={styles.detailsDesc}>{selectedNode.description}</p>

              {/* Curated Resources Section */}
              <div style={styles.resourcesSection}>
                <h4 style={styles.sectionSubTitle}>Curated Internet Resources</h4>
                <div style={styles.resourceList}>
                  {selectedNode.resources && selectedNode.resources.length > 0 ? (
                    selectedNode.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.resourceItem}
                        className="glass-panel"
                      >
                        <div style={styles.resourceInfo}>
                          <span style={styles.resourceTypeBadge}>{res.type}</span>
                          <span style={styles.resourceName}>{res.name}</span>
                        </div>
                        <ExternalLink size={14} style={{ color: 'var(--text-dim)' }} />
                      </a>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No resources found for this module.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.actionBlock}>
                <button
                  onClick={() => handleToggleNodeComplete(selectedNode.id)}
                  style={{
                    ...styles.completeToggleBtn,
                    borderColor: user?.completedNodes.includes(selectedNode.id) ? 'var(--accent-error)' : 'var(--accent-success)',
                    color: user?.completedNodes.includes(selectedNode.id) ? 'var(--accent-error)' : 'var(--accent-success)',
                    background: user?.completedNodes.includes(selectedNode.id) ? 'rgba(255, 0, 84, 0.05)' : 'rgba(0, 245, 212, 0.05)'
                  }}
                >
                  {user?.completedNodes.includes(selectedNode.id) ? 'Mark as Incomplete' : 'Mark as Completed'}
                </button>

                <button
                  onClick={() => handlePracticeInSandbox(selectedNode.id)}
                  className="btn-primary"
                  style={styles.practiceBtn}
                >
                  Practice in IDE
                  <Play size={14} style={{ marginLeft: '6px' }} />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel" style={styles.emptyDetails}>
              <Compass size={40} className="animate-float" style={{ color: 'var(--text-dim)' }} />
              <p style={{ color: 'var(--text-muted)' }}>Select a learning node on the pathway to access curated study materials.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '3rem auto',
    padding: '0 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
  },
  loadingBox: {
    padding: '3rem',
    textAlign: 'center',
  },
  loaderIcon: {
    fontSize: '3rem',
    color: 'var(--accent-cyan)',
    filter: 'drop-shadow(var(--glow-cyan))',
  },
  errorBox: {
    padding: '3rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 0, 84, 0.2)',
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    letterSpacing: '-1px',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    maxWidth: '600px',
    lineHeight: '1.6',
  },
  tabContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0.6rem 1.4rem',
    borderRadius: '100px',
    border: '1px solid',
    color: 'var(--text-main)',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'var(--transition-smooth)',
  },
  activeLabel: {
    background: 'var(--accent-cyan)',
    color: 'var(--bg-primary)',
    fontSize: '0.65rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    padding: '2px 6px',
    borderRadius: '100px',
    marginLeft: '4px',
    boxShadow: 'var(--glow-cyan)',
  },
  workspace: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '2.5rem',
    alignItems: 'start',
  },
  flowchartPanel: {
    padding: '2rem',
    height: '650px',
    display: 'flex',
    flexDirection: 'column',
  },
  flowchartTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
  },
  flowchartScrollArea: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    paddingRight: '1rem',
  },
  graphContainer: {
    position: 'relative',
    width: '100%',
    minHeight: '680px',
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  },
  nodesList: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  nodeItem: {
    position: 'absolute',
    width: '280px',
    height: '80px',
    left: 'calc(50% - 140px)',
    border: '1px solid',
    borderRadius: '12px',
    padding: '0.8rem 1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  nodeLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  nodeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  nodeName: {
    fontSize: '0.95rem',
    fontWeight: '600',
    lineHeight: '1.2',
  },
  nodeLevelTag: {
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  recommendedBadge: {
    position: 'absolute',
    top: '-8px',
    right: '12px',
    background: 'rgba(0, 242, 254, 0.1)',
    border: '1px solid rgba(0, 242, 254, 0.3)',
    color: 'var(--accent-cyan)',
    fontSize: '0.65rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    padding: '1px 6px',
    borderRadius: '4px',
    letterSpacing: '0.5px',
  },
  detailsPanelWrapper: {
    position: 'sticky',
    top: '7.5rem',
  },
  detailsPanel: {
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  detailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  detailsLevelTag: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-dim)',
    letterSpacing: '1.5px',
  },
  levelBadgeDetail: {
    fontSize: '0.7rem',
    fontWeight: '700',
    border: '1px solid',
    borderRadius: '4px',
    padding: '2px 8px',
    textTransform: 'uppercase',
  },
  detailsTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    lineHeight: '1.2',
  },
  detailsDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
  },
  resourcesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '1.5rem',
  },
  sectionSubTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  resourceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  resourceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 1.2rem',
    textDecoration: 'none',
    color: 'var(--text-main)',
    background: 'rgba(255, 255, 255, 0.02)',
  },
  resourceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  resourceTypeBadge: {
    fontSize: '0.65rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    background: 'rgba(255, 255, 255, 0.06)',
    padding: '2px 6px',
    borderRadius: '4px',
    color: 'var(--text-muted)',
  },
  resourceName: {
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  actionBlock: {
    display: 'flex',
    gap: '1rem',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '1.5rem',
    marginTop: '0.5rem',
  },
  completeToggleBtn: {
    flex: 1,
    padding: '0.8rem',
    border: '1px solid',
    borderRadius: '8px',
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  practiceBtn: {
    flex: 1.2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDetails: {
    padding: '4rem 2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    minHeight: '300px',
  }
};

export default RoadmapExplorer;
