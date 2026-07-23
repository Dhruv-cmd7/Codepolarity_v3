import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, ChevronRight, Award, RotateCcw } from 'lucide-react';

const Assessment = ({ token, user, onUpdateUser, setCurrentPage }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [token]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/assessment/questions', {
        headers: {
          'x-auth-token': token
        }
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(data);
      } else {
        setError(data.msg || 'Failed to fetch assessment questions');
      }
    } catch (err) {
      setError('Connection failed. Is the API online?');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIdx) => {
    setAnswers({
      ...answers,
      [questionId]: optionIdx
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        onUpdateUser(data.user);
      } else {
        setError(data.msg || 'Submission failed');
      }
    } catch (err) {
      setError('Failed to submit answers.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setResult(null);
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div className="glass-panel" style={styles.loadingBox}>
          <div className="animate-float" style={styles.loaderIcon}>⚛️</div>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Calibrating assessment diagnostics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div className="glass-panel" style={styles.errorBox}>
          <p style={{ color: 'var(--accent-error)', fontSize: '1.1rem' }}>{error}</p>
          <button onClick={fetchQuestions} className="btn-primary" style={{ marginTop: '1.5rem' }}>Retry Connection</button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div style={styles.container} className="animate-fade-in">
        {/* Background decorative glow */}
        <div className="glow-orb glow-orb-purple" style={{ top: '20%', left: '30%' }}></div>

        <div className="glass-panel glass-panel-glow-cyan" style={styles.resultCard}>
          <Award size={48} style={styles.resultIcon} />
          <h2 style={styles.resultTitle}>Assessment Complete!</h2>
          <p style={styles.resultSubtitle}>We have calibrated your programming aptitude.</p>

          <div style={styles.scoreMetric}>
            <span style={styles.scoreLabel}>DIAGNOSTIC SCORE</span>
            <span style={styles.scoreValue}>{result.score} <span style={{ fontSize: '1.5rem', color: 'var(--text-dim)' }}>/ {result.totalQuestions}</span></span>
          </div>

          <div style={styles.levelIndicator}>
            <span style={styles.levelLabel}>CALIBRATED LEVEL</span>
            <span 
              style={{
                ...styles.levelBadge,
                color: result.level === 'Advanced' ? 'var(--accent-purple)' : result.level === 'Intermediate' ? 'var(--accent-blue)' : 'var(--accent-cyan)',
                borderColor: result.level === 'Advanced' ? 'var(--accent-purple)' : result.level === 'Intermediate' ? 'var(--accent-blue)' : 'var(--accent-cyan)',
                boxShadow: result.level === 'Advanced' ? 'var(--glow-purple)' : result.level === 'Intermediate' ? '0 0 20px rgba(79, 172, 254, 0.3)' : 'var(--glow-cyan)'
              }}
            >
              {result.level}
            </span>
          </div>

          <p style={styles.levelDesc}>
            {result.level === 'Beginner' && "You possess a foundational understanding of web development and programming logic. We recommend starting with HTML/CSS and introductory scripting in the Frontend or Backend tracks."}
            {result.level === 'Intermediate' && "Excellent! You are comfortable with general programming logic, common data structures, and basic software concepts. You are ready to dive into React architecture, SQL databases, or Machine Learning Math."}
            {result.level === 'Advanced' && "Incredible! You have a strong grasp of algorithmic complexity, advanced system architectures, and neural network foundations. We suggest exploring LLMs, Transformers, next-generation web servers, and containerized deployments."}
          </p>

          <div style={styles.resultActions}>
            <button onClick={() => setCurrentPage('roadmaps')} className="btn-primary" style={styles.actionBtn}>
              Explore Roadmaps
              <ChevronRight size={18} style={{ marginLeft: '6px' }} />
            </button>
            <button onClick={resetQuiz} className="btn-secondary" style={styles.actionBtnSec}>
              <RotateCcw size={16} style={{ marginRight: '6px' }} />
              Retake Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.progressContainer}>
        <div style={styles.progressHeader}>
          <span style={styles.progressText}>Question {currentIdx + 1} of {questions.length}</span>
          <span style={styles.progressPercent}>{progressPercent}% Complete</span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="glass-panel" style={styles.quizCard}>
        <div style={styles.questionHeader}>
          <HelpCircle size={24} style={{ color: 'var(--accent-cyan)', minWidth: '24px' }} />
          <h2 style={styles.questionText}>{currentQuestion?.question}</h2>
        </div>

        <div style={styles.optionsList}>
          {currentQuestion?.options.map((option, idx) => {
            const isSelected = answers[currentQuestion.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(currentQuestion.id, idx)}
                style={{
                  ...styles.optionBtn,
                  borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-light)',
                  background: isSelected ? 'rgba(0, 242, 254, 0.05)' : 'var(--bg-input)',
                  boxShadow: isSelected ? '0 0 15px rgba(0, 242, 254, 0.1)' : 'none',
                }}
              >
                <div style={{
                  ...styles.optionDot,
                  borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--text-dim)',
                  background: isSelected ? 'var(--accent-cyan)' : 'transparent',
                }} />
                <span style={{ color: isSelected ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: isSelected ? '600' : '400' }}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        <div style={styles.navigation}>
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="btn-secondary"
            style={styles.navBtn}
          >
            Back
          </button>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length || submitting}
              className="btn-primary"
              style={styles.submitBtn}
            >
              {submitting ? 'Calibrating...' : 'Submit Answers'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion.id] === undefined}
              className="btn-primary"
              style={styles.navBtn}
            >
              Next
              <ChevronRight size={16} style={{ marginLeft: '4px' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '750px',
    margin: '3rem auto',
    padding: '0 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
  },
  loadingBox: {
    padding: '3rem',
    textAlign: 'center',
  },
  loaderIcon: {
    fontSize: '3rem',
    color: 'var(--accent-cyan)',
    filter: 'drop-shadow(var(--glow-cyan))',
  },
  errorBox: {
    padding: '3rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 0, 84, 0.2)',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  progressBarBg: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '100px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))',
    borderRadius: '100px',
    boxShadow: 'var(--glow-cyan)',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  quizCard: {
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.2rem',
  },
  questionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  questionText: {
    fontSize: '1.35rem',
    fontWeight: '600',
    lineHeight: '1.4',
    color: 'var(--text-main)',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  optionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.1rem 1.5rem',
    borderRadius: '10px',
    border: '1px solid',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '1rem',
    fontFamily: 'var(--font-sans)',
    transition: 'var(--transition-smooth)',
  },
  optionDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: '2px solid',
    transition: 'var(--transition-fast)',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  navBtn: {
    minWidth: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtn: {
    minWidth: '150px',
  },
  resultCard: {
    padding: '3rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  resultIcon: {
    color: 'var(--accent-cyan)',
    filter: 'drop-shadow(var(--glow-cyan))',
  },
  resultTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  resultSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
    marginTop: '-0.5rem',
  },
  scoreMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    marginTop: '1rem',
  },
  scoreLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-dim)',
    letterSpacing: '1.5px',
  },
  scoreValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--text-main)',
  },
  levelIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginTop: '0.5rem',
  },
  levelLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-dim)',
    letterSpacing: '1.5px',
  },
  levelBadge: {
    fontSize: '1.3rem',
    fontWeight: '800',
    letterSpacing: '1px',
    padding: '0.5rem 2rem',
    borderRadius: '100px',
    border: '1px solid',
    textTransform: 'uppercase',
  },
  levelDesc: {
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    maxWidth: '550px',
    fontSize: '0.95rem',
    margin: '1rem 0',
  },
  resultActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSec: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default Assessment;
