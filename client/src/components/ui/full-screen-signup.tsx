"use client";
 
import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import logoMark from "../../assets/logo.svg";

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

interface FullScreenSignupProps {
  authMode?: "login" | "register";
  setAuthMode?: (mode: "login" | "register") => void;
  username?: string;
  setUsername?: (val: string) => void;
  email?: string;
  setEmail?: (val: string) => void;
  password?: string;
  setPassword?: (val: string) => void;
  authError?: string;
  setAuthError?: (val: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onGoogleSuccess?: (credential: string) => void;
  onGoogleError?: (err: string) => void;
  onGitHubSuccess?: (userObj: any) => void;
  onClose?: () => void;
}
 
export const FullScreenSignup: React.FC<FullScreenSignupProps> = ({
  authMode: propAuthMode,
  setAuthMode: propSetAuthMode,
  username: propUsername,
  setUsername: propSetUsername,
  email: propEmail,
  setEmail: propSetEmail,
  password: propPassword,
  setPassword: propSetPassword,
  authError: propAuthError,
  setAuthError: propSetAuthError,
  onSubmit,
  onGoogleSuccess,
  onGoogleError,
  onClose,
}) => {
  // Local state fallbacks if props are not provided
  const [localAuthMode, localSetAuthMode] = useState<"login" | "register">("register");
  const [localUsername, localSetUsername] = useState("");
  const [localEmail, localSetEmail] = useState("");
  const [localPassword, localSetPassword] = useState("");
  const [localAuthError, localSetAuthError] = useState("");
  const [googleNotice, setGoogleNotice] = useState("");
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Initialize Google Identity Services (GSI)
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const initGsi = () => {
      const g = (window as any).google;
      if (g?.accounts?.id) {
        g.accounts.id.initialize({
          client_id: clientId,
          callback: (res: { credential?: string }) => {
            if (res.credential) {
              if (onGoogleSuccess) {
                onGoogleSuccess(res.credential);
              }
            } else if (onGoogleError) {
              onGoogleError("Google Sign-In was cancelled or failed.");
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = "";
          g.accounts.id.renderButton(googleBtnRef.current, {
            type: "standard",
            theme: "filled_black",
            size: "large",
            text: mode === "login" ? "signin_with" : "signup_with",
            shape: "pill",
            width: 320,
            logo_alignment: "left",
          });
        }
      }
    };

    if ((window as any).google?.accounts?.id) {
      initGsi();
    } else {
      const existingScript = document.getElementById("google-gsi-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-gsi-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initGsi;
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", initGsi);
      }
    }
  }, [propAuthMode, localAuthMode, onGoogleSuccess, onGoogleError]);

  const handleCustomGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setGoogleNotice(
        "Google Client ID is not set yet. Add your VITE_GOOGLE_CLIENT_ID in client/.env and server/.env to enable Google Sign-In."
      );
      return;
    }
    const g = (window as any).google;
    if (g?.accounts?.id) {
      g.accounts.id.prompt();
    }
  };

  const handleGitHubClick = async () => {
    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (githubClientId) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/github/callback`);
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${redirectUri}&scope=user:email`;
      return;
    }

    try {
      const demoGithubUser = {
        githubId: `gh_demo_${Date.now().toString().slice(-6)}`,
        username: emailVal ? emailVal.split('@')[0] : `dev_${Math.floor(1000 + Math.random() * 9000)}`,
        email: emailVal || `dev_${Math.floor(1000 + Math.random() * 9000)}@github.com`,
        avatar: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        name: userVal || 'GitHub Developer'
      };

      const res = await fetch('/api/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUser: demoGithubUser })
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        if (onGitHubSuccess) {
          onGitHubSuccess(data.user);
        } else {
          window.location.reload();
        }
      } else {
        setErrorVal(data.msg || 'GitHub authentication failed');
      }
    } catch (err) {
      setErrorVal('Failed to connect to authentication server');
    }
  };
  
  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  // Password Visibility Toggle State
  const [showPassword, setShowPassword] = useState(false);

  // Active variables (prop or local)
  const isIntegrated = onSubmit !== undefined;
  const mode = propAuthMode !== undefined ? propAuthMode : localAuthMode;
  const setMode = propSetAuthMode !== undefined ? propSetAuthMode : localSetAuthMode;
  
  const userVal = propUsername !== undefined ? propUsername : localUsername;
  const setUserVal = propSetUsername !== undefined ? propSetUsername : localSetUsername;
  
  const emailVal = propEmail !== undefined ? propEmail : localEmail;
  const setEmailVal = propSetEmail !== undefined ? propSetEmail : localSetEmail;
  
  const passwordVal = propPassword !== undefined ? propPassword : localPassword;
  const setPasswordVal = propSetPassword !== undefined ? propSetPassword : localSetPassword;
  
  const errorVal = propAuthError !== undefined ? propAuthError : localAuthError;
  const setErrorVal = propSetAuthError !== undefined ? propSetAuthError : localSetAuthError;
 
  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };
 
  const validatePassword = (value: string) => {
    return value.length >= 8;
  };
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
 
    if (!validateEmail(emailVal)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }
 
    if (!validatePassword(passwordVal)) {
      setPasswordError("Password must be at least 8 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (mode === "register" && userVal.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters.");
      valid = false;
    } else {
      setUsernameError("");
    }
 
    setSubmitted(true);
 
    if (valid) {
      if (isIntegrated && onSubmit) {
        onSubmit(e);
      } else {
        console.log("Form submitted!");
        console.log("Mode:", mode);
        console.log("Username:", userVal);
        console.log("Email:", emailVal);
        alert(`Form submitted! Mode: ${mode}, Email: ${emailVal}`);
        setEmailVal("");
        setPasswordVal("");
        setUserVal("");
        setSubmitted(false);
      }
    }
  };
 
  return (
    <div className="fs-overlay">
      {/* Self-contained styling matching the website's dark slate + cyan/purple theme */}
      <style dangerouslySetInnerHTML={{ __html: `
        .fs-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10, 13, 20, 0.95);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          animation: fsFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: 'Google Sans Flex', 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        @keyframes fsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .fs-card {
          width: 100%;
          max-width: 820px;
          display: flex;
          flex-direction: row;
          background: #0f131a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
          position: relative;
          animation: fsCardEntry 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes fsCardEntry {
          from { transform: translateY(30px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        @media (max-width: 768px) {
          .fs-card {
            flex-direction: column;
            max-height: 90vh;
            overflow-y: auto;
          }
        }

        /* Left Side: Technical Developer Grid Background */
        .fs-left-panel {
          width: 50%;
          position: relative;
          background-color: #0a0d14;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          min-height: 420px;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .fs-left-panel {
            width: 100%;
            min-height: 240px;
            padding: 24px;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
        }

        /* Ambient overlay */
        .fs-left-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .fs-title {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.15;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.03em;
        }

        .fs-subtitle {
          font-size: 13px;
          font-weight: 300;
          line-height: 1.5;
          color: #cbd5e1;
          margin-top: 12px;
          margin-bottom: 0;
        }

        /* Right Side: Sleek Dark Form */
        .fs-right-panel {
          width: 50%;
          background: #0b0e14;
          padding: 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          box-sizing: border-box;
          z-index: 5;
        }

        @media (max-width: 768px) {
          .fs-right-panel {
            width: 100%;
            padding: 24px;
          }
        }

        .fs-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 50;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #9ca3af;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .fs-close-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          transform: rotate(90deg);
        }

        .fs-close-btn:active {
          transform: scale(0.92);
        }

        /* Form Details */
        .fs-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .fs-form-header {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }

        .fs-logo-wrapper {
          position: relative;
          width: fit-content;
          margin-bottom: 16px;
        }

        .fs-logo-box {
          position: relative;
          z-index: 2;
        }

        .fs-logo-img {
          height: 28px;
          width: auto;
          filter: brightness(0) invert(1);
          display: block;
        }

        .fs-heading {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.02em;
        }

        /* Input Controls */
        .fs-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }

        .fs-input-box {
          position: relative;
          width: 100%;
        }

        .fs-input {
          width: 100%;
          background: #131722;
          border: 1px solid transparent;
          color: #ffffff;
          padding: 13px 44px 13px 44px;
          border-radius: 12px;
          font-size: 14.5px;
          font-family: inherit;
          box-sizing: border-box;
          outline: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .fs-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .fs-input:focus {
          background: #171c2a;
        }

        .fs-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #8a929e;
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .fs-input:focus ~ .fs-input-icon,
        .fs-input:focus + .fs-input-icon {
          color: #3186FF;
        }

        /* Password Visibility Toggle Eye Button */
        .fs-pwd-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #8a929e;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
          outline: none;
        }

        .fs-pwd-toggle:hover {
          color: #3186FF;
        }

        /* Prevent Chrome/Safari autofill from overriding background and text color, and hiding icons */
        .fs-input:-webkit-autofill,
        .fs-input:-webkit-autofill:hover, 
        .fs-input:-webkit-autofill:focus, 
        .fs-input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #131722 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* Error States */
        .fs-input-error-border {
          border-color: rgba(239, 68, 68, 0.4) !important;
        }

        .fs-error-msg {
          font-size: 11px;
          color: #f87171;
          margin: 0;
          margin-top: 4px;
        }

        .fs-alert-banner {
          background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.16);
          color: #f87171;
          border-radius: 12px;
          padding: 12px 14px;
          font-size: 12.5px;
          line-height: 1.5;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Button Grid (Uses website's primary white button styling) */
        .fs-btn-submit {
          width: 100%;
          background: #f3f4f6;
          color: #0a0d14;
          border: 1px solid #f3f4f6;
          padding: 13px 24px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
          font-family: inherit;
        }

        .fs-btn-submit:hover {
          background: #ffffff;
          border-color: #ffffff;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .fs-btn-submit:active {
          transform: translateY(0) scale(1);
        }

        .fs-toggle-footer {
          text-align: center;
          font-size: 13.5px;
          color: #8a929e;
          margin-top: 16px;
        }

        .fs-toggle-btn {
          background: transparent;
          border: none;
          color: #3186FF;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
          font-family: inherit;
          font-size: inherit;
          transition: color 0.2s ease;
        }

        .fs-toggle-btn:hover {
          color: #5da2ff;
        }

        /* Google Sign-in & Divider Styling */
        .fs-google-wrapper {
          width: 100%;
          margin-bottom: 4px;
        }

        .fs-google-btn {
          width: 100%;
          height: 44px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .fs-google-btn:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(255, 255, 255, 0.24);
          transform: translateY(-1px);
        }

        .fs-divider {
          display: flex;
          align-items: center;
          text-align: center;
          width: 100%;
          margin: 16px 0;
          color: #64748b;
        }

        .fs-divider::before,
        .fs-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .fs-divider span {
          padding: 0 12px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-size: 10.5px;
          font-weight: 600;
          color: #64748b;
        }

        .fs-notice-banner {
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.2);
          color: #93c5fd;
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 12px;
          line-height: 1.5;
          margin-top: 10px;
          text-align: left;
        }
      ` }} />

      {/* Main Glassmorphic Card Container */}
      <div className="fs-card">
        
        {/* Floating Action Close Button */}
        {onClose && (
          <button onClick={onClose} className="fs-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        )}

        {/* Left Graphics Panel */}
        <div className="fs-left-panel">
          {/* Dark Overlay for text legibility */}
          <div className="fs-left-overlay"></div>

          {/* Heading Content: Good Line at the top (Badge removed, Title enlarged) */}
          <div style={{ position: "relative", zIndex: 10 }}>
            <h1 className="fs-title">
              Learning is in orbit.
            </h1>
            <p className="fs-subtitle">
              Calibrate your programming level, follow structured roadmaps, and practice coding live.
            </p>
          </div>

          {/* Heading Content: Real Logo & Name shifted to bottom */}
          <div style={{ position: "relative", zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img 
                src={dsLogo} 
                alt="Codepolarity" 
                style={{ 
                  height: 20, 
                  width: 'auto', 
                  filter: 'brightness(0) invert(1)' 
                }} 
              />
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', color: '#ffffff', textTransform: 'uppercase' }}>Codepolarity</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="fs-right-panel">
          
          {/* Logo & Section Header */}
          <div className="fs-form-header">
            <div className="fs-logo-wrapper">
              <div className="fs-logo-box">
                <img src={logoMark} alt="Codepolarity" className="fs-logo-img" />
              </div>
            </div>
            <h2 className="fs-heading">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
          </div>

          {/* Social Authentication Section (Google & GitHub) */}
          <div className="fs-social-grid" style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <div
                ref={googleBtnRef}
                style={{
                  width: "100%",
                  display: import.meta.env.VITE_GOOGLE_CLIENT_ID ? "flex" : "none",
                  justifyContent: "center",
                }}
              />
              {(!import.meta.env.VITE_GOOGLE_CLIENT_ID || !googleBtnRef.current?.hasChildNodes()) && (
                <button
                  type="button"
                  onClick={handleCustomGoogleClick}
                  className="fs-google-btn"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleGitHubClick}
              className="fs-google-btn"
              style={{ flex: 1, background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.18)' }}
            >
              <GithubIcon />
              <span>GitHub</span>
            </button>
          </div>

          {googleNotice && (
            <div className="fs-notice-banner">
              {googleNotice}
            </div>
          )}

          {/* Divider */}
          <div className="fs-divider">
            <span>or continue with email</span>
          </div>

          {/* Auth form */}
          <form className="fs-form" onSubmit={handleSubmit} noValidate>
            
            {/* Global API Form Errors */}
            {errorVal && (
              <div className="fs-alert-banner">
                <Sparkles size={14} style={{ color: "#f87171" }} />
                <span>{errorVal}</span>
              </div>
            )}

            {/* Username Field (Sign up only) */}
            {mode === "register" && (
              <div className="fs-group">
                <div className="fs-input-box">
                  <input
                    type="text"
                    placeholder="choose a username"
                    autoComplete="off"
                    className={`fs-input ${usernameError ? "fs-input-error-border" : ""}`}
                    value={userVal}
                    onChange={(e) => {
                      setUserVal(e.target.value);
                      if (usernameError) setUsernameError("");
                    }}
                    aria-invalid={!!usernameError}
                  />
                  <User className="fs-input-icon" size={16} />
                </div>
                {usernameError && <p className="fs-error-msg">{usernameError}</p>}
              </div>
            )}

            {/* Email Field */}
            <div className="fs-group">
              <div className="fs-input-box">
                <input
                  type="email"
                  placeholder="you@domain.com"
                  autoComplete="off"
                  className={`fs-input ${emailError ? "fs-input-error-border" : ""}`}
                  value={emailVal}
                  onChange={(e) => {
                    setEmailVal(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  aria-invalid={!!emailError}
                />
                <Mail className="fs-input-icon" size={16} />
              </div>
              {emailError && <p className="fs-error-msg">{emailError}</p>}
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="fs-group">
              <div className="fs-input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="enter password"
                  autoComplete="new-password"
                  className={`fs-input ${passwordError ? "fs-input-error-border" : ""}`}
                  value={passwordVal}
                  onChange={(e) => {
                    setPasswordVal(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  aria-invalid={!!passwordError}
                />
                <Lock className="fs-input-icon" size={16} />
                
                {/* Password Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="fs-pwd-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && <p className="fs-error-msg">{passwordError}</p>}
            </div>

            {/* Submit CTA */}
            <button type="submit" className="fs-btn-submit">
              <span>{mode === "login" ? "Sign In to Account" : "Get Started"}</span>
              <ArrowRight size={16} />
            </button>

            {/* Toggle Mode footer link */}
            <div className="fs-toggle-footer">
              {mode === "login" ? (
                <>
                  New to the platform?
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setErrorVal("");
                    }}
                    className="fs-toggle-btn"
                  >
                    Register now
                  </button>
                </>
              ) : (
                <>
                  Already registered?
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setErrorVal("");
                    }}
                    className="fs-toggle-btn"
                  >
                    Login here
                  </button>
                </>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
