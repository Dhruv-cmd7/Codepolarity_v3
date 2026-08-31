"use client";
 
import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff } from "lucide-react";
import dsLogo from "../../assets/ds_logo.svg";

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
  onClose,
}) => {
  // Local state fallbacks if props are not provided
  const [localAuthMode, localSetAuthMode] = useState<"login" | "register">("register");
  const [localUsername, localSetUsername] = useState("");
  const [localEmail, localSetEmail] = useState("");
  const [localPassword, localSetPassword] = useState("");
  const [localAuthError, localSetAuthError] = useState("");
  
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
          font-family: 'Google Sans Flex', 'Inter', -apple-system, sans-serif;
        }

        @keyframes fsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .fs-card {
          width: 100%;
          max-width: 1020px;
          display: flex;
          flex-direction: row;
          background: #0f131a;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
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

        /* Left Side: Uses same background image as landing page hero section. Shuffled layout to space-between. */
        .fs-left-panel {
          width: 50%;
          position: relative;
          background-image: url("https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_hero_gradient.jpg");
          background-size: cover;
          background-position: center;
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          min-height: 520px;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .fs-left-panel {
            width: 100%;
            min-height: 280px;
            padding: 32px;
          }
        }

        /* Gradient overlay mirroring landing page hero design */
        .fs-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(10, 13, 20, 0.15) 0%, rgba(10, 13, 20, 0.75) 100%);
          z-index: 1;
          pointer-events: none;
        }

        .fs-title {
          font-size: 44px;
          font-weight: 700;
          line-height: 1.15;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.03em;
        }

        .fs-subtitle {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.6;
          color: #cbd5e1;
          margin-top: 16px;
          margin-bottom: 0;
        }

        /* Right Side: Sleek Dark Form */
        .fs-right-panel {
          width: 50%;
          background: #0b0e14;
          padding: 48px;
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
            padding: 32px;
          }
        }

        .fs-close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 50;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #9ca3af;
          border-radius: 50%;
          width: 38px;
          height: 38px;
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
          gap: 20px;
        }

        .fs-form-header {
          display: flex;
          flex-direction: column;
          margin-bottom: 28px;
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
                <img src={dsLogo} alt="Codepolarity" className="fs-logo-img" />
              </div>
            </div>
            <h2 className="fs-heading">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
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
                    placeholder="Username"
                    autoComplete="new-password"
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
                  placeholder="Email"
                  autoComplete="new-password"
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
                  placeholder="Password"
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
