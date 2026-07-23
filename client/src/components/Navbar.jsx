import React, { useState, useEffect } from 'react';
import dsLogo from '../assets/ds_logo.svg';

const Navbar = ({ user, onLogout, onOpenAuth, currentPage, setCurrentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'assessment', label: 'Assessment' },
    { id: 'roadmaps', label: 'Roadmaps' },
    { id: 'editor', label: 'Code Editor' },
    { id: 'profile', label: 'Dashboard' },
  ];

  return (
    <header style={styles.header}>
      <div 
        style={{
          ...styles.inner,
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.92)' 
            : 'rgba(255, 255, 255, 0.8)',
          borderColor: scrolled 
            ? 'rgba(0, 0, 0, 0.12)' 
            : 'rgba(0, 0, 0, 0.07)',
          boxShadow: scrolled 
            ? '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)' 
            : '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); setCurrentPage('landing'); }}
          style={styles.logoLink}
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          aria-label="Codepolarity"
        >
          <img 
            src={dsLogo} 
            alt="Codepolarity" 
            style={{ 
              height: 24, 
              width: 'auto', 
              filter: logoHovered ? 'brightness(0.1) sepia(1) hue-rotate(200deg) saturate(5)' : 'brightness(0.15)',
              transform: logoHovered ? 'rotate(15deg) scale(1.1)' : 'rotate(0deg) scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease',
            }} 
          />
          <span style={{
            ...styles.logoText,
            color: logoHovered ? '#2563eb' : '#0f172a',
          }}>
            Codepolarity
          </span>
        </a>

        {/* Center Nav */}
        <nav style={styles.nav} aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!user && item.id !== 'landing') {
                    onOpenAuth();
                  } else {
                    setCurrentPage(item.id);
                  }
                }}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  ...styles.navLink,
                  color: isActive ? '#0f172a' : isHovered ? '#0f172a' : '#64748b',
                  fontWeight: isActive ? '600' : '400',
                  background: isActive 
                    ? '#f1f5f9' 
                    : isHovered 
                      ? '#f8fafc' 
                      : 'transparent',
                  borderColor: isActive 
                    ? '#e2e8f0' 
                    : isHovered 
                      ? 'rgba(0, 0, 0, 0.05)' 
                      : 'transparent',
                  boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.04)' : 'none',
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
              <span style={styles.userChip}>
                <span style={styles.onlineDot} />
                {user.username}
              </span>
              <button
                onClick={onLogout}
                style={styles.signOutBtn}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenAuth}
                style={styles.signInBtn}
              >
                Sign in
              </button>
              <button
                onClick={onOpenAuth}
                className="btn-primary"
                style={styles.downloadBtn}
              >
                Get started
              </button>
            </>
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
    transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: '#0f172a',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '0.95rem',
    fontWeight: '600',
    letterSpacing: '-0.02em',
    transition: 'color 0.3s',
    fontFamily: 'var(--font-sans)',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navLink: {
    border: '1px solid transparent',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    cursor: 'pointer',
    padding: '6px 16px',
    borderRadius: '999px',
    transition: 'color 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
    letterSpacing: '-0.01em',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#0f172a',
    padding: '6px 14px',
    borderRadius: '99px',
    border: '1px solid #e2e8f0',
    background: '#f1f5f9',
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
  signInBtn: {
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 14px',
    borderRadius: '999px',
    transition: 'color 0.2s ease, background 0.2s ease',
  },
  signOutBtn: {
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    color: '#0f172a',
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
    background: '#0f172a',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
  },
};

export default Navbar;
