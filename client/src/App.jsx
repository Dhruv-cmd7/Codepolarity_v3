import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Assessment from './pages/Assessment';
import RoadmapExplorer from './pages/RoadmapExplorer';
import CodeEditor from './pages/CodeEditor';
import ProfileDashboard from './pages/ProfileDashboard';
import { ShieldAlert, X, Sparkles } from 'lucide-react';

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
        setCurrentPage('profile'); // redirect to dashboard on successful login
      } else {
        setAuthError(data.msg || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Connection error. Server might be offline.');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
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
          />
        );
      case 'profile':
        return (
          <ProfileDashboard
            token={token}
            user={user}
            setCurrentPage={setCurrentPage}
            onLoadTemplate={setEditorTemplateId}
          />
        );
      default:
        return (
          <LandingPage
            user={user}
            onOpenAuth={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
            setCurrentPage={setCurrentPage}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => {
          setAuthMode('login');
          setShowAuthModal(true);
        }}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Main View Area – no top padding here; landing page manages its own spacing */}
      <main>
        {renderPage()}
      </main>

      {/* Glassmorphism Authentication Popup Modal */}
      {showAuthModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button 
              onClick={() => {
                setShowAuthModal(false);
                setAuthError('');
              }} 
              style={styles.closeBtn}
            >
              <X size={18} />
            </button>

            <div style={styles.modalHeader}>
              <Sparkles size={20} style={{ color: 'var(--accent-cyan)' }} />
              <h2 style={styles.modalTitle}>
                {authMode === 'login' ? 'Access Control' : 'Developer Signup'}
              </h2>
            </div>

            <form onSubmit={handleAuthSubmit} style={styles.form}>
              {authError && (
                <div style={styles.errorBanner}>
                  <ShieldAlert size={14} style={{ marginRight: '6px' }} />
                  <span>{authError}</span>
                </div>
              )}

              {authMode === 'register' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    placeholder="Enter username"
                  />
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="name@domain.com"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn-primary" style={styles.submitBtn}>
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div style={styles.modalFooter}>
              {authMode === 'login' ? (
                <p>
                  New to Codepolarity?{' '}
                  <button onClick={() => { setAuthMode('register'); setAuthError(''); }} style={styles.toggleBtn}>
                    Register now
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button onClick={() => { setAuthMode('login'); setAuthError(''); }} style={styles.toggleBtn}>
                    Login here
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
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
