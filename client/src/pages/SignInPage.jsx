import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import dsLogo from '../assets/logo.svg';
import { PerspectiveGrid } from '../components/ui/perspective-grid';

// Official Google Multi-Color G Icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ display: "block" }}>
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

// Official GitHub Icon
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ display: "block" }}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const SignInPage = ({
  token,
  setToken,
  user,
  setUser,
  setCurrentPage,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [googleNotice, setGoogleNotice] = useState('');
  
  // Form Field Errors
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const googleBtnRef = useRef(null);

  // Password strength calculation (0 to 4)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (token && user) {
      setSuccessMsg(`Welcome back, ${user.username || 'Coder'}! Redirecting...`);
      const timer = setTimeout(() => {
        setCurrentPage('roadmaps');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [token, user, setCurrentPage]);

  // Google Sign-In SDK Initialization
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initGsi = () => {
      const g = window.google;
      if (g?.accounts?.id) {
        g.accounts.id.initialize({
          client_id: clientId,
          callback: async (res) => {
            if (res.credential) {
              handleGoogleSuccess(res.credential);
            } else {
              setErrorMsg('Google authentication was cancelled.');
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          g.accounts.id.renderButton(googleBtnRef.current, {
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: mode === 'login' ? 'signin_with' : 'signup_with',
            shape: 'pill',
            width: 320,
            logo_alignment: 'left',
          });
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const existingScript = document.getElementById('google-gsi-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initGsi;
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', initGsi);
      }
    }
  }, [mode]);

  const handleGoogleSuccess = async (credential) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        if (data.user) setUser(data.user);
        setSuccessMsg('Authenticated with Google! Redirecting...');
        setTimeout(() => setCurrentPage('roadmaps'), 800);
      } else {
        setErrorMsg(data.msg || 'Google authentication failed.');
      }
    } catch (err) {
      setErrorMsg('Server offline or network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setGoogleNotice(
        'Google Client ID is not configured. Add VITE_GOOGLE_CLIENT_ID in client/.env to enable live OAuth.'
      );
      return;
    }
    const g = window.google;
    if (g?.accounts?.id) {
      g.accounts.id.prompt();
    }
  };

  const handleGitHubLogin = async () => {
    setIsGitHubLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    
    // If client has real GitHub OAuth configured, redirect to GitHub OAuth authorize
    if (githubClientId) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;
      return;
    }

    // Direct / Demo authentication via backend /api/auth/github endpoint
    try {
      const demoGithubUser = {
        githubId: `gh_demo_${Date.now().toString().slice(-6)}`,
        username: email ? email.split('@')[0] : `dev_${Math.floor(1000 + Math.random() * 9000)}`,
        email: email || `dev_${Math.floor(1000 + Math.random() * 9000)}@github.com`,
        avatar: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        name: username || 'GitHub Developer'
      };

      const res = await fetch('/api/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUser: demoGithubUser })
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        if (data.user) setUser(data.user);
        setSuccessMsg('Authenticated with GitHub! Redirecting...');
        setTimeout(() => setCurrentPage('roadmaps'), 800);
      } else {
        setErrorMsg(data.msg || 'GitHub authentication failed.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication server.');
    } finally {
      setIsGitHubLoading(false);
    }
  };

  const validateForm = () => {
    let valid = true;
    setErrorMsg('');

    if (mode === 'register') {
      if (!username.trim() || username.trim().length < 3) {
        setUsernameError('Username must be at least 3 characters.');
        valid = false;
      } else {
        setUsernameError('');
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (mode === 'register' && !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else if (mode === 'login' && !email.trim()) {
      setEmailError('Please enter your email or username.');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password || password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = mode === 'login' 
      ? { email, password } 
      : { username, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setSuccessMsg(mode === 'login' ? 'Signed in successfully!' : 'Account created!');
        setTimeout(() => {
          setCurrentPage('roadmaps');
        }, 800);
      } else {
        setErrorMsg(data.msg || 'Invalid credentials or request.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="perspective-auth-root">
      {/* Full Screen Perspective Grid Background */}
      <div className="full-screen-grid-bg">
        <PerspectiveGrid rows={32} cols={32} showOverlay={true} fadeRadius={95} />
      </div>

      {/* Dynamic Animated Ambient Lights */}
      <div className="ambient-blob blob-cyan" />
      <div className="ambient-blob blob-purple" />

      {/* Floating Top Header Navigation */}
      <header className="creative-header">
        <button 
          onClick={() => setCurrentPage('landing')}
          className="glass-back-pill"
          aria-label="Back to home"
          title="Back to home"
        >
          <ChevronLeft size={16} />
          <span>Return Home</span>
        </button>

        <a 
          href="/" 
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage('landing');
          }}
          className="brand-badge-pill"
          aria-label="Codepolarity"
        >
          <img src={dsLogo} alt="Codepolarity Icon" className="brand-logo-spark" />
        </a>
      </header>

      {/* Centered Auth Card Container */}
      <div className="perspective-grid-wrapper">
        <div className="centered-auth-card">
          
          {/* Form Title */}
          <div className="form-header-title">
            <h2>{mode === 'login' ? 'Welcome Back' : 'Create Free Account'}</h2>
            <p>
              {mode === 'login'
                ? 'Enter your credentials or use GitHub / Google sign in'
                : 'Get full access to roadmaps, interactive editor & challenges'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="alert-box alert-error">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert-box alert-success">
              <CheckCircle2 size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social Login Options (Google & GitHub Side-by-Side) */}
          <div className="social-auth-grid">
            
            {/* Google Auth Button */}
            <div className="social-btn-wrap">
              <div
                ref={googleBtnRef}
                style={{
                  width: '100%',
                  display: import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'flex' : 'none',
                  justifyContent: 'center',
                }}
              />
              {(!import.meta.env.VITE_GOOGLE_CLIENT_ID || !googleBtnRef.current?.hasChildNodes()) && (
                <button
                  type="button"
                  onClick={handleCustomGoogleClick}
                  className="social-auth-btn google-btn"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
              )}
            </div>

            {/* GitHub Auth Button */}
            <button
              type="button"
              onClick={handleGitHubLogin}
              disabled={isGitHubLoading}
              className="social-auth-btn github-btn"
            >
              {isGitHubLoading ? (
                <div className="btn-spinner-dark" />
              ) : (
                <>
                  <GithubIcon />
                  <span>GitHub</span>
                </>
              )}
            </button>

          </div>

          {googleNotice && (
            <p className="google-notice-info">{googleNotice}</p>
          )}

          {/* Divider */}
          <div className="auth-divider">
            <div className="divider-line" />
            <span className="divider-text">Or continue with credentials</span>
            <div className="divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="auth-form-fields">
            
            {/* Username Input (Registration Mode) */}
            {mode === 'register' && (
              <div className="form-group-block">
                <label className="input-label">Username</label>
                <div className="input-field-wrapper">
                  <User className="input-left-icon" size={15} />
                  <input
                    type="text"
                    placeholder="e.g. alexdev"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError('');
                    }}
                    className={`tech-input ${usernameError ? 'is-error' : ''}`}
                  />
                </div>
                {usernameError && <span className="field-error-text">{usernameError}</span>}
              </div>
            )}

            {/* Email Address Field */}
            <div className="form-group-block">
              <label className="input-label">
                {mode === 'login' ? 'Email or Username' : 'Email Address'}
              </label>
              <div className="input-field-wrapper">
                <Mail className="input-left-icon" size={15} />
                <input
                  type="email"
                  placeholder={mode === 'login' ? 'name@example.com or alexdev' : 'name@example.com'}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className={`tech-input ${emailError ? 'is-error' : ''}`}
                />
              </div>
              {emailError && <span className="field-error-text">{emailError}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group-block">
              <div className="label-flex-row">
                <label className="input-label">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setErrorMsg('Password reset instructions sent to your email.')}
                    className="forgot-password-link"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="input-field-wrapper">
                <Lock className="input-left-icon" size={15} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className={`tech-input ${passwordError ? 'is-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-eye"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordError && <span className="field-error-text">{passwordError}</span>}

              {/* Password Strength Bar (Register Mode) */}
              {mode === 'register' && password.length > 0 && (
                <div className="strength-meter-wrap">
                  <div className="meter-bars">
                    <span className={`bar ${passwordStrength >= 1 ? 'bar-active bar-weak' : ''}`} />
                    <span className={`bar ${passwordStrength >= 2 ? 'bar-active bar-medium' : ''}`} />
                    <span className={`bar ${passwordStrength >= 3 ? 'bar-active bar-strong' : ''}`} />
                    <span className={`bar ${passwordStrength >= 4 ? 'bar-active bar-super' : ''}`} />
                  </div>
                  <span className="strength-label">
                    {passwordStrength <= 1 ? 'Weak' : passwordStrength === 2 ? 'Medium' : passwordStrength === 3 ? 'Strong' : 'Very Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Remember Me Option */}
            <div className="options-row">
              <label className="custom-checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Keep me logged in on this device</span>
              </label>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="submit-action-btn"
            >
              {isLoading ? (
                <div className="btn-spinner" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}</span>
                  <ArrowRight size={16} className="btn-arrow" />
                </>
              )}
            </button>

            {/* Footer Mode Switcher */}
            <div className="auth-card-footer">
              {mode === 'login' ? (
                <span>
                  New to Codepolarity?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="footer-switch-link"
                  >
                    Sign up for free
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="footer-switch-link"
                  >
                    Sign in instead
                  </button>
                </span>
              )}
            </div>

          </form>

        </div>
      </div>

      {/* Styled JSX scoped CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-auth-root {
          min-height: 100vh;
          width: 100vw;
          background: #06080d;
          color: #f3f4f6;
          font-family: 'Google Sans Flex', 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* Ambient Dynamic Glow Blobs */
        .ambient-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.45;
          animation: floatGlow 14s infinite alternate ease-in-out;
        }

        .blob-cyan {
          top: -100px;
          left: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%);
        }

        .blob-purple {
          bottom: -150px;
          right: -100px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%);
        }

        @keyframes floatGlow {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-30px) scale(1.1); }
        }

        /* Header Bar */
        .creative-header {
          position: relative;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px 48px 20px;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .creative-header {
            padding: 20px 20px 16px;
          }
        }

        .glass-back-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px);
          color: #d1d5db;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }

        .glass-back-pill:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateX(-2px);
        }

        .brand-badge-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          background: transparent;
          border: none;
          padding: 0;
          backdrop-filter: none;
          margin-top: 4px;
          transition: transform 0.25s ease;
        }

        .brand-badge-pill:hover {
          transform: none;
        }

        .brand-logo-spark {
          height: 22px;
          width: auto;
          filter: brightness(0) invert(1) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.85));
        }

        .theme-badge-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #9ca3af;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .theme-badge-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        /* Full Screen Grid Background Wrapper */
        .full-screen-grid-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          overflow: hidden;
          pointer-events: auto;
        }

        /* Perspective Grid Wrapper (Card Container) */
        .perspective-grid-wrapper {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          pointer-events: none;
        }

        /* Centered Authentication Card */
        .centered-auth-card {
          width: 100%;
          max-width: 360px;
          background: rgba(13, 17, 26, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px 22px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.85), 0 0 1px rgba(255, 255, 255, 0.1) inset;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: cardPopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          box-sizing: border-box;
          margin: 16px auto;
          pointer-events: auto;
        }

        @keyframes cardPopIn {
          from { opacity: 0; transform: scale(0.96) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @media (max-width: 480px) {
          .centered-auth-card {
            padding: 20px 16px;
            max-width: 92%;
          }
        }

        /* Mode Switcher Tabs */
        .auth-mode-switcher {
          display: flex;
          background: #111622;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          padding: 3px;
          margin-bottom: 16px;
        }

        .mode-tab {
          flex: 1;
          padding: 6px 10px;
          border: none;
          background: transparent;
          color: #9ca3af;
          font-size: 12px;
          font-weight: 600;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
        }

        .mode-tab.active {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }

        /* Header Title */
        .form-header-title {
          text-align: center;
          margin-bottom: 14px;
        }

        .form-header-title h2 {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 4px 0;
          letter-spacing: -0.01em;
        }

        .form-header-title p {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
          line-height: 1.35;
        }

        /* Alert Boxes */
        .alert-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 11.5px;
          margin-bottom: 14px;
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171;
        }

        .alert-success {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #34d399;
        }

        /* Social Auth Grid (Google & GitHub Side-by-Side) */
        .social-auth-grid {
          display: flex;
          gap: 10px;
          margin-bottom: 12px;
        }

        .social-btn-wrap {
          flex: 1;
        }

        .social-auth-btn {
          width: 100%;
          height: 36px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          color: #ffffff;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }

        .social-auth-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }

        .github-btn {
          flex: 1;
          background: #181d27;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .github-btn:hover {
          background: #222938;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .google-notice-info {
          font-size: 11px;
          color: #93c5fd;
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.2);
          padding: 6px 10px;
          border-radius: 8px;
          margin-bottom: 12px;
          line-height: 1.35;
        }

        /* Divider */
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 12px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
        }

        .divider-text {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #6b7280;
          font-weight: 700;
        }

        /* Form Fields */
        .auth-form-fields {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-group-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .label-flex-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-label {
          font-size: 11.5px;
          font-weight: 600;
          color: #d1d5db;
        }

        .forgot-password-link {
          background: transparent;
          border: none;
          color: #60a5fa;
          font-size: 11px;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
        }

        .forgot-password-link:hover {
          text-decoration: underline;
        }

        .input-field-wrapper {
          position: relative;
          width: 100%;
        }

        .input-left-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .tech-input {
          width: 100%;
          background: #111622;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 10px;
          padding: 9px 12px 9px 36px;
          color: #ffffff;
          font-size: 12.5px;
          font-family: inherit;
          box-sizing: border-box;
          outline: none;
          transition: all 0.2s ease;
        }

        /* Prevent Chrome/Edge/Safari autofill from overriding background with light blue */
        .tech-input:-webkit-autofill,
        .tech-input:-webkit-autofill:hover, 
        .tech-input:-webkit-autofill:focus, 
        .tech-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #111622 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        .tech-input::placeholder {
          color: #4b5563;
        }

        .tech-input:focus {
          border-color: #3b82f6;
          background: #151c2c;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .tech-input:focus ~ .input-left-icon,
        .tech-input:focus + .input-left-icon {
          color: #60a5fa;
        }

        .tech-input.is-error {
          border-color: rgba(239, 68, 68, 0.6);
        }

        .field-error-text {
          font-size: 10.5px;
          color: #f87171;
        }

        .password-toggle-eye {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle-eye:hover {
          color: #60a5fa;
        }

        /* Strength Meter */
        .strength-meter-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 3px;
        }

        .meter-bars {
          flex: 1;
          display: flex;
          gap: 3px;
        }

        .bar {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .bar-active.bar-weak { background: #ef4444; }
        .bar-active.bar-medium { background: #f59e0b; }
        .bar-active.bar-strong { background: #10b981; }
        .bar-active.bar-super { background: #3b82f6; }

        .strength-label {
          font-size: 10px;
          color: #9ca3af;
          font-weight: 600;
          min-width: 55px;
          text-align: right;
        }

        /* Options Row */
        .options-row {
          display: flex;
          align-items: center;
          margin-top: 1px;
        }

        .custom-checkbox-container {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .checkbox-input {
          accent-color: #2563eb;
          width: 13px;
          height: 13px;
          border-radius: 3px;
          cursor: pointer;
        }

        .checkbox-text {
          font-size: 11.5px;
          color: #9ca3af;
        }

        /* Primary Action Submit Button */
        .submit-action-btn {
          width: 100%;
          background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
          color: #090c12;
          border: none;
          padding: 9px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: inherit;
          box-shadow: 0 4px 14px rgba(255, 255, 255, 0.15);
        }

        .submit-action-btn:hover {
          background: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.25);
        }

        .submit-action-btn:hover .btn-arrow {
          transform: translateX(3px);
        }

        .btn-arrow {
          transition: transform 0.2s ease;
        }

        .submit-action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .btn-spinner-dark {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Footer Prompt */
        .auth-card-footer {
          text-align: center;
          font-size: 11.5px;
          color: #6b7280;
          margin-top: 6px;
        }

        .footer-switch-link {
          background: transparent;
          border: none;
          color: #60a5fa;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
          font-size: inherit;
        }

        .footer-switch-link:hover {
          text-decoration: underline;
        }
      ` }} />
    </div>
  );
};

export default SignInPage;
