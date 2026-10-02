import React from 'react';
import { Sun, Moon } from 'lucide-react';
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

  // Navigation items for the bottom collapsed bar
  const navItems = [
    {
      label: 'Overview',
      href: '/',
      active: currentPage === 'landing',
      onClick: () => setCurrentPage('landing'),
    },
    {
      label: 'Roadmaps',
      href: '/roadmaps',
      active: currentPage === 'roadmaps',
      onClick: () => setCurrentPage('roadmaps'),
    },
    {
      label: 'Online IDE',
      href: '/editor',
      active: currentPage === 'editor',
      onClick: () => setCurrentPage('editor'),
    },
    {
      label: 'Typlab',
      href: '/typlab',
      active: currentPage === 'typlab',
      onClick: () => setCurrentPage('typlab'),
    },
  ];

  // Mega-menu columns revealed on expand
  const megaColumns = [
    {
      title: 'Platform',
      links: [
        { label: 'Overview', href: '/', onClick: () => setCurrentPage('landing') },
        { label: 'Skill Assessment', href: '/assessment', onClick: () => setCurrentPage('assessment') },
      ],
    },
    {
      title: 'Developer Tools',
      links: [
        { label: 'Roadmaps', href: '/roadmaps', onClick: () => setCurrentPage('roadmaps') },
        { label: 'Online IDE', href: '/editor', onClick: () => setCurrentPage('editor') },
        { label: 'Typlab Speed', href: '/typlab', onClick: () => setCurrentPage('typlab') },
      ],
    },
    {
      title: 'Account',
      links: user
        ? [
            { label: `User: ${user.username}`, href: '/roadmaps' },
            { label: 'Sign Out', href: '/', onClick: onLogout },
          ]
        : [
            { label: 'Sign In', href: '/signin', onClick: () => setCurrentPage('signin') },
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

  const [scrolledPastHero, setScrolledPastHero] = React.useState(false);

  React.useEffect(() => {
    if (currentPage !== 'landing') {
      setScrolledPastHero(true);
      return;
    }
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 280);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  return (
    <>
      {/* Top Header Bar: Logo (pages other than landing) & User Profile */}
      <header className="fixed top-5 md:top-6 left-0 right-0 z-40 flex justify-between items-center px-6 md:px-10 pointer-events-none">
        {/* Brand Logo: shown on non-landing pages where hero section isn't present */}
        {currentPage !== 'landing' ? (
          <div className="pointer-events-auto">
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
        ) : (
          <div />
        )}

        {/* Top Right Quick Controls: Theme Toggle & User Profile */}
        {(currentPage !== 'landing' || scrolledPastHero) && (
          <div className="flex items-center gap-2 pointer-events-auto transition-opacity duration-300">
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="w-8 h-8 rounded-full transition-all duration-150 ease-out cursor-pointer flex items-center justify-center"
                style={{
                  background: "var(--nav-bg)",
                  border: "1px solid var(--nav-border)",
                  color: "var(--nav-link-color)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--nav-link-active-color)";
                  e.currentTarget.style.borderColor = "var(--nav-border-scrolled)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--nav-link-color)";
                  e.currentTarget.style.borderColor = "var(--nav-border)";
                }}
              >
                <div className="transition-transform duration-500 ease-out hover:rotate-45 active:scale-75 flex items-center justify-center">
                  {theme === 'dark' ? (
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                  ) : (
                    <Moon className="h-3.5 w-3.5 text-indigo-500" />
                  )}
                </div>
              </button>
            )}

            {user ? (
              <>
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
                  className="px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-100 ease-out cursor-pointer"
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
              </>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentPage('signin')}
                className="h-8 px-3 rounded-lg border text-xs font-medium tracking-wide transition-all cursor-pointer flex items-center"
                style={{
                  background: "var(--nav-bg)",
                  border: "1px solid var(--nav-border)",
                  color: "var(--nav-link-color)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--nav-link-active-color)";
                  e.currentTarget.style.borderColor = "var(--nav-border-scrolled)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--nav-link-color)";
                  e.currentTarget.style.borderColor = "var(--nav-border)";
                }}
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Awwwards Nav (Bottom floating pill & expanded mega menu) */}
      <div
        style={{
          transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: currentPage === 'landing' && !scrolledPastHero ? 0 : 1,
          pointerEvents: currentPage === 'landing' && !scrolledPastHero ? 'none' : 'auto',
          transform: currentPage === 'landing' && !scrolledPastHero ? 'translateY(30px)' : 'translateY(0)',
        }}
      >
        <AwwwardsNav
          items={navItems}
          columns={megaColumns}
          moreLabel="More"
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
      </div>
    </>
  );
};

export default Navbar;
