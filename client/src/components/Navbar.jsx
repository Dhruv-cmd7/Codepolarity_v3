import React, { useState, useEffect, useRef } from 'react';
import dsLogo from '../assets/ds_logo.svg';
import { ChevronDown, Award, Map, Terminal, ArrowRight, BookOpen, Users, Code, Shield, HelpCircle, Sparkles } from 'lucide-react';

const Navbar = ({ user, onLogout, onOpenAuth, currentPage, setCurrentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [toolsOpen, setToolsOpen] = useState(false);

  const navRef = useRef(null);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const topNavItems = [
    { id: 'landing', label: 'Overview', isDropdown: false },
    { id: 'tools', label: 'Tools', isDropdown: true },
    { id: 'about', label: 'About', isDropdown: false },
  ];

  const getActiveTopItemId = () => {
    if (currentPage === 'landing') return 'landing';
    if (currentPage === 'about') return 'about';
    if (['assessment', 'roadmaps', 'editor', 'typlab'].includes(currentPage)) return 'tools';
    return '';
  };

  const updateHighlight = (itemId) => {
    const parent = navRef.current;
    if (!parent) return;
    const activeEl = parent.querySelector(`[data-id="${itemId}"]`);
    if (activeEl) {
      setHighlightStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1,
      });
    } else {
      setHighlightStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  useEffect(() => {
    updateHighlight(getActiveTopItemId());
  }, [currentPage]);

  useEffect(() => {
    const handleResize = () => updateHighlight(hoveredItem || getActiveTopItemId());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage, hoveredItem]);

  return (
    <header style={styles.header}>
      <div 
        style={{
          ...styles.inner,
          maxWidth: scrolled ? '980px' : '1240px',
          height: scrolled ? '50px' : '58px',
          padding: scrolled ? '0 18px' : '0 24px',
          background: scrolled 
            ? 'var(--nav-bg-scrolled)' 
            : 'var(--nav-bg)',
          borderColor: scrolled 
            ? 'var(--nav-border-scrolled)' 
            : 'var(--nav-border)',
          boxShadow: scrolled 
            ? 'var(--nav-shadow)' 
            : 'var(--nav-shadow-unscrolled)',
        }}
      >
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); setCurrentPage('landing'); }}
          style={styles.logoLink}
          aria-label="Codepolarity"
        >
          <img 
            src={dsLogo} 
            alt="Codepolarity" 
            style={{ 
              height: 24, 
              width: 'auto', 
              filter: 'var(--logo-filter)',
              transition: 'filter 0.3s ease',
            }} 
          />
          <span style={{
            ...styles.logoText,
            color: 'var(--text-main)',
          }}>
            Codepolarity
          </span>
        </a>

        {/* Center Nav with Magnetic Pill */}
        <nav 
          ref={navRef} 
          style={styles.nav} 
          aria-label="Main navigation"
          onMouseLeave={() => {
            setHoveredItem(null);
            setToolsOpen(false);
            updateHighlight(getActiveTopItemId());
          }}
        >
          {/* Sliding Highlight Pill */}
          <div 
            style={{
              ...styles.highlightPill,
              transform: `translateX(${highlightStyle.left}px)`,
              width: highlightStyle.width,
              opacity: highlightStyle.opacity,
            }}
          />

          {topNavItems.map((item) => {
            const isActive = getActiveTopItemId() === item.id;
            
            if (item.isDropdown) {
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    setToolsOpen(true);
                    setHoveredItem(item.id);
                    updateHighlight(item.id);
                  }}
                  onMouseLeave={() => {
                    setToolsOpen(false);
                    setHoveredItem(null);
                    updateHighlight(getActiveTopItemId());
                  }}
                  style={{ position: 'relative' }}
                >
                  <button
                    data-id={item.id}
                    style={{
                      ...styles.navLink,
                      color: isActive || hoveredItem === item.id ? 'var(--nav-link-active-color)' : 'var(--nav-link-color)',
                      fontWeight: isActive ? '600' : '400',
                      gap: '4px',
                    }}
                  >
                    {item.label}
                    <ChevronDown 
                      size={14} 
                      style={{
                        transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    />
                  </button>

                  {/* Dropdown Menu Container */}
                  <div 
                    style={{
                      ...styles.dropdownContainer,
                      opacity: toolsOpen ? 1 : 0,
                      transform: toolsOpen ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(10px) scale(0.95)',
                      pointerEvents: toolsOpen ? 'auto' : 'none',
                    }}
                  >
                    {/* Inner Dropdown Box to hold background/borders and bridge the margin gap */}
                    <div style={styles.dropdownBox}>
                      {/* Top Indicator Arrow pointer */}
                      <div style={styles.indicatorArrow} />
                      <div style={{ width: '100%' }}>
                        {/* 4 Grid items of Tools */}
                        <div style={styles.dropdownLeft}>
                          <button
                            onClick={() => {
                              if (!user) onOpenAuth();
                              else setCurrentPage('assessment');
                              setToolsOpen(false);
                            }}
                            className="nav-dropdown-card dropdown-grid-mesh"
                            style={styles.dropdownCard}
                          >
                            <Award size={20} style={styles.dropdownIcon} />
                            <div style={styles.dropdownText}>
                              <span style={styles.dropdownTitle}>Assessment Tools</span>
                              <p style={styles.dropdownDesc}>Test and analyze your programming skills</p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              if (!user) onOpenAuth();
                              else setCurrentPage('roadmaps');
                              setToolsOpen(false);
                            }}
                            className="nav-dropdown-card dropdown-grid-mesh"
                            style={styles.dropdownCard}
                          >
                            <Map size={20} style={styles.dropdownIcon} />
                            <div style={styles.dropdownText}>
                              <span style={styles.dropdownTitle}>Developer Roadmaps</span>
                              <p style={styles.dropdownDesc}>Structured path for learning languages</p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              if (!user) onOpenAuth();
                              else setCurrentPage('editor');
                              setToolsOpen(false);
                            }}
                            className="nav-dropdown-card dropdown-grid-mesh"
                            style={styles.dropdownCard}
                          >
                            <Code size={20} style={styles.dropdownIcon} />
                            <div style={styles.dropdownText}>
                              <span style={styles.dropdownTitle}>Online IDE</span>
                              <p style={styles.dropdownDesc}>Write, run, and preview code in real-time</p>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              if (!user) onOpenAuth();
                              else setCurrentPage('typlab');
                              setToolsOpen(false);
                            }}
                            className="nav-dropdown-card dropdown-grid-mesh"
                            style={styles.dropdownCard}
                          >
                            <Terminal size={20} style={styles.dropdownIcon} />
                            <div style={styles.dropdownText}>
                              <span style={styles.dropdownTitle}>Typlab</span>
                              <p style={styles.dropdownDesc}>Calibrate your coding speed and dexterity</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                data-id={item.id}
                onClick={() => {
                  if (!user && item.id !== 'landing') {
                    onOpenAuth();
                  } else {
                    setCurrentPage(item.id);
                  }
                }}
                onMouseEnter={() => {
                  setHoveredItem(item.id);
                  updateHighlight(item.id);
                }}
                style={{
                  ...styles.navLink,
                  color: isActive || hoveredItem === item.id ? 'var(--nav-link-active-color)' : 'var(--nav-link-color)',
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTAs */}
        <div style={styles.actions}>


          {user ? (
            <>
              <span style={{
                ...styles.userChip,
                background: 'var(--nav-link-active-bg)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-main)',
              }}>
                <span style={styles.onlineDot} />
                {user.username}
              </span>
              <button
                onClick={onLogout}
                style={{
                  ...styles.signOutBtn,
                  background: 'var(--nav-link-active-bg)',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-main)',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary"
              style={{
                ...styles.downloadBtn,
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
                boxShadow: 'var(--btn-primary-shadow)',
              }}
            >
              Get started
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: '16px',
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    background: 'transparent',
    padding: '0 16px',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '1240px',
    border: '1px solid',
    borderRadius: '999px',
    padding: '0 24px',
    height: '58px',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: 'var(--text-main)',
    flex: '1 0 0%',
  },
  logoText: {
    fontSize: '0.95rem',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    transition: 'color 0.3s',
    fontFamily: 'var(--font-sans)',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
  },
  highlightPill: {
    position: 'absolute',
    left: 0,
    top: '4px',
    bottom: '4px',
    height: 'calc(100% - 8px)',
    background: 'var(--nav-link-active-bg)',
    borderRadius: '999px',
    border: '1px solid var(--nav-link-hover-border)',
    transition: 'transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
    pointerEvents: 'none',
    zIndex: 0,
  },
  navLink: {
    border: '1px solid transparent',
    background: 'transparent',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    padding: '0 16px',
    borderRadius: '999px',
    transition: 'color 0.25s ease',
    letterSpacing: '-0.01em',
    position: 'relative',
    zIndex: 1,
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    paddingTop: '18px',
    width: '740px',
    transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    zIndex: 100,
  },
  dropdownBox: {
    background: 'var(--glass-bg)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid var(--glass-border)',
    borderRadius: '18px',
    boxShadow: 'var(--shadow-box)',
    padding: '12px',
    position: 'relative',
  },
  indicatorArrow: {
    position: 'absolute',
    top: '-5px',
    left: '50%',
    transform: 'translateX(-50%) rotate(45deg)',
    width: '10px',
    height: '10px',
    background: 'var(--glass-bg)',
    borderLeft: '1px solid var(--glass-border)',
    borderTop: '1px solid var(--glass-border)',
    zIndex: 10,
  },
  dropdownLeft: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    width: '100%',
  },
  dropdownCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '22px',
    padding: '12px',
    background: 'transparent',
    border: '1px solid var(--border-light)',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    height: '135px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.25s ease',
    position: 'relative',
  },
  dropdownIcon: {
    color: '#ffffff',
    flexShrink: 0,
  },
  dropdownText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    zIndex: 1,
  },
  dropdownTitle: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  dropdownDesc: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    lineHeight: '1.3',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'flex-end',
    flex: '1 0 0%',
  },

  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    padding: '6px 14px',
    borderRadius: '99px',
    border: '1px solid',
    fontFamily: 'var(--font-sans)',
    fontWeight: '500',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#10b981',
    boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)',
  },

  signOutBtn: {
    border: '1px solid',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8125rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '6px 14px',
    borderRadius: '999px',
    transition: 'all 0.25s ease',
  },
  downloadBtn: {
    padding: '6px 18px',
    fontSize: '0.85rem',
    borderRadius: '999px',
  },
};

export default Navbar;
