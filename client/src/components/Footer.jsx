import React from 'react';
import { AsciiGlitchRipple } from './ui/ascii-glitch-ripple';

// Crisp inline SVGs for social platforms
const SocialIcons = {
  GitHub: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  LinkedIn: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  ),
  YouTube: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  X: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Discord: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};

/**
 * Editorial Footer styled in Codepolarity's dark website theme:
 * - Canvas Background: var(--bg-primary, #0A0D14)
 * - Text & Accents: var(--text-main, #F3F4F6) & var(--text-muted, #9CA3AF) with Cyan highlights
 * - Only includes authentic pages & features native to this Codepolarity platform
 * - Includes interactive social icons with glow effects
 */
const Footer = ({ setCurrentPage, onOpenAuth }) => {
  const [showPrivacy, setShowPrivacy] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowPrivacy(false);
    };
    if (showPrivacy) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showPrivacy]);

  const navigateTo = (page) => {
    if (setCurrentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToFaq = () => {
    const faqEl = document.getElementById('faq-section');
    if (faqEl) {
      faqEl.scrollIntoView({ behavior: 'smooth' });
    } else if (setCurrentPage) {
      setCurrentPage('landing');
      setTimeout(() => {
        const el = document.getElementById('faq-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  };

  const columns = [
    {
      title: 'Platform',
      links: [
        { label: 'Overview', action: () => navigateTo('landing') },
        { label: 'Skill Assessment', action: () => navigateTo('assessment') },
        { label: 'Developer Roadmaps', action: () => navigateTo('roadmaps') },
        { label: 'Online IDE Sandbox', action: () => navigateTo('editor') },
        { label: 'Typlab Velocity', action: () => navigateTo('typlab') },
      ],
    },
    {
      title: 'Developer Tools',
      links: [
        { label: 'Skill Calibration Engine', action: () => navigateTo('assessment') },
        { label: 'Interactive Code Sandbox', action: () => navigateTo('editor') },
        { label: 'Keystroke Speed Lab', action: () => navigateTo('typlab') },
        { label: 'Curated Skill Pathways', action: () => navigateTo('roadmaps') },
        { label: 'Platform FAQs', action: scrollToFaq },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign In', action: () => (onOpenAuth ? onOpenAuth() : navigateTo('signin')) },
        { label: 'Create Account', action: () => (onOpenAuth ? onOpenAuth() : navigateTo('register')) },
        { label: 'Skill Benchmarking', action: () => navigateTo('assessment') },
        { label: 'Code Playground', action: () => navigateTo('editor') },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'GitHub Repository', href: 'https://github.com/Dhruv-cmd7/Codepolarity_v3', Icon: SocialIcons.GitHub },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: SocialIcons.LinkedIn },
        { label: 'YouTube', href: 'https://www.youtube.com/', Icon: SocialIcons.YouTube },
        { label: 'X (Twitter)', href: 'https://x.com/', Icon: SocialIcons.X },
        { label: 'Discord Community', href: 'https://discord.gg/', Icon: SocialIcons.Discord },
      ],
    },
  ];

  return (
    <footer style={styles.footerContainer}>
      <div style={styles.innerContent}>
        {/* Navigation Columns */}
        <div style={styles.columnsGrid} className="editorial-footer-cols">
          {columns.map((col, idx) => (
            <div key={idx} style={styles.column}>
              <h3 style={styles.columnTitle}>
                {col.title}
              </h3>
              <ul style={styles.linkList}>
                {col.links.map((item, lIdx) => (
                  <li key={lIdx} style={styles.listItem}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.linkWithIcon}
                        className="cp-footer-link cp-footer-social-link"
                      >
                        {item.Icon && (
                          <span className="cp-social-icon-box" aria-hidden="true">
                            <item.Icon />
                          </span>
                        )}
                        <AsciiGlitchRipple
                          as="span"
                          dur={800}
                          spread={1.2}
                          style={styles.linkText}
                        >
                          {item.label}
                        </AsciiGlitchRipple>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={item.action}
                        style={styles.linkButton}
                        className="cp-footer-link"
                      >
                        <AsciiGlitchRipple
                          as="span"
                          dur={800}
                          spread={1.2}
                          style={styles.linkText}
                        >
                          {item.label}
                        </AsciiGlitchRipple>
                      </button>
                    )}
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>

        {/* Generous Editorial Negative Space */}
        <div style={styles.negativeSpace} />

        {/* Bottom Row - Clean copyright and Privacy Policy */}
        <div style={styles.legalRow}>
          <span style={styles.legalCopyright}>
            ©{new Date().getFullYear()} Codepolarity. All&nbsp;Rights Reserved.
          </span>
          <button
            type="button"
            onClick={() => setShowPrivacy(true)}
            style={styles.legalLink}
            className="cp-footer-link"
            aria-haspopup="dialog"
          >
            <AsciiGlitchRipple as="span" dur={800} spread={1.2}>
              Privacy Policy
            </AsciiGlitchRipple>
          </button>
        </div>
      </div>

      {/* Full-width Divider Line */}
      <div style={styles.dividerLine} />

      {/* Giant Edge-to-Edge Typography Banner in Solid Color */}
      <div style={styles.brandBannerWrap}>
        <div style={styles.brandBannerInner}>
          <svg
            viewBox="0 0 1440 235"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={styles.brandSvg}
            preserveAspectRatio="xMidYMin meet"
          >
            <text
              x="50%"
              y="196"
              textAnchor="middle"
              fill={PALETTE.textMain}
              fontFamily="'Google Sans Flex', 'Google Sans', sans-serif"
              fontSize="254"
              fontWeight="700"
              letterSpacing="-3"
              style={{
                fontFamily: "'Google Sans Flex', 'Google Sans', sans-serif",
                fontSize: '254px',
                fontWeight: 700,
                letterSpacing: '-3px',
              }}
            >
              Codepolarity
            </text>
          </svg>
        </div>
      </div>

      {/* Privacy Policy Interactive Modal */}
      {showPrivacy && (
        <div
          style={styles.modalBackdrop}
          onClick={() => setShowPrivacy(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
        >
          <div
            style={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div>
                <h2 id="privacy-modal-title" style={styles.modalTitle}>
                  Privacy Policy
                </h2>
                <p style={styles.modalSubtitle}>
                  Effective {new Date().getFullYear()} · Codepolarity Platform
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                style={styles.modalCloseBtn}
                aria-label="Close Privacy Policy"
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <section style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>1. Data Protection & Security</h3>
                <p style={styles.modalText}>
                  Codepolarity is engineered for developer privacy. We encrypt user credentials and never monetize or sell personal calibration statistics or code repositories.
                </p>
              </section>

              <section style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>2. Sandboxed Code Execution</h3>
                <p style={styles.modalText}>
                  All snippets compiled or run in the Online IDE execute in isolated, ephemeral browser containers. No code is stored without your explicit action.
                </p>
              </section>

              <section style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>3. Telemetry & Calibration</h3>
                <p style={styles.modalText}>
                  Assessment calibrations and Typlab speed metrics are used solely to generate your dynamic skill benchmarking curve and personalized pathway roadmaps.
                </p>
              </section>

              <section style={styles.modalSection}>
                <h3 style={styles.modalSectionTitle}>4. User Rights & Data Ownership</h3>
                <p style={styles.modalText}>
                  You maintain complete ownership of your data. You may export or permanently delete your account, calibration logs, and history anytime.
                </p>
              </section>
            </div>

            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                style={styles.modalActionBtn}
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded micro styles for hover states, social icons & link transitions */}
      <style>{`
        @keyframes cpFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .cp-footer-link {
          position: relative;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          color: var(--text-muted, #9ca3af);
          transition: color 0.18s ease, transform 0.18s ease;
        }
        .cp-footer-link:hover {
          color: #38bdf8 !important;
          text-decoration: underline;
          text-underline-offset: 4px;
        }
        .cp-footer-social-link {
          gap: 10px;
        }
        .cp-social-icon-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim, #64748b);
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .cp-footer-social-link:hover .cp-social-icon-box {
          color: #38bdf8;
          transform: scale(1.1);
        }
        @media (max-width: 900px) {
          .editorial-footer-cols {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 36px 20px !important;
          }
        }
        @media (max-width: 540px) {
          .editorial-footer-cols {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </footer>
  );
};

const PALETTE = {
  bg: 'var(--bg-primary, #0a0d14)',
  surface: 'var(--theme-surface, #0f131a)',
  surfaceContainer: 'var(--theme-surface-container, #151b26)',
  textMain: 'var(--text-main, #f3f4f6)',
  textMuted: 'var(--text-muted, #9ca3af)',
  textDim: 'var(--text-dim, #64748b)',
  border: 'var(--border-light, rgba(255, 255, 255, 0.08))',
  accentCyan: 'var(--accent-cyan, #06b6d4)',
  accentBlue: 'var(--accent-blue, #3b82f6)',
};

const styles = {
  footerContainer: {
    position: 'relative',
    backgroundColor: PALETTE.bg,
    color: PALETTE.textMain,
    width: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily: "var(--font-sans)",
    paddingTop: '56px',
    borderTop: `1px solid ${PALETTE.border}`,
    margin: 0,
  },
  innerContent: {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 clamp(24px, 4.5vw, 64px)',
    boxSizing: 'border-box',
  },
  columnsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '32px clamp(20px, 3.5vw, 60px)',
    alignItems: 'flex-start',
    width: '100%',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  columnTitle: {
    fontFamily: "var(--font-sans)",
    fontSize: 'clamp(12px, 0.95vw, 14px)',
    fontWeight: 600,
    color: PALETTE.textMain,
    marginBottom: '20px',
    marginTop: 0,
    lineHeight: 1,
    letterSpacing: '-0.01em',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  listItem: {
    margin: 0,
    padding: 0,
    lineHeight: 1,
  },
  linkText: {
    fontSize: 'clamp(12px, 0.95vw, 14px)',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    lineHeight: 1.35,
    cursor: 'pointer',
    fontFamily: "var(--font-sans)",
  },
  linkWithIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: 'clamp(12px, 0.95vw, 14px)',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    lineHeight: 1.35,
    cursor: 'pointer',
    fontFamily: "var(--font-sans)",
  },
  linkButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    fontSize: 'clamp(12px, 0.95vw, 14px)',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    lineHeight: 1.35,
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: "var(--font-sans)",
  },
  negativeSpace: {
    minHeight: 'clamp(90px, 14vw, 190px)',
    width: '100%',
  },
  legalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: '22px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  legalCopyright: {
    fontSize: 'clamp(12px, 0.9vw, 14px)',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    color: PALETTE.textDim,
    fontFamily: "var(--font-sans)",
    lineHeight: 1,
  },
  legalLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    fontSize: 'clamp(12px, 0.9vw, 14px)',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    color: PALETTE.textMuted,
    cursor: 'pointer',
    fontFamily: "var(--font-sans)",
    textAlign: 'left',
    lineHeight: 1,
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 7, 12, 0.85)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
    padding: '20px',
    boxSizing: 'border-box',
    animation: 'cpFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  modalContainer: {
    backgroundColor: PALETTE.surface,
    border: `1px solid ${PALETTE.border}`,
    borderRadius: '16px',
    maxWidth: '620px',
    width: '100%',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
  },
  modalHeader: {
    padding: '24px 28px',
    borderBottom: `1px solid ${PALETTE.border}`,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: PALETTE.surface,
  },
  modalTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 700,
    color: PALETTE.textMain,
    letterSpacing: '-0.02em',
    fontFamily: 'var(--font-sans)',
  },
  modalSubtitle: {
    margin: '6px 0 0 0',
    fontSize: '13px',
    color: PALETTE.textMuted,
    fontFamily: 'var(--font-sans)',
  },
  modalCloseBtn: {
    background: 'transparent',
    border: `1px solid ${PALETTE.border}`,
    borderRadius: '8px',
    color: PALETTE.textMuted,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.15s ease',
  },
  modalBody: {
    padding: '24px 28px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: PALETTE.surface,
  },
  modalSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  modalSectionTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: '#0284c7',
    letterSpacing: '-0.01em',
    fontFamily: 'var(--font-sans)',
  },
  modalText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: 1.6,
    color: PALETTE.textMuted,
    fontFamily: 'var(--font-sans)',
  },
  modalFooter: {
    padding: '18px 28px',
    borderTop: `1px solid ${PALETTE.border}`,
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: PALETTE.surface,
  },
  modalActionBtn: {
    background: '#38BDF8',
    color: '#05070C',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    fontFamily: 'var(--font-sans)',
  },
  dividerLine: {
    width: '100%',
    height: '1px',
    backgroundColor: PALETTE.border,
  },
  brandBannerWrap: {
    width: '100%',
    overflow: 'hidden',
    userSelect: 'none',
    lineHeight: 0,
  },
  brandBannerInner: {
    marginTop: '-4px',
    width: '100%',
  },
  brandSvg: {
    width: '100%',
    height: 'auto',
    display: 'block',
    overflow: 'hidden',
  },

};

export default Footer;
