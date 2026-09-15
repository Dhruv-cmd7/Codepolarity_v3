import React from 'react';

/**
 * Editorial Footer styled in Codepolarity's dark website theme:
 * - Canvas Background: var(--bg-primary, #0A0D14)
 * - Text & Accents: var(--text-main, #F3F4F6) & var(--text-muted, #9CA3AF) with Cyan highlights
 * - Fonts: Google Sans (Brand, Headings, Body)
 * - Structure: Exact F-Suite 4-column asymmetric grid, divider, and 1440x235 aspect ratio
 */
const Footer = ({ setCurrentPage, onOpenAuth }) => {

  const columns = [
    {
      title: 'Membership',
      links: [
        { label: 'Leadership & Founding Members', action: () => setCurrentPage && setCurrentPage('about') },
        { label: 'Platform Demo', action: () => setCurrentPage && setCurrentPage('editor') },
        { label: 'Developer Compensation & Benchmarks', action: () => setCurrentPage && setCurrentPage('assessment') },
        { label: 'FAQs', action: () => {
          const faqEl = document.getElementById('faq-section');
          if (faqEl) faqEl.scrollIntoView({ behavior: 'smooth' });
          else if (setCurrentPage) setCurrentPage('landing');
        }},
        { label: 'Code Academy', action: () => setCurrentPage && setCurrentPage('roadmaps') },
      ],
    },
    {
      title: 'Events',
      links: [
        { label: 'Featured', action: () => setCurrentPage && setCurrentPage('roadmaps') },
        { label: 'Past', action: () => setCurrentPage && setCurrentPage('typlab') },
        { label: 'All Events', action: () => setCurrentPage && setCurrentPage('about') },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Acclaim', action: () => setCurrentPage && setCurrentPage('about') },
        { label: 'Our Story', action: () => setCurrentPage && setCurrentPage('about') },
        { label: 'Leadership', action: () => setCurrentPage && setCurrentPage('about') },
        { label: 'Blog', action: () => setCurrentPage && setCurrentPage('about') },
        { label: 'Careers', action: () => setCurrentPage && setCurrentPage('about') },
        { label: 'Contact Us', action: () => setCurrentPage && setCurrentPage('about') },
        { label: 'Press', action: () => setCurrentPage && setCurrentPage('about') },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Apply', action: () => onOpenAuth ? onOpenAuth() : (setCurrentPage && setCurrentPage('roadmaps')) },
        { label: 'Nominate a Peer', action: () => onOpenAuth ? onOpenAuth() : null },
        { label: 'LinkedIn', href: 'https://linkedin.com' },
        { label: 'YouTube', href: 'https://youtube.com' },
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
                        style={styles.linkText}
                        className="cp-footer-link"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={item.action}
                        style={styles.linkButton}
                        className="cp-footer-link"
                      >
                        {item.label}
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

        {/* Legal & Meta Row - aligned directly with the 4-column grid */}
        <div style={styles.legalGrid} className="editorial-footer-cols">
          <div style={{ gridColumn: 'span 2' }}>
            <span style={styles.legalCopyright}>
              ©{new Date().getFullYear()}. All&nbsp;Rights Reserved.
            </span>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setCurrentPage && setCurrentPage('about')}
              style={styles.legalLink}
              className="cp-footer-link"
            >
              Privacy Policy
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setCurrentPage && setCurrentPage('about')}
              style={styles.legalLink}
              className="cp-footer-link"
            >
              Terms of Use
            </button>
          </div>
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



      {/* Embedded micro styles for hover states & link transitions */}
      <style>{`
        .cp-footer-link {
          position: relative;
          text-decoration: none;
          display: inline-block;
          color: var(--text-muted, #9ca3af);
          transition: color 0.18s ease;
        }
        .cp-footer-link:hover {
          color: #38bdf8 !important;
          text-decoration: underline;
          text-underline-offset: 4px;
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
  legalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '32px clamp(20px, 3.5vw, 60px)',
    alignItems: 'flex-end',
    width: '100%',
    paddingBottom: '18px',
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
    cursor: 'pointer',
    fontFamily: "var(--font-sans)",
    textAlign: 'left',
    lineHeight: 1,
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
