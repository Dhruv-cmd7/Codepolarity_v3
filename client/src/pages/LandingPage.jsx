import React, { useEffect, useRef, useState } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import TypedText from '../components/TypedText';
import dsLogo from '../assets/ds_logo.svg';

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

/* ─────────────────────────────────────────────────────
   featureStyles – defined BEFORE features to avoid
   "Cannot access before initialization" error
───────────────────────────────────────────────────── */
const fs = {
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 24,
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.04), 0 4px 12px -2px rgba(0, 0, 0, 0.02)',
    transition: 'var(--transition-spring)',
  },
  sectionTag: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#7c3aed',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 8,
  },
  barRow: { display: 'flex', flexDirection: 'column', gap: 6 },
  barLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8125rem',
    color: '#475569',
    fontWeight: 500,
  },
  barBg: { height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99, transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)' },
  resultBadge: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f1f5f9',
    paddingTop: 16,
    marginTop: 8,
  },
  node: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    position: 'relative',
    paddingBottom: 8,
  },
  nodeDot: {
    width: 22, height: 22, borderRadius: '50%',
    flexShrink: 0, display: 'flex', alignItems: 'center',
    justifyContent: 'center', marginTop: 2, zIndex: 1,
    transition: 'var(--transition-smooth)',
  },
  nodeLine: {
    position: 'absolute', left: 10, top: 24,
    width: 2, height: '100%', background: '#e2e8f0',
  },
  nodeText: { display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 12 },
  editorWrap: {
    background: '#ffffff', border: '1px solid #e2e8f0',
    borderRadius: 24, overflow: 'hidden',
    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.04)',
    transition: 'var(--transition-spring)',
  },
  editorBar: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    borderBottom: '1px solid #e2e8f0', background: '#f8fafc',
  },
  editorPill: {
    fontSize: '0.7rem', padding: '4px 10px',
    borderRadius: 99, background: '#f1f5f9',
    color: '#475569', fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    border: '1px solid #e2e8f0',
    transition: 'var(--transition-smooth)',
  },
  code: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem', lineHeight: 1.7,
    color: '#1e293b', whiteSpace: 'pre', margin: 0,
    padding: '20px',
    background: '#ffffff',
  },
  console: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 20px',
    borderTop: '1px solid #e2e8f0', background: '#0f172a',
  },
};

/* ─────────────────────────────────────────────────────
   features array – uses fs (featureStyles) safely
───────────────────────────────────────────────────── */
const features = [
  {
    idx: 0,
    label: 'Level Diagnostics',
    title: 'Know exactly where you stand.',
    desc: 'A 10-question calibration assessment evaluates your programming logic, web fundamentals, data structures, and AI concepts — then assigns you a precise study tier.',
    cta: 'Take assessment →',
    page: 'assessment',
    visual: (
      <div style={fs.card} className="card">
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb', boxShadow:'0 0 8px rgba(37, 99, 235, 0.5)' }} />
          <span style={{ fontSize:'0.75rem', fontWeight:600, color:'#2563eb', letterSpacing:'0.04em', textTransform: 'uppercase' }}>Calibration Active</span>
        </div>
        {[
          { label: 'Programming Logic', val: 90, color: '#2563eb' },
          { label: 'Web Fundamentals',  val: 72, color: '#059669' },
          { label: 'Data Structures',   val: 55, color: '#d97706' },
          { label: 'AI / ML Concepts',  val: 38, color: '#dc2626' },
        ].map((item) => (
          <div key={item.label} style={fs.barRow}>
            <div style={fs.barLabel}>
              <span>{item.label}</span>
              <span style={{ color: item.color, fontWeight: '600' }}>{item.val}%</span>
            </div>
            <div style={fs.barBg}>
              <div style={{ ...fs.barFill, width:`${item.val}%`, background:item.color }} />
            </div>
          </div>
        ))}
        <div style={fs.resultBadge}>
          <span style={{ fontSize:'0.75rem', color:'#94a3b8', fontWeight:600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calibrated Level</span>
          <span style={{ fontSize:'1rem', color:'#2563eb', fontWeight:600 }}>Intermediate</span>
        </div>
      </div>
    ),
  },
  {
    idx: 1,
    label: 'Career Roadmaps',
    title: 'A map for every destination.',
    desc: 'Choose your profession — AI Developer, Frontend, or Backend — and follow a structured node-based learning pathway. Each node links to hand-picked resources.',
    cta: 'Explore roadmaps →',
    page: 'roadmaps',
    visual: (
      <div style={{ ...fs.card, gap: 4 }} className="card">
        <div style={fs.sectionTag}>AI Developer Path</div>
        {[
          { done: true,  label: 'Python & Data Libraries',       sub: 'NumPy, Pandas, file handling' },
          { done: true,  label: 'ML Math Foundations',           sub: 'Linear algebra, calculus, probability' },
          { done: false, label: 'Classical Machine Learning',    sub: 'Scikit-Learn, regressions, trees' },
          { done: false, label: 'Deep Learning & Neural Nets',   sub: 'PyTorch, backprop, CNNs' },
          { done: false, label: 'NLP, Transformers & LLMs',     sub: 'Hugging Face, RAG, prompting' },
        ].map((node, i, arr) => (
          <div key={i} style={fs.node}>
            <div style={{ 
              ...fs.nodeDot, 
              background: node.done ? '#2563eb' : '#f1f5f9', 
              border: node.done ? 'none' : '1px solid #cbd5e1',
              boxShadow: node.done ? '0 0 10px rgba(37, 99, 235, 0.3)' : 'none'
            }}>
              {node.done && <span style={{ color:'#fff', fontSize:'10px', fontWeight:700 }}>✓</span>}
            </div>
            {i < arr.length - 1 && <div style={fs.nodeLine} />}
            <div style={fs.nodeText}>
              <span style={{ color: node.done ? '#0f172a' : '#64748b', fontWeight: 500, fontSize:'0.875rem' }}>{node.label}</span>
              <span style={{ color:'#94a3b8', fontSize:'0.75rem' }}>{node.sub}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    idx: 2,
    label: 'Online Code Editor',
    title: 'Practice without leaving your browser.',
    desc: 'Write JavaScript algorithms, build HTML layouts, and run code in the sandbox. Save your scripts to your profile with one click — no setup required.',
    cta: 'Open editor →',
    page: 'editor',
    visual: (
      <div style={fs.editorWrap} className="card">
        <div style={fs.editorBar}>
          <div style={{ display:'flex', gap:6 }}>
            {['#ff5f56','#ffbd2e','#27c93f'].map((c,i) => (
              <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }} />
            ))}
          </div>
          <span style={{ fontSize:'0.75rem', color:'#64748b', fontFamily:'var(--font-mono)' }}>fibonacci.js</span>
          <div style={{ display:'flex', gap:8 }}>
            <div style={fs.editorPill}>Run ▶</div>
            <div style={fs.editorPill}>Save ⬆</div>
          </div>
        </div>
        <pre style={fs.code}>{`function fibonacci(n) {
  const seq = [0, 1];
  while (seq.length < n) {
    const len = seq.length;
    seq.push(seq[len-1] + seq[len-2]);
  }
  return seq;
}

console.log(fibonacci(8));`}</pre>
        <div style={fs.console}>
          <span style={{ color:'#2563eb' }}>▶</span>
          <span style={{ color:'#10b981', fontFamily:'var(--font-mono)', fontSize:'0.8rem', fontWeight: '500' }}>[0, 1, 1, 2, 3, 5, 8, 13]</span>
        </div>
      </div>
    ),
  },
];

/* ─────────────────────────────────────────────────────
   LANDING PAGE COMPONENT
───────────────────────────────────────────────────── */
const LandingPage = ({ user, onOpenAuth, setCurrentPage }) => {
  const [managerHovered, setManagerHovered] = useState(false);

  return (
    <div style={{ overflowX: 'hidden', background: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh' }}>
      
      {/* ─────────────────── Ambient Orbs ─────────────────── */}
      <div className="glow-orb glow-orb-cyan" style={{ top: '8%', left: '15%', width: '550px', height: '550px' }} />
      <div className="glow-orb glow-orb-purple" style={{ top: '35%', right: '10%', width: '600px', height: '600px' }} />
      <div className="glow-orb glow-orb-cyan" style={{ bottom: '20%', left: '5%', width: '500px', height: '500px' }} />

      {/* ─────────────────── HERO ─────────────────── */}
      <section style={s.hero}>
        <ParticleBackground style={{ opacity: 0.15 }} />
        <div style={s.heroGlow} />

        <div style={s.heroInner}>
          <PopSlide>
            <div style={s.chip} className="chip">
              <span style={s.chipDot} />
              Zero-gravity code learning
            </div>
          </PopSlide>

          <PopSlide delay={80}>
            <h1 style={s.h1} className="display-xl">
              Learning is{' '}
              <span className="text-gradient-cyan text-gradient-glow" style={{ fontWeight: '600' }}>
                <TypedText
                  words={['lifting off.', 'taking flight.', 'in orbit.', 'weightless.']}
                  speed={75}
                  pause={2200}
                />
              </span>
            </h1>
          </PopSlide>

          <PopSlide delay={160}>
            <p style={s.heroDesc} className="body-lg">
              Codepolarity evaluates your programming level, generates
              interactive career pathways, curates the best internet resources,
              and lets you practice code — all synced to your developer profile.
            </p>
          </PopSlide>

          <PopSlide delay={240}>
            <div style={s.heroCtas}>
              {user ? (
                <button
                  onClick={() => setCurrentPage(user.completedQuiz ? 'roadmaps' : 'assessment')}
                  className="btn-primary"
                  style={s.mainCtaBtn}
                >
                  {user.completedQuiz ? 'Continue learning →' : 'Start assessment →'}
                </button>
              ) : (
                <>
                  <button onClick={onOpenAuth} className="btn-primary" style={s.mainCtaBtn}>
                    Get started — it's free
                  </button>
                  <button onClick={() => setCurrentPage('editor')} className="btn-secondary" style={s.secCtaBtn}>
                    Try the editor
                  </button>
                </>
              )}
            </div>
          </PopSlide>
        </div>

        <div style={s.scrollLine} />
      </section>

      {/* ─────────────── MANAGER SURFACE ────────────── */}
      <section style={s.surface}>
        <div className="grid-container">
          <PopSlide>
            <p style={s.tag}>Platform Overview</p>
            <h2 style={s.h2} className="display-md">The next-gen learning command center.</h2>
          </PopSlide>

          <PopSlide delay={100}>
            <div 
              style={{
                ...s.window,
                borderColor: managerHovered ? '#cbd5e1' : '#e2e8f0',
                boxShadow: managerHovered 
                  ? '0 20px 40px -10px rgba(0, 0, 0, 0.08), 0 8px 16px -4px rgba(0, 0, 0, 0.04)' 
                  : '0 10px 30px -5px rgba(0, 0, 0, 0.04)',
              }}
              onMouseEnter={() => setManagerHovered(true)}
              onMouseLeave={() => setManagerHovered(false)}
            >
              {/* Window chrome */}
              <div style={s.windowBar}>
                <div style={{ display:'flex', gap:6 }}>
                  {['#ff5f56','#ffbd2e','#27c93f'].map((c,i) => (
                    <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }} />
                  ))}
                </div>
                <span style={s.windowTitle}>Codepolarity — Manager Surface</span>
                <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                  <div style={s.windowPill}>
                    <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:'#10b981', marginRight:5 }} />
                    Live System
                  </div>
                  <div style={s.windowPill}>v1.0.0</div>
                </div>
              </div>

              {/* 3-column body */}
              <div style={s.windowBody}>
                {/* Sidebar */}
                <div style={s.sidebar}>
                  <div style={s.sidebarLabel}>Active Agents</div>
                  {[
                    { name:'assessment_calibrator', status:'running', col:'#2563eb' },
                    { name:'roadmap_parser',        status:'running', col:'#2563eb' },
                    { name:'sandbox_runtime',       status:'idle',    col:'#94a3b8' },
                    { name:'mongodb_seeder',        status:'done',    col:'#10b981' },
                  ].map((a) => (
                    <div key={a.name} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:a.col, flexShrink:0 }} />
                      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                        <span style={{ fontSize:'0.75rem', color:'#475569', fontFamily:'var(--font-mono)' }}>{a.name}</span>
                        <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.05em', color:a.col, textTransform:'uppercase' }}>{a.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Console log */}
                <div style={s.console}>
                  {[
                    { t:'11:50:01', tag:'SYSTEM',   col:'#3b82f6', msg:'Codepolarity initialized on port 3000.' },
                    { t:'11:50:02', tag:'DATABASE', col:'#10b981', msg:'Connected to MongoDB: 127.0.0.1:27017/codepolarity.' },
                    { t:'11:50:03', tag:'PARSER',   col:'#f59e0b', msg:'Career roadmaps loaded: AI Developer, Frontend, Backend.' },
                    { t:'11:50:05', tag:'AGENT',    col:'#a855f7', msg:'Assessment calibrator waiting for student input…' },
                    { t:'11:50:07', tag:'SANDBOX',  col:'#6b7280', msg:'Code editor templates pre-loaded: 4 exercises available.' },
                    { t:'11:50:09', tag:'READY',    col:'#00f5d4', msg:'All systems nominal. Platform accepting connections.' },
                  ].map((line, i) => (
                    <div key={i} style={{ display:'flex', gap:10, fontSize:'0.78rem', whiteSpace:'nowrap', marginBottom:10 }}>
                      <span style={{ color:'#64748b', flexShrink:0, fontFamily:'var(--font-mono)' }}>{line.t}</span>
                      <span style={{ color:line.col, fontWeight:600, flexShrink:0, fontFamily:'var(--font-mono)' }}>[{line.tag}]</span>
                      <span style={{ color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', fontFamily:'var(--font-mono)' }}>{line.msg}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div style={s.stats}>
                  {[
                    { val:'3',    label:'Roadmaps',  col:'#0f172a' },
                    { val:'10',   label:'Quiz Qs',   col:'#0f172a' },
                    { val:'4',    label:'Templates', col:'#0f172a' },
                    { val:'Live', label:'MongoDB',   col:'#10b981' },
                  ].map((stat, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <div style={{ height:1, background:'#e2e8f0', margin:'0 12px' }} />}
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 0' }}>
                        <span style={{ fontSize:'1.375rem', fontWeight:600, color:stat.col, lineHeight:1, letterSpacing:'-0.02em' }}>{stat.val}</span>
                        <span style={{ fontSize:'0.65rem', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:6, fontWeight:600 }}>{stat.label}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </PopSlide>
        </div>
      </section>

      {/* ─────────────── FEATURE ROWS ────────────── */}
      <section style={s.featSection}>
        <div className="grid-container">
          {features.map((feat, i) => (
            <PopSlide key={i} delay={60 * i}>
              <div style={{ ...s.featRow, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
                <div style={s.featCopy}>
                  <p style={s.tag}>{feat.label}</p>
                  <h2 style={s.featTitle} className="display-md">{feat.title}</h2>
                  <p style={s.featDesc} className="body-md">{feat.desc}</p>
                  <button
                    onClick={() => setCurrentPage(feat.page)}
                    className="btn-secondary"
                    style={{ marginTop:32, alignSelf:'flex-start' }}
                  >
                    {feat.cta}
                  </button>
                </div>
                <div style={s.featMedia}>{feat.visual}</div>
              </div>
              {i < features.length - 1 && (
                <div style={{ height:1, background:'#e2e8f0', margin:'80px 0' }} />
              )}
            </PopSlide>
          ))}
        </div>
      </section>

      {/* ─────────────── CTA BANNER ────────────── */}
      <section style={{ padding:'80px 0 120px' }}>
        <div className="grid-container">
          <PopSlide>
            <div style={s.banner}>
              <ParticleBackground style={{ opacity: 0.12 }} />
              <div style={s.bannerContent}>
                <h2 style={s.bannerTitle} className="display-lg">
                  Your development<br />is lifting off.
                </h2>
                <p style={s.bannerDesc} className="body-md">
                  Join Codepolarity today. Get your personalized roadmap,
                  practice in the browser, and track your journey to expertise.
                </p>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  {user ? (
                    <button onClick={() => setCurrentPage('profile')} style={s.bannerBtn}>
                      View dashboard →
                    </button>
                  ) : (
                    <>
                      <button onClick={onOpenAuth} style={s.bannerBtn}>
                        Get started — it's free
                      </button>
                      <button onClick={() => setCurrentPage('editor')} style={s.bannerBtnOutline}>
                        Try the sandbox
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
      <footer style={s.footer}>

        {/* ── Top nav row: tagline left, link columns right ── */}
        <div style={s.footerTop}>
          <div style={s.footerTaglineWrap}>
            <img src={dsLogo} alt="Codepolarity" style={s.footerTopLogo} />
            <p style={s.footerTagline}>Build without gravity.</p>
          </div>

          <div style={s.footerCols}>
            {[
              {
                title: 'Platform',
                links: ['Assessment','Roadmaps','Code Editor','Dashboard','Resources'],
              },
              {
                title: 'Paths',
                links: ['AI Developer','Frontend Web','Backend Web','Beginner','Advanced'],
              },
              {
                title: 'Company',
                links: ['About','Blog','Changelog','Privacy','Terms'],
              },
            ].map((col) => (
              <div key={col.title} style={s.footerCol}>
                <p style={s.footerColTitle}>{col.title}</p>
                {col.links.map((l) => (
                  <span key={l} style={s.footerLink}>{l}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Giant brand name ── */}
        <div style={s.footerBrand}>
          <span style={s.footerBrandText}>Codepolarity</span>
        </div>

        {/* ── Bottom legal bar ── */}
        <div style={s.footerBottom}>
          <span style={s.footerCopyright}>© {new Date().getFullYear()} Codepolarity. All rights reserved.</span>
          <div style={{ display:'flex', gap:28 }}>
            {['Privacy Policy','Terms of Service','Contact'].map((l) => (
              <span key={l} style={s.footerLegal}>{l}</span>
            ))}
          </div>
        </div>

      </footer>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   Page-level styles
───────────────────────────────────────────────────── */
const s = {
  /* HERO */
  hero: {
    position:'relative', minHeight:'100vh',
    display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    overflow:'hidden', paddingTop:120, paddingBottom:80,
  },
  heroGlow: {
    position:'absolute', inset:0,
    background:'radial-gradient(ellipse 80% 55% at 50% 40%, rgba(37, 99, 235, 0.05) 0%, transparent 65%)',
    pointerEvents:'none', zIndex:1,
  },
  heroInner: {
    position:'relative', zIndex:2,
    maxWidth:820, margin:'0 auto',
    padding:'0 32px', textAlign:'center',
    display:'flex', flexDirection:'column',
    alignItems:'center', gap:28,
  },
  chip: {
    display:'inline-flex', alignItems:'center', gap:8,
    padding:'6px 16px', borderRadius:999,
    border:'1px solid #e2e8f0', fontSize:'0.8rem',
    color:'#2563eb', fontWeight:500, letterSpacing:'0.02em',
    background:'#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  chipDot: {
    display:'inline-block', width:6, height:6,
    borderRadius:'50%', background:'#2563eb',
    boxShadow:'0 0 8px rgba(37, 99, 235, 0.5)',
  },
  h1: {
    fontWeight:400,
    lineHeight:1.1,
    letterSpacing:'-0.04em',
    color:'var(--text-main)',
  },
  heroDesc: {
    maxWidth:560,
    margin: '0 auto',
    color: '#64748b',
  },
  heroCtas: {
    display:'flex', gap:14, flexWrap:'wrap',
    justifyContent:'center', marginTop:12,
  },
  mainCtaBtn: {
    background: '#0f172a',
    color: '#ffffff',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
    padding: '12px 28px',
    fontSize: '0.95rem',
  },
  secCtaBtn: {
    padding: '12px 28px',
    fontSize: '0.95rem',
    background: '#ffffff',
    borderColor: '#e2e8f0',
  },
  scrollLine: {
    position:'absolute', bottom:40, left:'50%',
    transform:'translateX(-50%)',
    width:1, height:48,
    background:'linear-gradient(to bottom, transparent, rgba(37, 99, 235, 0.4))',
    zIndex:2,
  },

  /* MANAGER SURFACE */
  surface: { padding:'120px 0 60px', background:'transparent', position: 'relative', zIndex: 1 },
  tag: {
    fontSize:'0.75rem', fontWeight:600,
    color:'#2563eb', textTransform:'uppercase',
    letterSpacing:'0.08em', marginBottom:12,
  },
  h2: {
    fontWeight:400, lineHeight:1.15,
    letterSpacing:'-0.025em', color:'var(--text-main)',
    marginBottom:48, maxWidth:580,
  },
  window: {
    background:'#ffffff', border:'1px solid #e2e8f0',
    borderRadius:24, overflow:'hidden',
    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.04)',
    transition: 'border-color 0.4s, box-shadow 0.4s',
  },
  windowBar: {
    display:'flex', alignItems:'center', gap:12,
    padding:'14px 24px', background:'#ffffff',
    borderBottom:'1px solid #e2e8f0',
  },
  windowTitle: {
    fontSize:'0.75rem', color:'#64748b',
    fontFamily:'var(--font-mono)', marginLeft:8,
  },
  windowPill: {
    display: 'flex',
    alignItems: 'center',
    fontSize:'0.65rem', padding:'3px 10px',
    borderRadius:99, background:'#f1f5f9',
    color:'#475569', border:'1px solid #e2e8f0', fontFamily:'var(--font-mono)',
  },
  windowBody: {
    display:'grid',
    gridTemplateColumns:'210px 1fr 160px',
    minHeight:290,
  },
  sidebar: {
    borderRight:'1px solid #e2e8f0',
    padding:'24px 20px',
    background:'#f8fafc',
  },
  sidebarLabel: {
    fontSize:'0.65rem', fontWeight:600, color:'#94a3b8',
    textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:20,
  },
  console: {
    padding:'24px 20px', fontFamily:'var(--font-mono)',
    borderRight:'1px solid #e2e8f0', overflowX:'auto',
    background:'#0f172a',
  },
  stats: {
    padding:'16px', display:'flex',
    flexDirection:'column', justifyContent:'center',
    background:'#ffffff',
  },

  /* FEATURES */
  featSection: {
    padding:'80px 0 120px',
    borderTop:'1px solid #e2e8f0',
    background:'transparent',
    position: 'relative',
    zIndex: 1,
  },
  featRow: {
    display:'flex', gap:80, alignItems:'center',
  },
  featCopy: {
    flex:1, display:'flex', flexDirection:'column',
  },
  featTitle: {
    fontWeight:400, lineHeight:1.2,
    letterSpacing:'-0.02em', color:'var(--text-main)', marginBottom:20,
  },
  featDesc: {
    maxWidth:460,
    color: '#64748b',
  },
  featMedia: { flex:1, minWidth:0 },

  /* BANNER */
  banner: {
    position:'relative', background:'#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius:28, padding:'80px 72px', overflow:'hidden',
    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.05)',
  },
  bannerContent: {
    position:'relative', zIndex:2,
    display:'flex', flexDirection:'column',
    gap:24, maxWidth:550,
  },
  bannerTitle: {
    fontWeight:400, lineHeight:1.1,
    letterSpacing:'-0.03em', color:'#0f172a',
  },
  bannerDesc: {
    color:'#64748b', maxWidth:440,
  },
  bannerBtn: {
    display:'inline-flex', alignItems:'center', gap:8,
    padding:'12px 28px', borderRadius:999,
    background:'#0f172a', color:'#ffffff',
    fontFamily:'var(--font-sans)', fontWeight:500,
    fontSize:'0.9375rem', border:'none', cursor:'pointer',
    transition: 'var(--transition-spring)',
    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
  },
  bannerBtnOutline: {
    display:'inline-flex', alignItems:'center', gap:8,
    padding:'12px 28px', borderRadius:999,
    background:'#ffffff', color:'#0f172a',
    fontFamily:'var(--font-sans)', fontWeight:500,
    fontSize:'0.9375rem', border:'1px solid #e2e8f0', cursor:'pointer',
    transition: 'var(--transition-spring)',
    boxShadow: 'var(--shadow-sm)',
  },

  /* FOOTER */
  footer: {
    background: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  footerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '64px 64px 48px',
    borderBottom: '1px solid #e2e8f0',
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
    filter: 'brightness(0.15)',
    opacity: 0.9,
  },
  footerTagline: {
    fontSize: '0.95rem',
    fontWeight: 400,
    color: '#64748b',
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
    color: '#94a3b8',
    marginBottom: 4,
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  footerLink: {
    fontSize: '0.875rem',
    color: '#475569',
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
    color: '#f1f5f9',
    lineHeight: 0.86,
    paddingLeft: '0.35%',
    fontFamily: 'var(--font-sans)',
    WebkitTextStroke: '1px #cbd5e1',
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 64px',
    borderTop: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerCopyright: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    letterSpacing: '-0.01em',
  },
  footerLegal: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'color 0.2s',
    letterSpacing: '-0.01em',
  },
};

export default LandingPage;
