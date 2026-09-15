import React from 'react';
import logoMark from '../assets/logo.svg';
import logoText from '../assets/logo_text.svg';
import { Sun, Moon } from 'lucide-react';
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
        { label: 'About Us', href: '#', onClick: () => setCurrentPage('about') },
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
            { label: 'Get Started', href: '#', onClick: onOpenAuth },
            { label: 'Sign In', href: '#', onClick: onOpenAuth },
          ],
    },
    {
      title: 'Appearance',
      links: [
        {
          label: theme === 'dark' ? 'Dark Mode' : 'Light Mode',
          href: '#',
          onClick: onToggleTheme,
        },
      ],
    },
  ];

  return (
    <>
      {/* Top Header Bar with Logo and Quick Controls */}
      <header className="fixed top-5 left-0 right-0 z-40 flex justify-between items-center px-6 pointer-events-none">
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage('landing');
          }}
          className="flex items-center gap-2.5 backdrop-blur-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-black/60 px-4 py-2 rounded-full shadow-lg pointer-events-auto transition-transform hover:scale-105 cursor-pointer"
          aria-label="Codepolarity"
        >
          <img
            src={logoMark}
            alt="Codepolarity Icon"
            className="h-5 w-auto block shrink-0 transition-all"
            style={{ filter: 'var(--logo-filter)' }}
          />
          <img
            src={logoText}
            alt="Codepolarity"
            className="h-3.5 w-auto block shrink-0 transition-all mt-[1px]"
            style={{ filter: 'var(--logo-filter)' }}
          />
        </a>

        {/* Top Right Quick Controls: Theme & User */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center h-9 w-9 rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-black/60 backdrop-blur-xl text-neutral-800 dark:text-neutral-200 transition-colors hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-black/60 backdrop-blur-xl text-neutral-800 dark:text-neutral-200">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-4 h-4 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
                {user.username}
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-black/60 backdrop-blur-xl text-neutral-800 dark:text-neutral-200 transition-colors hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 text-xs font-semibold rounded-full bg-black text-white dark:bg-white dark:text-black transition-transform hover:scale-105 shadow-md cursor-pointer"
            >
              Get started
            </button>
          )}
        </div>
      </header>

      {/* Main Awwwards Nav (Bottom floating pill & expanded mega menu) */}
      <AwwwardsNav
        items={navItems}
        columns={megaColumns}
        moreLabel="More"
      />
    </>
  );
};

export default Navbar;
