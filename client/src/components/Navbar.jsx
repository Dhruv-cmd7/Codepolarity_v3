import React, { useState, useEffect } from 'react';
import logoMark from '../assets/logo.svg';
import logoText from '../assets/logo_text.svg';
import AwwwardsNav from './AwwwardsNav';

const Navbar = ({
  user,
  onLogout,
  onOpenAuth,
  currentPage,
  setCurrentPage,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items for the bottom collapsed bar
  const navItems = [
    {
      label: 'Overview',
      href: '#',
      active: currentPage === 'landing',
      onClick: () => setCurrentPage('landing'),
    },
    {
      label: 'Roadmaps',
      href: '#',
      active: currentPage === 'roadmaps',
      onClick: () => (user ? setCurrentPage('roadmaps') : onOpenAuth()),
    },
    {
      label: 'Online IDE',
      href: '#',
      active: currentPage === 'editor',
      onClick: () => (user ? setCurrentPage('editor') : onOpenAuth()),
    },
    {
      label: 'Typlab',
      href: '#',
      active: currentPage === 'typlab',
      onClick: () => (user ? setCurrentPage('typlab') : onOpenAuth()),
    },
  ];

  // Mega-menu columns revealed on expand
  const megaColumns = [
    {
      title: 'Platform',
      links: [
        { label: 'Overview', href: '#', onClick: () => setCurrentPage('landing') },
        { label: 'Skill Assessment', href: '#', onClick: () => (user ? setCurrentPage('assessment') : onOpenAuth()) },
      ],
    },
    {
      title: 'Developer Tools',
      links: [
        { label: 'Roadmaps', href: '#', onClick: () => (user ? setCurrentPage('roadmaps') : onOpenAuth()) },
        { label: 'Online IDE', href: '#', onClick: () => (user ? setCurrentPage('editor') : onOpenAuth()) },
        { label: 'Typlab Speed', href: '#', onClick: () => (user ? setCurrentPage('typlab') : onOpenAuth()) },
      ],
    },
    {
      title: 'Account',
      links: user
        ? [
            { label: `User: ${user.username}`, href: '#' },
            { label: 'Sign Out', href: '#', onClick: onLogout },
          ]
        : [
            { label: 'Sign In', href: '#', onClick: () => setCurrentPage('signin') },
          ],
    },
    {
      title: 'Resources',
      links: [
        {
          label: 'FAQs',
          href: '#faq-section',
          onClick: () => {
            if (currentPage !== 'landing') {
              setCurrentPage('landing');
              setTimeout(() => {
                const el = document.getElementById('faq-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            } else {
              const el = document.getElementById('faq-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          },
        },
        {
          label: 'Code Academy',
          href: '#',
          onClick: () => (user ? setCurrentPage('roadmaps') : onOpenAuth()),
        },
        {
          label: 'GitHub Repo',
          href: 'https://github.com/Dhruv-cmd7/Codepolarity_v3',
          external: true,
        },
      ],
    },
  ];

  const headerItemStyle = (isScrolled) => ({
    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
    transform: isScrolled ? 'translateY(-24px) scale(0.92)' : 'translateY(0px) scale(1)',
    opacity: isScrolled ? 0 : 1,
    filter: isScrolled ? 'blur(4px)' : 'blur(0px)',
    pointerEvents: isScrolled ? 'none' : 'auto',
    willChange: 'transform, opacity, filter',
  });

  return (
    <>
      {/* Top Header Bar with Logo (Center) and Quick Controls (Right) */}
      <header className="fixed top-14 md:top-16 left-0 right-0 z-40 flex justify-end items-center px-6 md:px-10 pointer-events-none">
        {/* Brand Logo (Centered) */}
        <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2">
          <div style={headerItemStyle(scrolled)}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('landing');
              }}
              className="flex items-center gap-[10px] bg-transparent border-0 shadow-none px-1 py-1 cursor-pointer hover:opacity-90 transition-opacity"
              aria-label="Codepolarity"
            >
              <img
                src={logoMark}
                alt="Codepolarity Icon"
                className="h-[22px] w-auto block shrink-0 transition-all"
                style={{ filter: 'var(--logo-filter)' }}
              />
              <img
                src={logoText}
                alt="Codepolarity"
                className="h-[20px] w-auto block shrink-0 transition-all"
                style={{ filter: 'var(--logo-filter)' }}
              />
            </a>
          </div>
        </div>

        {/* Top Right Quick Controls: User Profile (when logged in) */}
        {user && (
          <div
            style={headerItemStyle(scrolled)}
            className="flex items-center gap-2 pointer-events-auto"
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full"
              style={{
                background: "var(--nav-bg)",
                border: "1px solid var(--nav-border)",
                color: "var(--nav-link-color)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-4 h-4 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block', flexShrink: 0 }} />
              )}
              {user.username}
            </span>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer"
              style={{
                background: "var(--nav-bg)",
                border: "1px solid var(--nav-border)",
                color: "var(--nav-link-color)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--nav-link-active-color)"; e.currentTarget.style.borderColor = "var(--nav-border-scrolled)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--nav-link-color)"; e.currentTarget.style.borderColor = "var(--nav-border)"; }}
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* Main Awwwards Nav (Bottom floating pill & expanded mega menu) */}
      <AwwwardsNav
        items={navItems}
        columns={megaColumns}
        moreLabel="More"
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
    </>
  );
};

export default Navbar;
