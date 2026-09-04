import React, { useEffect, useRef, useState } from 'react';

import TypedText from '../components/TypedText';
import Footer from '../components/Footer';
import dsLogo from '../assets/ds_logo.svg';
import codeEditorIllustration from '../assets/code_editor_illustration.jpg';

/* ─────────────────────────────────────────────────────
   PopSlide – spring pop-slide animation on scroll
───────────────────────────────────────────────────── */
const PopSlide = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setVisible(true); 
          obs.disconnect(); 
        } 
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible 
          ? 'translateY(0) scale(1)' 
          : 'translateY(40px) scale(0.95)',
        transition: `opacity 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms, transform 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const ContainerScroll = ({ titleComponent, children }) => {
  const [rotation, setRotation] = useState(20);
  const [scale, setScale] = useState(1.05);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          // Animate over 500px of scrolling
          const maxScroll = 500;
          const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
          
          setRotation(20 - (progress * 20));
          setScale(1.05 - (progress * 0.05));
          setTranslateY(-progress * 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: '30vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 24px',
        overflow: 'hidden',
        background: 'transparent',
        width: '100%',
        zIndex: 2,
        marginTop: '180px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          position: 'relative',
          perspective: '1000px',
        }}
      >
        {/* Header */}
        {titleComponent && (
          <div
            style={{
              transform: `translateY(${translateY}px)`,
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              textAlign: 'center',
              marginBottom: '40px',
            }}
          >
            {titleComponent}
          </div>
        )}
        
        {/* Card Screen Mockup */}
        <div
          style={{
            transform: `rotateX(${rotation}deg) scale(${scale})`,
            transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            transformOrigin: 'top center',
            boxShadow: '0 30px 60px -10px rgba(0, 0, 0, 0.35), 0 18px 36px -18px rgba(0, 0, 0, 0.25)',
            borderRadius: '24px',
            border: 'none',
            background: 'transparent',
            padding: 0,
          }}
        >
          <div
            style={{
              overflow: 'hidden',
              borderRadius: '24px',
              background: 'transparent',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   Meet the Agents Data (Autonomous Developer Telemetry)
───────────────────────────────────────────────────── */
const agentsData = [
  {
    id: 'detection',
    name: 'Detection agent',
    titleColor: '#FF7A59',
    subtitle: 'Continuous calibration & discovery',
    desc: 'Continuously scans your code syntax, algorithmic complexity, and data structures for anti-patterns, edge cases, and knowledge gaps, surfacing the insights that actually matter to your progression.',
    quote: 'That binary search logic missed an edge case on duplicate keys. Recalibrated tier to Advanced Intermediate. Worth a look.',
    mascot: '/agents/agent_detection.jpg',
    page: 'assessment',
    mascotAlign: 'left',
  },
  {
    id: 'investigation',
    name: 'Investigation agent',
    titleColor: '#A78BFA',
    subtitle: 'Autonomous pathway routing',
    desc: 'Builds the full trajectory behind every milestone, prerequisite node, and project dependency. Synthesizes curated resources and interactive challenges to turn months of aimless tutorials into structured mastery.',
    quote: 'Detected latency vulnerability in distributed systems caching. Auto-generated Redis & Kafka cluster architecture drill into your roadmap.',
    mascot: '/agents/agent_investigation.jpg',
    page: 'roadmaps',
    mascotAlign: 'right',
  },
  {
    id: 'orchestration',
    name: 'Orchestration agent',
    titleColor: '#38BDF8',
    subtitle: 'Closed-loop sandboxed execution',
    desc: 'Bridges the gap between theory and code, spinning up sandboxed IDE runtimes, algorithm test runners, and Typlab typing telemetry drills with real-time verification and zero local environment setup.',
    quote: 'Sandboxed runtime ready. Verified 8 test cases in fibonacci.js. Keystroke telemetry logging 96% accuracy with zero syntax friction.',
    mascot: '/agents/agent_orchestration.jpg',
    page: 'editor',
    mascotAlign: 'left',
  },
];



/* ─────────────────────────────────────────────────────
   Horizontal Brick Marquee Brands & Tech Stack
───────────────────────────────────────────────────── */
const marqueeRow1 = [
  { name: 'Google', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
  { name: 'GitHub', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', inverted: true },
  { name: 'Python', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'TypeScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name: 'Amazon AWS', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'JavaScript', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Go', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
  { name: 'React', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
];

const marqueeRow2 = [
  { name: 'CockroachDB', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/cockroachlabs.svg', inverted: true },
  { name: 'Elastic', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg' },
  { name: 'Docker', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Kubernetes', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { name: 'Cloudflare', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudflare/cloudflare-original.svg' },
  { name: 'Rust', iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/rust.svg', inverted: true },
  { name: 'Figma', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name: 'PostgreSQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
];

const marqueeRow3 = [
  { name: 'Supabase', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
  { name: 'Redis', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
  { name: 'MongoDB', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'Postman', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
  { name: 'Terraform', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg' },
  { name: 'GraphQL', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
  { name: 'C++', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { name: 'Java', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
];

/* ─────────────────────────────────────────────────────
   LANDING PAGE COMPONENT
───────────────────────────────────────────────────── */
const LandingPage = ({ user, onOpenAuth, setCurrentPage }) => {
  return (
    <div style={{ overflowX: 'hidden', background: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh' }}>
      
      {/* ─────────────────── MINIMALIST ENTERPRISE HERO ─────────────────── */}
      <section className="hero-enterprise-section">
        <div className="hero-enterprise-container">
          <PopSlide>
            <h1 className="hero-enterprise-title">
              The developer career engine built for <span className="hero-title-accent">high-velocity</span> engineering.
            </h1>
          </PopSlide>

          <PopSlide delay={80}>
            <p className="hero-enterprise-subtitle">
              Codepolarity benchmarks programming capabilities, calibrates technical skill tiers with autonomous agents, and orchestrates interactive career pathways tailored for modern software developers.
            </p>
          </PopSlide>

          <PopSlide delay={160}>
            <div className="hero-cta-group">
              {user ? (
                <button
                  onClick={() => setCurrentPage(user.completedQuiz ? 'roadmaps' : 'assessment')}
                  className="hero-btn-primary"
                >
                  {user.completedQuiz ? 'Continue Learning →' : 'Start Assessment →'}
                </button>
              ) : (
                <>
                  <button onClick={onOpenAuth} className="hero-btn-primary">
                    Start Skill Assessment →
                  </button>
                  <button onClick={() => setCurrentPage('editor')} className="hero-btn-secondary">
                    Launch Playground IDE
                  </button>
                </>
              )}
            </div>
          </PopSlide>
        </div>
      </section>

      {/* ─────────────────── HORIZONTAL BRICK MARQUEE (FINOUT STYLE) ─────────────────── */}
      <section className="brick-marquee-section">
        <div className="brick-marquee-container">
          {/* Row 1: Scrolling Left */}
          <div className="brick-marquee-row">
            <div className="brick-marquee-track brick-marquee-track-left">
              {[...marqueeRow1, ...marqueeRow1].map((item, idx) => (
                <div key={`r1-${idx}`} className="brick-marquee-cell">
                  <img src={item.iconUrl} alt={item.name} className={`brick-marquee-icon ${item.inverted ? 'brick-marquee-icon-inverted' : ''}`} />
                  <span className="brick-marquee-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="brick-marquee-row">
            <div className="brick-marquee-track brick-marquee-track-right">
              {[...marqueeRow2, ...marqueeRow2].map((item, idx) => (
                <div key={`r2-${idx}`} className="brick-marquee-cell">
                  <img src={item.iconUrl} alt={item.name} className={`brick-marquee-icon ${item.inverted ? 'brick-marquee-icon-inverted' : ''}`} />
                  <span className="brick-marquee-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Scrolling Left (offset speed) */}
          <div className="brick-marquee-row">
            <div className="brick-marquee-track brick-marquee-track-left" style={{ animationDuration: '52s' }}>
              {[...marqueeRow3, ...marqueeRow3].map((item, idx) => (
                <div key={`r3-${idx}`} className="brick-marquee-cell">
                  <img src={item.iconUrl} alt={item.name} className={`brick-marquee-icon ${item.inverted ? 'brick-marquee-icon-inverted' : ''}`} />
                  <span className="brick-marquee-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── MEET THE AGENTS SECTION ────────────── */}
      <section className="agents-section">
        <div className="grid-container">
          <PopSlide>
            {/* Header */}
            <div className="agents-header">
              <h2 className="agents-title">
                Meet the <span className="agents-title-highlight">agents</span>
              </h2>
              <p className="agents-subtitle">
                Your engineering journey just got 10x faster. Specialized autonomous agents that work together to calibrate skill tiers, architect roadmaps, and accelerate every phase of your developer career.
              </p>
            </div>

            {/* Winding Agent Timeline */}
            <div className="agents-timeline-wrapper">
              {/* Dynamic Connecting Umbilical Tether Cable SVG */}
              <svg 
                className="agents-tether-svg" 
                viewBox="0 0 1040 1200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="agentTetherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF7A59" stopOpacity="0.9" />
                    <stop offset="30%" stopColor="#10B981" stopOpacity="0.85" />
                    <stop offset="65%" stopColor="#A78BFA" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="agentTetherGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF7A59" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#10B981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                {/* Glow outline */}
                <path
                  d="M 330 180 C 440 210, 480 340, 430 400 C 370 470, 520 480, 640 430 C 720 390, 770 460, 730 540 M 710 650 C 640 760, 520 750, 480 820 C 440 900, 320 900, 270 940 C 230 980, 270 1050, 330 1030"
                  stroke="url(#agentTetherGlow)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Sharp cable line */}
                <path
                  d="M 330 180 C 440 210, 480 340, 430 400 C 370 470, 520 480, 640 430 C 720 390, 770 460, 730 540 M 710 650 C 640 760, 520 750, 480 820 C 440 900, 320 900, 270 940 C 230 980, 270 1050, 330 1030"
                  stroke="url(#agentTetherGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Agents Rows */}
              {agentsData.map((agent, i) => (
                <div 
                  key={agent.id} 
                  className={`agent-row ${agent.mascotAlign === 'right' ? 'reverse' : ''}`}
                >
                  {/* Astronaut Mascot */}
                  <div className="agent-mascot-wrap">
                    <div className={`agent-mascot-card mascot-${i + 1}`}>
                      <img 
                        src={agent.mascot} 
                        alt={agent.name} 
                        className="agent-mascot-img"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Agent Info & Interactive Quote */}
                  <div className="agent-content">
                    <h3 className="agent-name" style={{ color: agent.titleColor }}>
                      {agent.name}
                    </h3>
                    <p className="agent-subtitle-tag">
                      {agent.subtitle}
                    </p>
                    <p className="agent-desc">
                      {agent.desc}
                    </p>

                    {/* Speech Quote Card with emerald quote mark */}
                    <div 
                      className="agent-quote-card"
                      onClick={() => setCurrentPage(agent.page)}
                      title={`Open ${agent.name}`}
                    >
                      <span className="agent-quote-icon">“</span>
                      <p className="agent-quote-text">
                        {agent.quote}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PopSlide>
        </div>
      </section>


      {/* ─────────────── CTA BANNER ────────────── */}
      <section style={{ padding:'90px 0 120px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-light)' }}>
        <div className="grid-container">
          <PopSlide>
            <div style={s.banner}>
              <div style={s.bannerContent}>
                <h2 style={s.bannerTitle}>
                  Your development<br />is lifting off.
                </h2>
                <p style={s.bannerDesc}>
                  Join Codepolarity today. Get your personalized roadmap,
                  practice in the browser, and track your journey to expertise.
                </p>
                <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginTop: 8 }}>
                  {user ? (
                    <button onClick={() => setCurrentPage('roadmaps')} style={s.bannerBtn}>
                      Continue Learning →
                    </button>
                  ) : (
                    <>
                      <button onClick={onOpenAuth} style={s.bannerBtn}>
                        Get started — it's free
                      </button>
                      <button onClick={() => setCurrentPage('editor')} style={s.bannerBtnOutline}>
                        Try the IDE
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </PopSlide>
        </div>
      </section>

      {/* ─────────────────── FOOTER ──────────────── */}
      <Footer setCurrentPage={setCurrentPage} onOpenAuth={onOpenAuth} />
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   Page-level styles
───────────────────────────────────────────────────── */
const s = {
  /* FEATURES */
  featSection: {
    padding: '100px 0 120px',
    background: '#0A0D14',
    position: 'relative',
    zIndex: 1,
  },
  featRow: {
    display: 'flex',
    gap: 72,
    alignItems: 'center',
  },
  featCopy: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  featTitle: {
    fontFamily: "'Platform-Medium-Web', sans-serif",
    fontWeight: 500,
    lineHeight: 1.15,
    letterSpacing: '-0.025em',
    color: '#F3F4F6',
    fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
    marginBottom: 18,
  },
  featDesc: {
    fontFamily: "'MaisonNeue-Book', sans-serif",
    maxWidth: 480,
    color: '#9CA3AF',
    fontSize: '1.02rem',
    lineHeight: 1.65,
  },
  featMedia: { flex: 1, minWidth: 0 },

  /* BANNER */
  banner: {
    position: 'relative',
    background: 'var(--theme-surface)',
    border: '1px solid var(--border-light)',
    borderRadius: 8,
    padding: '72px 64px',
    overflow: 'hidden',
    boxShadow: 'none',
  },
  bannerContent: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 600,
  },
  bannerTitle: {
    fontFamily: "'Platform-Medium-Web', sans-serif",
    fontWeight: 500,
    lineHeight: 1.08,
    letterSpacing: '-0.025em',
    color: 'var(--text-main)',
    fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
  },
  bannerDesc: {
    fontFamily: "'MaisonNeue-Book', sans-serif",
    color: 'var(--text-muted)',
    maxWidth: 480,
    fontSize: '1.05rem',
    lineHeight: 1.65,
  },
  bannerBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 28px',
    borderRadius: 4,
    background: 'var(--btn-primary-bg)',
    color: 'var(--btn-primary-text)',
    fontFamily: "'MaisonNeue-Demi', sans-serif",
    fontWeight: 600,
    fontSize: '0.9rem',
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '-0.01em',
    boxShadow: 'none',
    transition: 'opacity 0.2s',
  },
  bannerBtnOutline: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 28px',
    borderRadius: 4,
    background: 'var(--theme-surface-container)',
    color: 'var(--text-main)',
    fontFamily: "'MaisonNeue-Demi', sans-serif",
    fontWeight: 600,
    fontSize: '0.9rem',
    border: '1px solid var(--border-light)',
    cursor: 'pointer',
    letterSpacing: '-0.01em',
    boxShadow: 'none',
    transition: 'background-color 0.2s, border-color 0.2s',
  },

  /* FOOTER */
  footer: {
    background: 'var(--bg-primary)',
    borderTop: '1px solid var(--border-light)',
    overflow: 'hidden',
  },
  footerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '64px 64px 48px',
    borderBottom: '1px solid var(--border-light)',
  },
  footerTaglineWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  footerTopLogo: {
    height: 32,
    width: 'auto',
    display: 'block',
    filter: 'var(--logo-filter)',
    opacity: 0.9,
  },
  footerTagline: {
    fontSize: '0.95rem',
    fontWeight: 400,
    color: 'var(--text-muted)',
    letterSpacing: '-0.01em',
    margin: 0,
    maxWidth: 200,
    lineHeight: 1.5,
  },
  footerCols: {
    display: 'flex',
    gap: 64,
  },
  footerCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 110,
  },
  footerColTitle: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-dim)',
    marginBottom: 4,
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  footerLink: {
    fontSize: '0.875rem',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    lineHeight: 1.5,
    transition: 'color 0.2s',
  },
  footerBrand: {
    width: '100%',
    overflow: 'hidden',
    userSelect: 'none',
    padding: '12px 0 0',
  },
  footerBrandText: {
    display: 'block',
    fontSize: 'clamp(4.5rem, 15.5vw, 16rem)',
    fontWeight: 900,
    letterSpacing: '-0.055em',
    color: 'var(--theme-tonal)',
    lineHeight: 0.86,
    paddingLeft: '0.35%',
    fontFamily: 'var(--font-sans)',
    WebkitTextStroke: '1px var(--border-light)',
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 64px',
    borderTop: '1px solid var(--border-light)',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerCopyright: {
    fontSize: '0.8rem',
    color: 'var(--text-dim)',
    letterSpacing: '-0.01em',
  },
  footerLegal: {
    fontSize: '0.8rem',
    color: 'var(--text-dim)',
    cursor: 'pointer',
    transition: 'color 0.2s',
    letterSpacing: '-0.01em',
  },
};

export default LandingPage;
