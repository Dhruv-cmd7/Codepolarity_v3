import React from 'react';
import { Compass, Sparkles, Code, Cpu, ShieldCheck, ArrowLeft, Terminal, HelpCircle } from 'lucide-react';

const About = ({ setCurrentPage }) => {
  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Background Orbs */}
      <div className="glow-orb glow-orb-cyan" style={{ top: '10%', left: '15%', width: '450px', height: '450px' }} />
      <div className="glow-orb glow-orb-purple" style={{ bottom: '15%', right: '10%', width: '500px', height: '500px' }} />

      <div style={styles.inner}>
        {/* Navigation back */}
        <button onClick={() => setCurrentPage('landing')} style={styles.backBtn}>
          <ArrowLeft size={16} />
          <span>Back to Overview</span>
        </button>

        {/* Hero Header */}
        <div style={styles.header}>
          <div style={styles.chip}>
            <Sparkles size={12} style={{ color: 'var(--accent-cyan)' }} />
            <span>Zero-Gravity Educational Platform</span>
          </div>
          <h1 style={styles.title} className="display-xl">
            Learning without gravity.
          </h1>
          <p style={styles.subtitle}>
            Codepolarity is a developer acceleration workspace designed to bypass linear learning speeds and calibrate technical competencies through telemetry.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div style={styles.grid}>
          <div className="glass-panel" style={styles.card}>
            <div style={{ ...styles.iconWrapper, background: 'rgba(6, 182, 212, 0.08)', borderColor: 'rgba(6, 182, 212, 0.2)' }}>
              <Cpu size={24} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <h3 style={styles.cardTitle}>Calibration Diagnostics</h3>
            <p style={styles.cardDesc}>
              Say goodbye to generic courses. Our system evaluates logic, architecture, and language structures to place you in the perfect learning orbit.
            </p>
          </div>

          <div className="glass-panel" style={styles.card}>
            <div style={{ ...styles.iconWrapper, background: 'rgba(59, 130, 246, 0.08)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
              <Compass size={24} style={{ color: 'var(--accent-blue)' }} />
            </div>
            <h3 style={styles.cardTitle}>Structured Node Paths</h3>
            <p style={styles.cardDesc}>
              Clear paths for AI/ML, Frontend, and Backend developers. Study nodes link to highly-vetted web resources and direct code practice templates.
            </p>
          </div>

          <div className="glass-panel" style={styles.card}>
            <div style={{ ...styles.iconWrapper, background: 'rgba(139, 92, 246, 0.08)', borderColor: 'rgba(139, 92, 246, 0.2)' }}>
              <Code size={24} style={{ color: 'var(--accent-purple)' }} />
            </div>
            <h3 style={styles.cardTitle}>Online IDE</h3>
            <p style={styles.cardDesc}>
              A full-featured sandbox supporting HTML previews, code saving, and algorithmic evaluation directly in your browser.
            </p>
          </div>

          <div className="glass-panel" style={styles.card}>
            <div style={{ ...styles.iconWrapper, background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
              <Terminal size={24} style={{ color: 'var(--accent-green)' }} />
            </div>
            <h3 style={styles.cardTitle}>Typlab Calibrator</h3>
            <p style={styles.cardDesc}>
              Code velocity training. Practice mechanical keyboard speed and accuracy on production syntax to synchronize memory and typing flow.
            </p>
          </div>
        </div>

        {/* Tech Stack details */}
        <div className="glass-panel" style={styles.detailsBox}>
          <div style={styles.detailsHeader}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Platform Philosophy</h2>
          </div>
          <p style={styles.detailsText}>
            We believe that modern software training is broken. Endless tutorial loops fail to build muscle memory. Codepolarity acts as a telemetry command center, logging your actual assessment scores, structured path milestones, and sandbox scripts. By combining instant preview environments with real-time feedback loop telemetry, we help you build high-dimensional systems effortlessly.
          </p>
          <div style={styles.pillRow}>
            <span style={styles.pill}>React 19</span>
            <span style={styles.pill}>Vite Client</span>
            <span style={styles.pill}>Node.js Engine</span>
            <span style={styles.pill}>MongoDB Telemetry</span>
            <span style={styles.pill}>Web Audio Synthesizer</span>
          </div>
        </div>

        {/* Footer CTA */}
        <div style={styles.footerSection}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ready to launch your journey?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => setCurrentPage('roadmaps')} className="btn-primary" style={styles.ctaBtn}>
              Explore Roadmaps
            </button>
            <button onClick={() => setCurrentPage('typlab')} className="btn-secondary" style={styles.ctaBtnSec}>
              Try Typlab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    color: 'var(--text-main)',
    padding: '100px 24px 120px',
    position: 'relative',
    overflow: 'hidden',
  },
  inner: {
    maxWidth: '900px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    marginBottom: '40px',
    padding: 0,
    transition: 'color 0.2s',
    outline: 'none',
    ':hover': {
      color: 'var(--text-main)',
    }
  },
  header: {
    marginBottom: '60px',
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--glass-border)',
    padding: '6px 12px',
    borderRadius: '99px',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: 'var(--text-muted)',
    marginBottom: '20px',
  },
  title: {
    fontWeight: '700',
    letterSpacing: '-0.03em',
    marginBottom: '20px',
    background: 'linear-gradient(to right, #ffffff, #9ca3af)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    maxWidth: '720px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '50px',
  },
  card: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
    borderRadius: '16px',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  cardDesc: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  detailsBox: {
    padding: '32px',
    borderRadius: '18px',
    marginBottom: '60px',
  },
  detailsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  detailsText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: '1.7',
    marginBottom: '24px',
  },
  pillRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  pill: {
    fontSize: '0.75rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-muted)',
    padding: '4px 10px',
    borderRadius: '6px',
    fontFamily: 'var(--font-mono)',
  },
  footerSection: {
    textAlign: 'center',
    borderTop: '1px solid var(--border-light)',
    paddingTop: '50px',
  },
  ctaBtn: {
    padding: '12px 28px',
    fontSize: '0.9rem',
    borderRadius: '99px',
  },
  ctaBtnSec: {
    padding: '12px 28px',
    fontSize: '0.9rem',
    borderRadius: '99px',
    background: 'transparent',
    border: '1px solid var(--border-light)',
    color: 'var(--text-main)',
    cursor: 'pointer',
  }
};

export default About;
