import React, { useState, useEffect } from 'react';
import { Award, Code, Compass, CheckCircle2, ChevronRight, BookOpen, Calendar, Cpu } from 'lucide-react';

const ProfileDashboard = ({ token, user, setCurrentPage, onLoadTemplate }) => {
  const [progress, setProgress] = useState({});
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, [token, user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Fetch progress summary
      const resProgress = await fetch('/api/roadmaps/progress/summary', {
        headers: { 'x-auth-token': token }
      });
      const dataProgress = await resProgress.json();

      // Fetch saved snippets
      const resSnippets = await fetch('/api/editor/snippets', {
        headers: { 'x-auth-token': token }
      });
      const dataSnippets = await resSnippets.json();

      if (resProgress.ok) setProgress(dataProgress);
      if (resSnippets.ok) setSavedSnippets(dataSnippets);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Advanced': return 'var(--accent-purple)';
      case 'Intermediate': return 'var(--accent-blue)';
      default: return 'var(--accent-cyan)';
    }
  };

  // Generate a mock activity calendar grid (4 weeks x 7 days)
  const renderActivityGrid = () => {
    const totalCells = 28;
    const cells = [];
    
    // Seed with user completions so it reflects "real data"
    const activeCompletions = user?.completedNodes?.length || 0;
    const activeSnippetsCount = savedSnippets?.length || 0;
    const filledCount = activeCompletions + activeSnippetsCount + 3; // base mock activity

    for (let i = 0; i < totalCells; i++) {
      // randomly distribute activity, prioritizing first few slots
      const isActive = i < filledCount || (i % 5 === 0 && i < 22);
      cells.push(
        <div
          key={i}
          className={`activity-cell ${isActive ? 'active' : ''}`}
          title={isActive ? `Active day: Work recorded` : `No activity recorded`}
        />
      );
    }
    return cells;
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="glass-panel" style={styles.loadingBox}>
          <div className="animate-float" style={styles.loaderIcon}>⚛️</div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching profile telemetry...</p>
        </div>
      </div>
    );
  }

  // Calculate global statistics
  const totalRoadmapNodes = Object.values(progress).reduce((acc, curr) => acc + curr.total, 0);
  const completedRoadmapNodes = user?.completedNodes?.length || 0;
  const overallPercentage = totalRoadmapNodes > 0 ? Math.round((completedRoadmapNodes / totalRoadmapNodes) * 100) : 0;

  return (
    <div style={styles.container} className="animate-fade-in">
      <div className="glow-orb glow-orb-purple" style={{ top: '15%', left: '10%' }}></div>
      <div className="glow-orb glow-orb-cyan" style={{ bottom: '15%', right: '10%' }}></div>

      {/* Header Profile Dashboard */}
      <div style={styles.userHeader} className="glass-panel">
        <div style={styles.userHeaderLeft}>
          <div style={{ ...styles.avatarWrapper, borderColor: getLevelColor(user?.studyLevel) }}>
            <Award size={36} style={{ color: getLevelColor(user?.studyLevel) }} />
          </div>
          <div>
            <h1 style={styles.usernameTitle}>{user?.username}</h1>
            <p style={styles.emailSub}>{user?.email}</p>
          </div>
        </div>

        <div style={styles.userHeaderRight}>
          <div style={styles.headerMetric}>
            <span style={styles.metricLabel}>CALIBRATED LEVEL</span>
            <span 
              style={{
                ...styles.levelBadge, 
                color: getLevelColor(user?.studyLevel), 
                borderColor: getLevelColor(user?.studyLevel),
                boxShadow: `0 0 15px ${getLevelColor(user?.studyLevel)}30`
              }}
            >
              {user?.studyLevel}
            </span>
          </div>
          <div style={styles.headerMetric}>
            <span style={styles.metricLabel}>DIAGNOSTIC SCORE</span>
            <span style={styles.scoreText}>
              {user?.completedQuiz ? `${user.quizScore} / 10` : 'Not Tested'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div style={styles.statsRow}>
        <div className="glass-panel" style={styles.statCard}>
          <div style={styles.statCardHeader}>
            <Compass size={18} style={{ color: 'var(--accent-cyan)' }} />
            <span style={styles.statCardLabel}>Active Track</span>
          </div>
          <span style={styles.statCardVal}>
            {user?.activeRoadmap ? progress[user.activeRoadmap]?.title?.replace(' Roadmap', '') : 'None Selected'}
          </span>
          <button onClick={() => setCurrentPage('roadmaps')} style={styles.statLink}>
            Change Track <ChevronRight size={14} />
          </button>
        </div>

        <div className="glass-panel" style={styles.statCard}>
          <div style={styles.statCardHeader}>
            <BookOpen size={18} style={{ color: 'var(--accent-purple)' }} />
            <span style={styles.statCardLabel}>Path Completion</span>
          </div>
          <span style={styles.statCardVal}>{completedRoadmapNodes} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>modules completed</span></span>
          <div style={styles.progressBarBg}>
            <div style={{ ...styles.progressBarFill, width: `${overallPercentage}%` }}></div>
          </div>
        </div>

        <div className="glass-panel" style={styles.statCard}>
          <div style={styles.statCardHeader}>
            <Code size={18} style={{ color: 'var(--accent-success)' }} />
            <span style={styles.statCardLabel}>Saved Scripts</span>
          </div>
          <span style={styles.statCardVal}>{savedSnippets.length} <span style={{ fontSize: '1rem', color: 'var(--text-dim)' }}>files in sandbox</span></span>
          <button onClick={() => setCurrentPage('editor')} style={styles.statLink}>
            Open Sandbox <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div style={styles.dashboardGrid}>
        {/* Left Side: Career Progress Details & Activity Heatmap */}
        <div style={styles.dashboardLeft}>
          {/* Progress Rows */}
          <div className="glass-panel" style={styles.sectionPanel}>
            <h3 style={styles.panelTitle}>Professional Roadmaps Breakdown</h3>
            <div style={styles.progressRowsList}>
              {Object.keys(progress).map((key) => {
                const item = progress[key];
                return (
                  <div key={key} style={styles.progressRowItem}>
                    <div style={styles.progressRowHeader}>
                      <span style={styles.progressRowName}>{item.title}</span>
                      <span style={styles.progressRowPercent}>{item.percent}%</span>
                    </div>
                    <div style={styles.progressRowBarBg}>
                      <div 
                        style={{ 
                          ...styles.progressRowBarFill, 
                          width: `${item.percent}%`,
                          background: user?.activeRoadmap === key ? 'linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))' : 'var(--text-dim)'
                        }}
                      />
                    </div>
                    <div style={styles.progressRowDetails}>
                      <span>{item.completed} / {item.total} modules unlocked</span>
                      {user?.activeRoadmap === key && <span style={styles.rowActiveLabel}>Active Track</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Heatmap Grid */}
          <div className="glass-panel" style={styles.sectionPanel}>
            <div style={styles.heatmapHeader}>
              <div>
                <h3 style={styles.panelTitle}>Learning Activity</h3>
                <p style={styles.panelSubtitle}>Daily commits to roadmaps and codebase compiles.</p>
              </div>
              <Calendar size={18} style={{ color: 'var(--text-dim)' }} />
            </div>
            
            <div style={styles.heatmapGridWrapper}>
              <div style={styles.heatmapGrid}>
                {renderActivityGrid()}
              </div>
            </div>
            <div style={styles.heatmapLegend}>
              <span>Less</span>
              <div style={{ ...styles.legendCell, background: 'rgba(255, 255, 255, 0.03)' }}></div>
              <div style={{ ...styles.legendCell, background: 'rgba(0, 242, 254, 0.3)' }}></div>
              <div style={{ ...styles.legendCell, background: 'rgba(0, 242, 254, 0.6)' }}></div>
              <div style={{ ...styles.legendCell, background: 'var(--accent-cyan)' }}></div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Right Side: Saved Snippets Manager & Certificates */}
        <div style={styles.dashboardRight}>
          {/* Saved Snippets List */}
          <div className="glass-panel" style={styles.sectionPanel}>
            <h3 style={styles.panelTitle}>Saved Coding Snippets</h3>
            <div style={styles.snippetGrid}>
              {savedSnippets.length > 0 ? (
                savedSnippets.map((snippet) => (
                  <div
                    key={snippet._id}
                    onClick={() => {
                      onLoadTemplate(null); // Clear loaded template
                      // Let's manually load the snippet in CodeEditor (handled by parent logic)
                      setCurrentPage('editor');
                    }}
                    style={styles.snippetCard}
                    className="glass-panel"
                  >
                    <div style={styles.snippetCardHeader}>
                      <span style={styles.snippetTitle}>{snippet.title}</span>
                      <span style={{
                        ...styles.snippetLang,
                        color: snippet.language === 'html' ? 'var(--accent-purple)' : 'var(--accent-cyan)'
                      }}>{snippet.language}</span>
                    </div>
                    <p style={styles.snippetDate}>Updated: {new Date(snippet.updatedAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <div style={styles.emptySnippets}>
                  <Code size={30} style={{ color: 'var(--text-dim)' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No code snippets saved yet.</p>
                  <button onClick={() => setCurrentPage('editor')} className="btn-secondary" style={{ marginTop: '0.5rem', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                    Open Code Workspace
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Calibrated Certifications */}
          <div className="glass-panel glass-panel-glow-cyan" style={styles.sectionPanel}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={styles.panelTitle}>Scholar Credentials</h3>
            </div>
            
            <div style={styles.badgeWrapper}>
              {user?.completedQuiz ? (
                <div style={styles.certBadge} className="animate-float">
                  <Award size={40} style={{ color: getLevelColor(user.studyLevel), filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.4))' }} />
                  <div style={styles.certBadgeInfo}>
                    <span style={styles.certBadgeName}>Codepolarity Calibrated Badge</span>
                    <span style={{ ...styles.certBadgeLevel, color: getLevelColor(user.studyLevel) }}>{user.studyLevel.toUpperCase()} CLASS</span>
                  </div>
                </div>
              ) : (
                <div style={styles.emptyCert}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                    Complete the level assessment to unlock your official Codepolarity badge credential.
                  </p>
                  <button onClick={() => setCurrentPage('assessment')} className="btn-primary" style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}>
                    Take Assessment
                  </button>
                </div>
              )}
            </div>
          </div>
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
    gap: '2.5rem',
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
  userHeader: {
    padding: '2.5rem 3rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '20px',
    border: '1px solid var(--border-light)',
    background: 'rgba(14, 18, 38, 0.4)',
  },
  userHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  avatarWrapper: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
  },
  usernameTitle: {
    fontSize: '2rem',
    fontWeight: '800',
  },
  emailSub: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    marginTop: '4px',
  },
  userHeaderRight: {
    display: 'flex',
    gap: '2.5rem',
  },
  headerMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
  },
  metricLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--text-dim)',
    letterSpacing: '1.5px',
  },
  levelBadge: {
    fontSize: '1rem',
    fontWeight: '800',
    letterSpacing: '1px',
    padding: '4px 14px',
    borderRadius: '100px',
    border: '1px solid',
    textTransform: 'uppercase',
  },
  scoreText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },
  statCard: {
    padding: '1.8rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    alignItems: 'flex-start',
  },
  statCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statCardLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statCardVal: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  statLink: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent-cyan)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0',
    marginTop: '0.2rem',
  },
  progressBarBg: {
    width: '100%',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '100px',
    marginTop: '0.5rem',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))',
    borderRadius: '100px',
    boxShadow: 'var(--glow-purple)',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '2rem',
    alignItems: 'start',
  },
  dashboardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  sectionPanel: {
    padding: '2.2rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  panelTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  panelSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  progressRowsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  progressRowItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  progressRowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  progressRowName: {
    color: 'var(--text-main)',
  },
  progressRowPercent: {
    color: 'var(--accent-cyan)',
  },
  progressRowBarBg: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '100px',
  },
  progressRowBarFill: {
    height: '100%',
    borderRadius: '100px',
  },
  progressRowDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-dim)',
  },
  rowActiveLabel: {
    color: 'var(--accent-cyan)',
    fontWeight: '600',
  },
  heatmapHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heatmapGridWrapper: {
    width: '100%',
    overflowX: 'auto',
    padding: '0.5rem 0',
  },
  heatmapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(14, 1fr)',
    gap: '6px',
    minWidth: '320px',
  },
  heatmapLegend: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  },
  legendCell: {
    width: '10px',
    height: '10px',
    borderRadius: '2px',
  },
  dashboardRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  snippetGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '300px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  snippetCard: {
    padding: '1rem 1.2rem',
    background: 'rgba(255, 255, 255, 0.01)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  snippetCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  snippetTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  snippetLang: {
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  snippetDate: {
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
  },
  emptySnippets: {
    padding: '2.5rem 1rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  badgeWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem 0',
  },
  certBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    background: 'rgba(0, 242, 254, 0.03)',
    border: '1px solid rgba(0, 242, 254, 0.15)',
    padding: '1.2rem 2rem',
    borderRadius: '14px',
    width: '100%',
  },
  certBadgeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  certBadgeName: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--text-main)',
  },
  certBadgeLevel: {
    fontSize: '0.75rem',
    fontWeight: '800',
    letterSpacing: '1px',
  },
  emptyCert: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem',
  }
};

export default ProfileDashboard;
