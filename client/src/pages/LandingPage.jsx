import React, { useEffect, useRef, useState } from 'react';
import { Zap, Route, Terminal, Activity, Sparkles, ArrowRight, Keyboard, BookOpen } from 'lucide-react';

import TypedText from '../components/TypedText';
import Footer from '../components/Footer';
import FaqAccordion from '../components/ui/faq-accordion';
import { PerspectiveGrid } from '../components/ui/perspective-grid';
import logoMark from '../assets/logo.svg';
import logoCircle from '../assets/logo_circle.svg';
import logoText from '../assets/logo_text.svg';
import ClimblabsHero from '../components/ClimblabsHero';
import BrutalistFeatures from '../components/BrutalistFeatures';

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
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
   Codepolarity FAQ Data (Synchronized with Schema.org FAQPage)
───────────────────────────────────────────────────── */
const codepolarityFaqs = [
  {
    question: "What is Codepolarity?",
    answer: "Codepolarity is an integrated software engineering learning platform and developer career engine. It unifies modular curriculum roadmaps, cloud execution environments, syntax intelligence, and code typing telemetry into a single high-performance workspace."
  },
  {
    question: "What makes Codepolarity different from LeetCode or traditional platforms?",
    answer: "Unlike platforms that focus solely on competitive algorithmic puzzles, Codepolarity provides a holistic engineering journey: end-to-end curriculum roadmaps, real-world sandboxed IDE development, tactile coding velocity drills (Typlab), and diagnostic skill calibration that reflects practical software craftsmanship."
  },
  {
    question: "Are local development environments required to run code?",
    answer: "No local configuration is necessary. Codepolarity delivers isolated in-browser runtimes with real-time compilation, execution, and automated test runners across all major programming languages."
  },
  {
    question: "How are the interactive developer roadmaps structured?",
    answer: "Every roadmap functions as an end-to-end technical syllabus. Milestones break complex concepts into progressive modules complete with core architectural theory, interactive challenges, and reference implementations."
  },
  {
    question: "What is the role of Typlab in developer education?",
    answer: "Writing code requires distinct tactile ergonomics—navigating brackets, operators, indentation, and language keywords that standard typing tests ignore. Typlab tracks keystroke telemetry on production code snippets to build native fluency."
  },
  {
    question: "How does the technical assessment calibrate developer skill tiers?",
    answer: "The assessment evaluates algorithmic reasoning, time and space complexity, API design, and system architecture. The engine scores answers to diagnose strengths and knowledge gaps, mapping directly to recommended curriculum tracks."
  },
  {
    question: "Is Codepolarity free to use?",
    answer: "Yes. Core developer roadmaps, the browser sandbox IDE, Typlab keystroke drills, and initial skill assessments are freely accessible to developers worldwide."
  }
];

/* ─────────────────────────────────────────────────────
   LANDING PAGE COMPONENT
───────────────────────────────────────────────────── */
const LandingPage = ({ user, onOpenAuth, setCurrentPage, theme = 'dark', onToggleTheme }) => {
  return (
    <main
      id="main-content"
      aria-label="Codepolarity Platform Overview"
      style={{ overflowX: 'hidden', background: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh' }}
    >
      
      {/* ─────────────────── CLIMBLABS PIXEL DISSOLUTION HERO ─────────────────── */}
      <ClimblabsHero
        user={user}
        onOpenAuth={onOpenAuth}
        setCurrentPage={setCurrentPage}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* ─────────────────── HORIZONTAL BRICK MARQUEE (TECH STACK) ─────────────────── */}
      <section
        id="tech-stack"
        aria-label="Supported Developer Tech Stack and Frameworks"
        className="brick-marquee-section"
      >
        <h2 className="sr-only">Supported Programming Languages, Frameworks, and Cloud Tech Stack</h2>
        <div className="brick-marquee-container">
          {/* Row 1: Scrolling Left */}
          <div className="brick-marquee-row" role="region" aria-label="Languages and cloud platforms">
            <div className="brick-marquee-track brick-marquee-track-left">
              {[...marqueeRow1, ...marqueeRow1].map((item, idx) => (
                <div key={`r1-${idx}`} className="brick-marquee-cell">
                  <img
                    src={item.iconUrl}
                    alt={`${item.name} developer ecosystem technology icon`}
                    width="24"
                    height="24"
                    loading="lazy"
                    decoding="async"
                    className={`brick-marquee-icon ${item.inverted ? 'brick-marquee-icon-inverted' : ''}`}
                  />
                  <span className="brick-marquee-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Scrolling Right */}
          <div className="brick-marquee-row" role="region" aria-label="Databases, containers, and architecture tools">
            <div className="brick-marquee-track brick-marquee-track-right">
              {[...marqueeRow2, ...marqueeRow2].map((item, idx) => (
                <div key={`r2-${idx}`} className="brick-marquee-cell">
                  <img
                    src={item.iconUrl}
                    alt={`${item.name} developer ecosystem technology icon`}
                    width="24"
                    height="24"
                    loading="lazy"
                    decoding="async"
                    className={`brick-marquee-icon ${item.inverted ? 'brick-marquee-icon-inverted' : ''}`}
                  />
                  <span className="brick-marquee-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Scrolling Left (offset speed) */}
          <div className="brick-marquee-row" role="region" aria-label="Backend frameworks and foundational languages">
            <div className="brick-marquee-track brick-marquee-track-left" style={{ animationDuration: '52s' }}>
              {[...marqueeRow3, ...marqueeRow3].map((item, idx) => (
                <div key={`r3-${idx}`} className="brick-marquee-cell">
                  <img
                    src={item.iconUrl}
                    alt={`${item.name} developer ecosystem technology icon`}
                    width="24"
                    height="24"
                    loading="lazy"
                    decoding="async"
                    className={`brick-marquee-icon ${item.inverted ? 'brick-marquee-icon-inverted' : ''}`}
                  />
                  <span className="brick-marquee-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── ARCHITECTURAL BRUTALIST FEATURES SECTION ────────────── */}
      <PopSlide>
        <BrutalistFeatures
          setCurrentPage={setCurrentPage}
          onOpenAuth={onOpenAuth}
          user={user}
        />
      </PopSlide>

      {/* ─────────────── FAQ SECTION ────────────── */}
      <section
        id="faq-section"
        aria-label="Frequently Asked Questions"
        className="faq-section"
      >
        <div className="grid-container">
          <PopSlide>
            <FaqAccordion
              title="Got questions? We've got answers."
              subtitle="Everything you need to know about the Codepolarity career engine, autonomous agents, and sandboxed runtimes."
              items={codepolarityFaqs}
            />
          </PopSlide>
        </div>
      </section>

      {/* ─────────────── MINIMAL RECTANGLE CTA BANNER ────────────── */}
      <section
        id="cta-banner"
        aria-labelledby="cta-banner-title"
        className="cta-rect-section"
      >
        <div className="grid-container">
          <PopSlide>
            <div className="cta-rect-banner">
              <PerspectiveGrid rows={24} cols={24} scale={1.5} className="cta-perspective-grid" showOverlay={false} />
              <div className="cta-rect-left">
                <h2 id="cta-banner-title" className="cta-rect-title">
                  Accelerate your engineering trajectory.
                </h2>
                <p className="cta-rect-desc">
                  Experience structured curriculum roadmaps, cloud execution sandboxes, and precision velocity drills built for ambitious software engineers.
                </p>
              </div>

              <div className="cta-rect-right">
                <div className="cta-rect-actions">
                  {user ? (
                    <button
                      id="cta-btn-continue"
                      onClick={() => setCurrentPage('roadmaps')}
                      className="hero-btn-primary"
                      aria-label="Continue learning on developer roadmaps"
                    >
                      Resume Curriculum →
                    </button>
                  ) : (
                    <>
                      <button
                        id="cta-btn-start"
                        onClick={onOpenAuth}
                        className="hero-btn-primary"
                        aria-label="Sign in to Codepolarity"
                      >
                        Sign In →
                      </button>
                      <button
                        id="cta-btn-playground"
                        onClick={() => setCurrentPage('editor')}
                        className="hero-btn-secondary"
                        aria-label="Launch the online sandbox code editor"
                      >
                        Open Sandbox IDE
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
    </main>
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
    fontFamily: "var(--font-sans)",
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: '-0.025em',
    color: '#F3F4F6',
    fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
    marginBottom: 18,
  },
  featDesc: {
    fontFamily: "var(--font-sans)",
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
    fontFamily: "var(--font-sans)",
    fontWeight: 700,
    lineHeight: 1.08,
    letterSpacing: '-0.025em',
    color: 'var(--text-main)',
    fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
  },
  bannerDesc: {
    fontFamily: "var(--font-sans)",
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
    fontFamily: "var(--font-sans)",
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
    fontFamily: "var(--font-sans)",
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
