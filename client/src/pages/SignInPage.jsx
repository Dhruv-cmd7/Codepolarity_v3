import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Sun,
  Moon
} from 'lucide-react';
import logoMark from '../assets/logo.svg';
import logoText from '../assets/logo_text.svg';

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

export default function SignInPage({
  token,
  setToken,
  user,
  setUser,
  setCurrentPage,
  initialMode = 'login',
  theme = 'dark',
  onToggleTheme,
}) {
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

  // Live Time Ticker
  const [timeString, setTimeString] = useState('');

  const googleBtnRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;

      const offsetMinutes = -now.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const utcStr = `UTC${sign}${offsetHours}`;

      setTimeString(`${hours}:${minutes} ${ampm}, ${utcStr}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

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
            theme: theme === 'dark' ? 'filled_black' : 'outline',
            size: 'large',
            text: mode === 'login' ? 'signin_with' : 'signup_with',
            shape: 'rectangular',
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
  }, [mode, theme]);

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
    
    if (githubClientId) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;
      return;
    }

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
        setSuccessMsg(mode === 'login' ? 'Signed in successfully! Redirecting...' : 'Account created! Redirecting...');
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
    <div className="brutalist-auth-page">
      {/* Background Pixel Dissolution Art (Subtle Monochrome) */}
      <div className="brutalist-auth-art" aria-hidden="true">
        <div className="auth-ambient-glow" />
      </div>

      {/* Top Header Bar matching Climblabs Hero */}
      <header className="brutalist-auth-header">
        {/* Left: Back Navigation Button */}
        <div className="brutalist-auth-header-left">
          <button 
            type="button"
            onClick={() => setCurrentPage('landing')}
            className="brutalist-auth-nav-link"
            aria-label="Return to platform overview"
          >
            <ArrowLeft size={15} />
            <span className="brutalist-bracket">[</span>
            <span>BACK</span>
            <span className="brutalist-bracket">]</span>
          </button>
        </div>

        {/* Center: Real Codepolarity Brand Logo */}
        <div className="brutalist-auth-header-center">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage('landing');
            }}
            className="brutalist-auth-logo"
            aria-label="Codepolarity Home"
          >
            <img
              src={logoMark}
              alt="Codepolarity Icon"
              className="h-[24px] sm:h-[26px] w-auto block shrink-0"
              style={{ filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none' }}
            />
            <img
              src={logoText}
              alt="Codepolarity"
              className="h-[20px] sm:h-[22px] w-auto block shrink-0"
              style={{ filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none' }}
            />
          </a>
        </div>

        {/* Right: Time & UTC offset + Theme Toggle */}
        <div className="brutalist-auth-header-right">
          <div className="brutalist-auth-time" title="Live Local & UTC Time">
            <span>{timeString || '10:55 PM, UTC+5'}</span>
          </div>

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="brutalist-auth-theme-btn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
        </div>
      </header>

      {/* Centered Brutalist Auth Card */}
      <main className="brutalist-auth-main">
        <div className="brutalist-auth-card">
          
          {/* Card Top Identifier Badge */}
          <div className="brutalist-auth-card-top">
            <div className="brutalist-auth-badge">
              <span className="brutalist-bracket">[</span>
              <span>AUTHENTICATION // {mode === 'login' ? 'LOGIN' : 'REGISTER'}</span>
              <span className="brutalist-bracket">]</span>
            </div>
          </div>

          {/* Title */}
          <div className="brutalist-auth-heading">
            <h1 className="brutalist-auth-title">
              {mode === 'login' ? 'Access Workspace.' : 'Initialize Account.'}
            </h1>
          </div>

          {/* Alert Banners */}
          {errorMsg && (
            <div className="brutalist-alert error" role="alert">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="brutalist-alert success" role="alert">
              <CheckCircle2 size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Social Auth Grid (Side by side) */}
          <div className="brutalist-social-grid">
            <div className="brutalist-social-wrap">
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
                  className="brutalist-social-btn"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleGitHubLogin}
              disabled={isGitHubLoading}
              className="brutalist-social-btn"
            >
              {isGitHubLoading ? (
                <div className="brutalist-spinner" />
              ) : (
                <>
                  <GithubIcon />
                  <span>GitHub</span>
                </>
              )}
            </button>
          </div>

          {googleNotice && (
            <p className="brutalist-notice">{googleNotice}</p>
          )}

          {/* Divider */}
          <div className="brutalist-divider">
            <span className="brutalist-divider-line" />
            <span className="brutalist-divider-text">[ OR WITH CREDENTIALS ]</span>
            <span className="brutalist-divider-line" />
          </div>

          {/* Auth Form Fields */}
          <form onSubmit={handleSubmit} noValidate className="brutalist-form" autoComplete="off">
            {/* Hidden trap inputs to prevent browser autofilling saved credentials on page load */}
            <input
              type="text"
              name="fake_user_trap"
              style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <input
              type="password"
              name="fake_pass_trap"
              style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              tabIndex={-1}
              autoComplete="new-password"
              aria-hidden="true"
            />
            
            {/* Username field for register mode */}
            {mode === 'register' && (
              <div className="brutalist-input-group brutalist-input-group-animated">
                <div className="brutalist-label-row">
                  <label className="brutalist-label">[ 01 // USERNAME ]</label>
                </div>
                <div className="brutalist-field-wrap">
                  <User size={15} className="brutalist-field-icon" />
                  <input
                    type="text"
                    placeholder="e.g. alexdev"
                    value={username}
                    autoComplete="off"
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError('');
                    }}
                    className={`brutalist-input ${usernameError ? 'is-error' : ''}`}
                  />
                </div>
                {usernameError && <span className="brutalist-field-error">{usernameError}</span>}
              </div>
            )}

            {/* Email field */}
            <div className="brutalist-input-group">
              <div className="brutalist-label-row">
                <label className="brutalist-label">
                  {mode === 'login' ? '[ 01 // EMAIL ]' : '[ 02 // EMAIL ]'}
                </label>
              </div>
              <div className="brutalist-field-wrap">
                <Mail size={15} className="brutalist-field-icon" />
                <input
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  autoComplete="off"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className={`brutalist-input ${emailError ? 'is-error' : ''}`}
                />
              </div>
              {emailError && <span className="brutalist-field-error">{emailError}</span>}
            </div>

            {/* Password field */}
            <div className="brutalist-input-group">
              <div className="brutalist-label-row">
                <label className="brutalist-label">
                  {mode === 'login' ? '[ 02 // PASSWORD ]' : '[ 03 // PASSWORD ]'}
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setErrorMsg('Password reset instructions sent to your email.')}
                    className="brutalist-forgot-btn"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="brutalist-field-wrap">
                <Lock size={15} className="brutalist-field-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="enter password"
                  value={password}
                  autoComplete="new-password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  className={`brutalist-input ${passwordError ? 'is-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="brutalist-eye-btn"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {passwordError && <span className="brutalist-field-error">{passwordError}</span>}

              {/* Password strength meter */}
              {mode === 'register' && password.length > 0 && (
                <div className="brutalist-strength-wrap">
                  <div className="brutalist-strength-bars">
                    <span className={`bar ${passwordStrength >= 1 ? 'active' : ''}`} />
                    <span className={`bar ${passwordStrength >= 2 ? 'active' : ''}`} />
                    <span className={`bar ${passwordStrength >= 3 ? 'active' : ''}`} />
                    <span className={`bar ${passwordStrength >= 4 ? 'active' : ''}`} />
                  </div>
                  <span className="brutalist-strength-text">
                    {passwordStrength <= 1 ? 'Weak' : passwordStrength === 2 ? 'Medium' : passwordStrength === 3 ? 'Strong' : 'Very Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="brutalist-checkbox-row">
              <label className="brutalist-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="brutalist-checkbox"
                />
                <span>Persist session on this workstation</span>
              </label>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="brutalist-submit-btn"
            >
              {isLoading ? (
                <div className="brutalist-spinner white" />
              ) : (
                <>
                  <span className="brutalist-bracket">[</span>
                  <span>{mode === 'login' ? 'AUTHENTICATE & ENTER ↗' : 'INITIALIZE ACCOUNT ↗'}</span>
                  <span className="brutalist-bracket">]</span>
                </>
              )}
            </button>

            {/* Footer Mode Switcher */}
            <div className="brutalist-card-footer">
              {mode === 'login' ? (
                <span>
                  New engineer?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="brutalist-switch-link"
                  >
                    [ CREATE ACCOUNT ↗ ]
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="brutalist-switch-link"
                  >
                    [ SIGN IN ↗ ]
                  </button>
                </span>
              )}
            </div>
          </form>

        </div>
      </main>

      {/* Scoped CSS matching the Climblabs & Brutalist design system */}
      <style dangerouslySetInnerHTML={{ __html: `
        .brutalist-auth-page {
          height: 100vh;
          max-height: 100vh;
          width: 100vw;
          background: #0a0d14;
          color: #f3f4f6;
          font-family: var(--font-sans, "Google Sans Flex", sans-serif);
          position: relative;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* Subtle Ambient Glow & Precision Engineering Grid */
        .brutalist-auth-art {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse at 50% 45%, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 45%, black 40%, transparent 80%);
        }

        .auth-ambient-glow {
          position: absolute;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 720px;
          height: 460px;
          background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.11) 0%, rgba(37, 99, 235, 0.03) 45%, transparent 70%);
          filter: blur(95px);
          animation: ambientPulse 16s ease-in-out infinite alternate;
        }

        @keyframes ambientPulse {
          0% {
            transform: translateX(-50%) scale(0.97);
            opacity: 0.7;
          }
          100% {
            transform: translateX(-50%) scale(1.05);
            opacity: 0.95;
          }
        }

        /* 1. Header Bar */
        .brutalist-auth-header {
          position: relative;
          z-index: 20;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 12px clamp(20px, 4vw, 40px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(10, 13, 20, 0.75);
          backdrop-filter: blur(12px);
          flex-shrink: 0;
          animation: headerEntrance 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes headerEntrance {
          0% {
            opacity: 0;
            transform: translateY(-12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brutalist-auth-header-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .brutalist-auth-header-center {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brutalist-auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s;
        }

        .brutalist-auth-logo:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .brutalist-auth-time {
          font-family: var(--font-mono, monospace);
          font-size: 0.76rem;
          color: #94a3b8;
          padding: 4px 11px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          letter-spacing: 0.03em;
        }

        @media (max-width: 640px) {
          .brutalist-auth-time {
            display: none;
          }
        }

        .brutalist-auth-header-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .brutalist-auth-nav-link {
          background: transparent;
          border: none;
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
          font-weight: 700;
          color: #3b82f6;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: opacity 0.2s, transform 0.2s;
        }

        .brutalist-auth-nav-link:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

        .brutalist-auth-theme-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .brutalist-auth-theme-btn:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        /* 2. Main Content & Card */
        .brutalist-auth-main {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 20px;
          min-height: 0;
          overflow: hidden;
        }

        .brutalist-auth-card {
          width: 100%;
          max-width: 440px;
          background: #0d111a;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 14px;
          padding: 24px 28px 18px;
          box-shadow: 0 20px 54px -14px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.03), 0 0 32px rgba(59, 130, 246, 0.05);
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-sizing: border-box;
          position: relative;
          transition: border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          animation: cardEntrance 1.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardEntrance {
          0% {
            opacity: 0;
            transform: translateY(22px) scale(0.98);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        .brutalist-auth-card:hover {
          border-color: rgba(59, 130, 246, 0.28);
          box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 38px rgba(59, 130, 246, 0.08);
        }

        .brutalist-auth-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding-bottom: 10px;
          animation: cardChildFade 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }

        .brutalist-auth-badge {
          font-family: var(--font-mono, monospace);
          font-size: 0.74rem;
          font-weight: 700;
          color: #3b82f6;
          letter-spacing: 0.06em;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .brutalist-auth-tag {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .brutalist-auth-heading {
          display: flex;
          flex-direction: column;
          gap: 5px;
          animation: cardChildFade 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both;
        }

        .brutalist-auth-title {
          font-family: var(--font-sans, "Google Sans Flex", sans-serif);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #ffffff;
          margin: 0;
          line-height: 1.2;
          display: flex;
          align-items: center;
        }

        .brutalist-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.85);
          margin-right: 10px;
          flex-shrink: 0;
          animation: dotHeartbeat 4.2s ease-in-out infinite;
        }

        @keyframes dotHeartbeat {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.85), 0 0 2px #3b82f6;
          }
          50% {
            opacity: 0.35;
            transform: scale(0.9);
            box-shadow: 0 0 3px rgba(59, 130, 246, 0.25);
          }
        }

        .brutalist-auth-subtitle {
          font-size: 0.83rem;
          color: #94a3b8;
          margin: 0;
          line-height: 1.4;
        }

        /* Alerts */
        .brutalist-alert {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          animation: alertPop 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes alertPop {
          0% {
            opacity: 0;
            transform: translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brutalist-alert.error {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .brutalist-alert.success {
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #93c5fd;
        }

        /* Social Auth Grid */
        .brutalist-social-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          animation: cardChildFade 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.26s both;
        }

        .brutalist-social-wrap {
          display: flex;
          width: 100%;
        }

        .brutalist-social-btn {
          width: 100%;
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #f1f5f9;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .brutalist-social-btn:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(59, 130, 246, 0.35);
          transform: translateY(-1.5px);
        }

        .brutalist-social-btn:active {
          transform: translateY(0);
        }

        .brutalist-notice {
          font-size: 0.76rem;
          color: #94a3b8;
          margin: 0;
          font-family: var(--font-mono, monospace);
        }

        /* Divider */
        .brutalist-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 2px 0;
          animation: cardChildFade 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.34s both;
        }

        .brutalist-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.07);
        }

        .brutalist-divider-text {
          font-family: var(--font-mono, monospace);
          font-size: 0.68rem;
          font-weight: 600;
          color: #64748b;
          letter-spacing: 0.06em;
          padding: 0 2px;
        }

        /* Form */
        .brutalist-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: cardChildFade 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s both;
        }

        .brutalist-input-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .brutalist-input-group-animated {
          animation: fieldUnfold 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fieldUnfold {
          0% {
            opacity: 0;
            transform: translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardChildFade {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .brutalist-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brutalist-label {
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }

        .brutalist-forgot-btn {
          background: transparent;
          border: none;
          font-family: var(--font-mono, monospace);
          font-size: 0.72rem;
          color: #3b82f6;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.2s;
        }

        .brutalist-forgot-btn:hover {
          opacity: 0.8;
          text-decoration: underline;
        }

        .brutalist-field-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .brutalist-field-wrap:focus-within .brutalist-field-icon {
          color: #3b82f6;
          transform: scale(1.1);
        }

        .brutalist-field-icon {
          position: absolute;
          left: 12px;
          color: #64748b;
          pointer-events: none;
          transition: color 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .brutalist-input {
          width: 100%;
          height: 40px;
          background: #090d14;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0 38px 0 36px;
          font-size: 0.88rem;
          color: #ffffff;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .brutalist-input::placeholder {
          color: rgba(148, 163, 184, 0.4);
          opacity: 1;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .brutalist-input:focus::placeholder {
          opacity: 0;
          transform: translateX(4px);
        }

        .brutalist-input:focus {
          border-color: #3b82f6;
          background-color: #0b1019;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.22), 0 0 14px rgba(59, 130, 246, 0.12);
        }

        .brutalist-input.is-error {
          border-color: #ef4444;
        }

        .brutalist-field-error {
          font-size: 0.74rem;
          color: #ef4444;
          margin-top: 1px;
        }

        .brutalist-eye-btn {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 3px;
          transition: color 0.25s, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .brutalist-eye-btn:hover {
          color: #cbd5e1;
          transform: scale(1.1);
        }

        /* Strength Meter */
        .brutalist-strength-wrap {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 2px;
        }

        .brutalist-strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .brutalist-strength-bars .bar {
          height: 3px;
          flex: 1;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          transition: background 0.3s ease;
        }

        .brutalist-strength-bars .bar.active {
          background: #3b82f6;
        }

        .brutalist-strength-text {
          font-family: var(--font-mono, monospace);
          font-size: 0.7rem;
          color: #94a3b8;
        }

        /* Checkbox */
        .brutalist-checkbox-row {
          display: flex;
          align-items: center;
          margin: 1px 0 2px;
        }

        .brutalist-checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.81rem;
          color: #94a3b8;
          cursor: pointer;
          user-select: none;
          transition: color 0.25s;
        }

        .brutalist-checkbox-label:hover {
          color: #e2e8f0;
        }

        .brutalist-checkbox {
          accent-color: #3b82f6;
          width: 14px;
          height: 14px;
          cursor: pointer;
          border-radius: 4px;
        }

        /* Submit Button */
        .brutalist-submit-btn {
          width: 100%;
          height: 42px;
          background: #2563eb;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0 18px;
          font-family: var(--font-mono, monospace);
          font-size: 0.84rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 2px;
          box-shadow: none;
          transition: background-color 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .brutalist-submit-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1.5px);
          box-shadow: none;
        }

        .brutalist-submit-btn:active {
          transform: translateY(0);
          background: #1e40af;
          box-shadow: none;
        }

        .brutalist-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .brutalist-bracket {
          font-weight: 800;
        }

        /* Footer Switcher */
        .brutalist-card-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.82rem;
          color: #94a3b8;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 12px;
          margin-top: 2px;
          animation: cardChildFade 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }

        .brutalist-switch-link {
          background: transparent;
          border: none;
          color: #3b82f6;
          font-family: var(--font-mono, monospace);
          font-weight: 700;
          font-size: 0.83rem;
          cursor: pointer;
          padding: 0;
          margin-left: 5px;
          transition: opacity 0.2s;
        }

        .brutalist-switch-link:hover {
          opacity: 0.85;
          text-decoration: underline;
        }

        /* Spinner */
        .brutalist-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .brutalist-spinner.white {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ────────────────── Comprehensive Light Mode Polishing ────────────────── */
        [data-theme="light"] .brutalist-auth-page {
          background: #f8fafc;
          color: #0f172a;
        }

        /* Ambient background art in light mode */
        [data-theme="light"] .brutalist-auth-art {
          background-image: radial-gradient(rgba(15, 23, 42, 0.065) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse at 50% 45%, black 45%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 45%, black 45%, transparent 80%);
        }

        [data-theme="light"] .auth-ambient-glow {
          background: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.07) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 70%);
          filter: blur(100px);
        }

        /* Top Header Bar */
        [data-theme="light"] .brutalist-auth-header {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
        }

        [data-theme="light"] .brutalist-auth-nav-link {
          color: #2563eb;
        }

        [data-theme="light"] .brutalist-auth-nav-link:hover {
          color: #1d4ed8;
          opacity: 1;
        }

        [data-theme="light"] .brutalist-auth-logo img {
          filter: none !important;
        }

        [data-theme="light"] .brutalist-auth-time {
          background: rgba(15, 23, 42, 0.04);
          border: 1px solid rgba(15, 23, 42, 0.08);
          color: #475569;
          font-weight: 600;
        }

        [data-theme="light"] .brutalist-auth-theme-btn {
          background: rgba(15, 23, 42, 0.04);
          border: 1px solid rgba(15, 23, 42, 0.09);
          color: #334155;
        }

        [data-theme="light"] .brutalist-auth-theme-btn:hover {
          background: rgba(15, 23, 42, 0.08);
          border-color: rgba(15, 23, 42, 0.18);
          color: #0f172a;
        }

        /* Brutalist Auth Card */
        [data-theme="light"] .brutalist-auth-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.09);
          box-shadow: 
            0 20px 45px -12px rgba(15, 23, 42, 0.08),
            0 0 0 1px rgba(15, 23, 42, 0.02),
            0 4px 12px -2px rgba(15, 23, 42, 0.03);
        }

        [data-theme="light"] .brutalist-auth-card:hover {
          border-color: rgba(37, 99, 235, 0.35);
          box-shadow: 
            0 24px 50px -10px rgba(15, 23, 42, 0.1),
            0 0 0 1px rgba(37, 99, 235, 0.15),
            0 0 28px rgba(37, 99, 235, 0.06);
        }

        [data-theme="light"] .brutalist-auth-card-top {
          border-bottom: 1px solid rgba(15, 23, 42, 0.07);
        }

        [data-theme="light"] .brutalist-auth-badge {
          color: #2563eb;
        }

        [data-theme="light"] .brutalist-auth-tag {
          color: #64748b;
        }

        [data-theme="light"] .brutalist-dot {
          background: #2563eb;
          box-shadow: 0 0 8px rgba(37, 99, 235, 0.5);
        }

        [data-theme="light"] .brutalist-auth-title {
          color: #0f172a;
        }

        [data-theme="light"] .brutalist-auth-subtitle {
          color: #64748b;
        }

        /* Social OAuth Buttons */
        [data-theme="light"] .brutalist-social-btn {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.11);
          color: #1e293b;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        [data-theme="light"] .brutalist-social-btn:hover {
          background: #f8fafc;
          border-color: rgba(37, 99, 235, 0.4);
          color: #0f172a;
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.07);
        }

        [data-theme="light"] .brutalist-social-btn:active {
          background: #f1f5f9;
          transform: translateY(0);
        }

        [data-theme="light"] .brutalist-notice {
          color: #64748b;
        }

        /* Divider */
        [data-theme="light"] .brutalist-divider-line {
          background: rgba(15, 23, 42, 0.09);
        }

        [data-theme="light"] .brutalist-divider-text {
          color: #64748b;
        }

        /* Labels & Icons */
        [data-theme="light"] .brutalist-label {
          color: #475569;
          font-weight: 700;
        }

        [data-theme="light"] .brutalist-forgot-btn {
          color: #2563eb;
        }

        [data-theme="light"] .brutalist-forgot-btn:hover {
          color: #1d4ed8;
        }

        [data-theme="light"] .brutalist-field-icon {
          color: #64748b;
        }

        [data-theme="light"] .brutalist-field-wrap:focus-within .brutalist-field-icon {
          color: #2563eb;
        }

        /* Form Inputs */
        [data-theme="light"] .brutalist-input {
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.12);
          color: #0f172a;
          box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        [data-theme="light"] .brutalist-input::placeholder {
          color: rgba(15, 23, 42, 0.32);
          opacity: 1;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        [data-theme="light"] .brutalist-input:focus::placeholder {
          opacity: 0;
          transform: translateX(4px);
        }

        [data-theme="light"] .brutalist-input:hover {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.25);
        }

        [data-theme="light"] .brutalist-input:focus {
          background-color: #ffffff !important;
          border-color: #2563eb !important;
          color: #0f172a !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15), 0 1px 2px rgba(15, 23, 42, 0.05) !important;
        }

        [data-theme="light"] .brutalist-input.is-error {
          background: #fef2f2 !important;
          border-color: #ef4444 !important;
          color: #0f172a !important;
        }

        [data-theme="light"] .brutalist-field-error {
          color: #dc2626;
        }

        /* Browser Autofill Support in Light Mode */
        [data-theme="light"] .brutalist-input:-webkit-autofill,
        [data-theme="light"] .brutalist-input:-webkit-autofill:hover,
        [data-theme="light"] .brutalist-input:-webkit-autofill:focus,
        [data-theme="light"] .brutalist-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #f8fafc inset !important;
          -webkit-text-fill-color: #0f172a !important;
          caret-color: #0f172a !important;
          border-color: rgba(15, 23, 42, 0.14) !important;
        }

        [data-theme="light"] .brutalist-input:focus:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
          border-color: #2563eb !important;
        }

        [data-theme="light"] .brutalist-eye-btn {
          color: #64748b;
        }

        [data-theme="light"] .brutalist-eye-btn:hover {
          color: #0f172a;
        }

        /* Password Strength Meter */
        [data-theme="light"] .brutalist-strength-bars .bar {
          background: rgba(15, 23, 42, 0.1);
        }

        [data-theme="light"] .brutalist-strength-bars .bar.active {
          background: #2563eb;
        }

        [data-theme="light"] .brutalist-strength-text {
          color: #64748b;
        }

        /* Checkbox */
        [data-theme="light"] .brutalist-checkbox {
          accent-color: #2563eb;
        }

        [data-theme="light"] .brutalist-checkbox-label {
          color: #475569;
        }

        [data-theme="light"] .brutalist-checkbox-label:hover {
          color: #0f172a;
        }

        /* Submit Button */
        [data-theme="light"] .brutalist-submit-btn {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 2px 8px -1px rgba(37, 99, 235, 0.35);
        }

        [data-theme="light"] .brutalist-submit-btn:hover {
          background: #1d4ed8;
          box-shadow: 0 4px 14px -2px rgba(37, 99, 235, 0.45);
        }

        [data-theme="light"] .brutalist-submit-btn:active {
          background: #1e40af;
          box-shadow: none;
        }

        /* Footer */
        [data-theme="light"] .brutalist-card-footer {
          border-top: 1px solid rgba(15, 23, 42, 0.07);
          color: #64748b;
        }

        [data-theme="light"] .brutalist-switch-link {
          color: #2563eb;
        }

        [data-theme="light"] .brutalist-switch-link:hover {
          color: #1d4ed8;
        }

        /* Alerts */
        [data-theme="light"] .brutalist-alert.error {
          background: #fef2f2;
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #b91c1c;
        }

        [data-theme="light"] .brutalist-alert.success {
          background: #eff6ff;
          border: 1px solid rgba(37, 99, 235, 0.25);
          color: #1d4ed8;
        }

        /* Spinners */
        [data-theme="light"] .brutalist-spinner {
          border-color: rgba(15, 23, 42, 0.15);
          border-top-color: #2563eb;
        }

        [data-theme="light"] .brutalist-spinner.white {
          border-color: rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
        }
      `}} />
    </div>
  );
}
