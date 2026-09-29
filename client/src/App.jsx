import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Assessment from './pages/Assessment';
import RoadmapExplorer from './pages/RoadmapExplorer';
import CodeEditor from './pages/CodeEditor';
import Typlab from './pages/Typlab';
import SignInPage from './pages/SignInPage';
import { ShieldAlert, X, Sparkles } from 'lucide-react';
import { FullScreenSignup } from './components/ui/full-screen-signup';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Auth Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Sandbox load state
  const [editorTemplateId, setEditorTemplateId] = useState(null);

  // Theme Management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e) => {
    const next = theme === 'dark' ? 'light' : 'dark';

    let x = window.innerWidth - 60;
    let y = 30;

    if (e?.clientX && e.clientX > 0 && e?.clientY && e.clientY > 0) {
      x = e.clientX;
      y = e.clientY;
    } else if (e?.currentTarget && typeof e.currentTarget.getBoundingClientRect === 'function') {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Instant fallback if View Transitions not available
    if (!document.startViewTransition) {
      document.documentElement.setAttribute('data-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.style.colorScheme = next;
      localStorage.setItem('theme', next);
      setTheme(next);
      return;
    }

    // Capture old state immediately, then mutate DOM inside the transition callback
    const transition = document.startViewTransition(() => {
      document.documentElement.setAttribute('data-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.style.colorScheme = next;
      localStorage.setItem('theme', next);
      setTheme(next);
    });

    transition.ready.then(() => {
      // Cinema-smooth, steady radial wave: immediate start, calm steady travel, soft landing
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 720,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  // Lenis Smooth Scroll Initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [currentPage]);

  // Dynamic Document Title for SEO and Browser UX
  useEffect(() => {
    const titles = {
      landing: 'Codepolarity — The Software Engineering Learning Platform',
      roadmaps: 'Developer Roadmaps & Skill Pathways | Codepolarity',
      assessment: 'Technical Skill Calibration & Benchmark | Codepolarity',
      editor: 'Browser Sandboxed Online IDE | Codepolarity',
      typlab: 'Typlab — Keystroke Speed & Code Velocity | Codepolarity',
      signin: 'Sign In / Register | Codepolarity',
      login: 'Sign In | Codepolarity',
      register: 'Register | Codepolarity',
    };
    document.title = titles[currentPage] || 'Codepolarity — Autonomous Developer Career Engine';
  }, [currentPage]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchCurrentUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'x-auth-token': token
        }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        // Token expired/invalid
        setToken('');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const handleLogout = () => {
    setToken('');
    setCurrentPage('landing');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const url = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = authMode === 'login' 
      ? { email, password } 
      : { username, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setShowAuthModal(false);
        setUsername('');
        setEmail('');
        setPassword('');
        setCurrentPage('roadmaps'); // redirect to roadmaps on successful login
      } else {
        setAuthError(data.msg || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Connection error. Server might be offline.');
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setAuthError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        if (data.user) {
          setUser(data.user);
        }
        setShowAuthModal(false);
        setUsername('');
        setEmail('');
        setPassword('');
        setCurrentPage('roadmaps');
      } else {
        setAuthError(data.msg || 'Google authentication failed');
      }
    } catch (err) {
      setAuthError('Connection error. Server might be offline.');
    }
  };

  const handleGoogleError = (errMsg) => {
    setAuthError(errMsg || 'Google authentication encountered an error');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'signin':
      case 'login':
        return (
          <SignInPage
            token={token}
            setToken={setToken}
            user={user}
            setUser={setUser}
            setCurrentPage={setCurrentPage}
            initialMode="login"
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      case 'register':
      case 'signup':
        return (
          <SignInPage
            token={token}
            setToken={setToken}
            user={user}
            setUser={setUser}
            setCurrentPage={setCurrentPage}
            initialMode="register"
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      case 'assessment':
        return (
          <Assessment
            token={token}
            user={user}
            onUpdateUser={setUser}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'roadmaps':
        return (
          <RoadmapExplorer
            token={token}
            user={user}
            onUpdateUser={setUser}
            setCurrentPage={setCurrentPage}
            onLoadTemplate={setEditorTemplateId}
          />
        );
      case 'editor':
        return (
          <CodeEditor
            token={token}
            user={user}
            initialTemplateId={editorTemplateId}
            onClearTemplate={() => setEditorTemplateId(null)}
            setCurrentPage={setCurrentPage}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      case 'typlab':
        return (
          <Typlab />
        );
      default:
        return (
          <LandingPage
            user={user}
            onOpenAuth={() => {
              setCurrentPage('signin');
            }}
            setCurrentPage={setCurrentPage}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
    }
  };
  return (
    <div className="app-container">
      {/* Navbar – render on main app pages (except editor which has its own unified IDE header) */}
      {currentPage !== 'signin' && currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'signup' && currentPage !== 'editor' && (
        <Navbar
          user={user}
          onLogout={handleLogout}
          onOpenAuth={() => {
            setCurrentPage('signin');
          }}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Main View Area – no top padding here; landing page manages its own spacing */}
      <main>
        {renderPage()}
      </main>

      {/* Glassmorphism Authentication Popup Modal */}
      {showAuthModal && (
        <FullScreenSignup
          authMode={authMode}
          setAuthMode={setAuthMode}
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          authError={authError}
          setAuthError={setAuthError}
          onSubmit={handleAuthSubmit}
          onGoogleSuccess={handleGoogleSuccess}
          onGoogleError={handleGoogleError}
          onClose={() => {
            setShowAuthModal(false);
            setAuthError('');
          }}
        />
      )}
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  modalContent: {
    width: '420px',
    padding: '40px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    background: '#111',
    border: '1px solid #2a2a2a',
    borderRadius: '24px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
    animation: 'fadeIn 0.25s ease forwards',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    color: '#6b6b6b',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  modalTitle: {
    fontSize: '1.375rem',
    fontWeight: '500',
    letterSpacing: '-0.02em',
    color: '#f2f2f2',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  errorBanner: {
    background: 'rgba(252, 65, 61, 0.08)',
    border: '1px solid rgba(252, 65, 61, 0.2)',
    color: '#FC413D',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#6b6b6b',
    letterSpacing: '0.01em',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '4px',
    justifyContent: 'center',
  },
  modalFooter: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#555',
    borderTop: '1px solid #1e1e1e',
    paddingTop: '16px',
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    color: '#3186FF',
    fontWeight: '500',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontFamily: 'inherit',
    fontSize: 'inherit',
  }
};

export default App;
