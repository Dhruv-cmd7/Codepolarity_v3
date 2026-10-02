import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, ChevronRight, Award, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { apiUrl } from '../config/api';

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
      const res = await fetch(apiUrl('/api/assessment/questions'), {
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
      const res = await fetch(apiUrl('/api/assessment/submit'), {
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

  // Loading View with Signature Brutalist Style
  if (loading) {
    return (
      <div className="signature-page-container flex items-center justify-center min-h-[80vh]">
        <div className="signature-ambient-glow" aria-hidden="true" />
        <div className="signature-grid-bg" aria-hidden="true" />
        <div className="signature-card text-center max-w-md w-full relative z-10 flex flex-col items-center gap-4 py-12 px-8">
          <div className="signature-badge">
            <span className="signature-bracket">[</span>
            <span>04 // SYSTEM DIAGNOSTIC</span>
            <span className="signature-bracket">]</span>
          </div>
          <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin my-2" />
          <h3 className="signature-card-title text-lg font-bold text-zinc-100">Calibrating Diagnostic Challenges</h3>
          <p className="text-xs font-mono text-zinc-400">Assembling algorithmic benchmark telemetry...</p>
        </div>
      </div>
    );
  }

  // Error View with Signature Brutalist Style
  if (error) {
    return (
      <div className="signature-page-container flex items-center justify-center min-h-[80vh]">
        <div className="signature-ambient-glow" aria-hidden="true" />
        <div className="signature-grid-bg" aria-hidden="true" />
        <div className="signature-card text-center max-w-md w-full relative z-10 flex flex-col items-center gap-4 py-10 px-8 border-red-500/30">
          <div className="signature-badge text-red-400">
            <span className="signature-bracket">[</span>
            <span>CONNECTION ERROR</span>
            <span className="signature-bracket">]</span>
          </div>
          <p className="text-sm text-red-300">{error}</p>
          <button onClick={fetchQuestions} className="signature-btn-primary mt-2">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Results View with Architectural Certificate / Report Card
  if (result) {
    const isAdvanced = result.level === 'Advanced';
    const isIntermediate = result.level === 'Intermediate';

    return (
      <div className="signature-page-container">
        <div className="signature-ambient-glow" aria-hidden="true" />
        <div className="signature-grid-bg" aria-hidden="true" />

        <div className="signature-inner max-w-[800px]">
          {/* Header */}
          <div className="signature-header signature-header-center">
            <div className="signature-badge">
              <span className="signature-bracket">[</span>
              <span>04 // EVALUATION VERIFIED</span>
              <span className="signature-bracket">]</span>
            </div>
            <h1 className="signature-title">Diagnostic Benchmark Report</h1>
            <p className="signature-subtitle text-center">
              Your software engineering aptitude has been calibrated across core algorithmic thinking, data structures, and architecture.
            </p>
          </div>

          {/* Report Card */}
          <div className="signature-card flex flex-col items-center text-center gap-6 py-10 px-6 md:px-12">
            <div className="signature-card-top w-full">
              <span className="signature-card-tag">
                <span className="signature-bracket">[</span>
                <span>CALIBRATION PROFILE // RESULT</span>
                <span className="signature-bracket">]</span>
              </span>
              <span className="signature-pill">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                VERIFIED
              </span>
            </div>

            {/* Score Metric Box */}
            <div className="flex flex-col items-center gap-2">
              <span className="signature-metric-label">DIAGNOSTIC APTITUDE SCORE</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-bold font-mono text-white tracking-tight">
                  {result.score}
                </span>
                <span className="text-xl md:text-2xl font-mono text-zinc-500">
                  / {result.totalQuestions}
                </span>
              </div>
            </div>

            {/* Calibrated Level Badge */}
            <div className="flex flex-col items-center gap-2 mt-2">
              <span className="signature-metric-label">CALIBRATED STUDY LEVEL</span>
              <div className={`px-6 py-2 rounded-full font-mono text-sm md:text-base font-bold tracking-wider border ${
                isAdvanced 
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' 
                  : isIntermediate 
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                [ {result.level.toUpperCase()} LEVEL ]
              </div>
            </div>

            {/* Description Recommendation */}
            <p className="text-sm md:text-base text-zinc-300 max-w-xl leading-relaxed mt-2">
              {result.level === 'Beginner' &&
                'You possess a foundational understanding of web development and programming logic. We recommend starting with HTML/CSS and introductory scripting in the Frontend or Backend tracks.'}
              {result.level === 'Intermediate' &&
                'Excellent! You are comfortable with general programming logic, common data structures, and core software concepts. You are primed to dive into React architecture, SQL databases, or Machine Learning Math.'}
              {result.level === 'Advanced' &&
                'Incredible! You have a strong grasp of algorithmic complexity, advanced system architectures, and neural network foundations. We suggest exploring LLMs, next-generation web servers, and distributed systems.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 w-full pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => setCurrentPage('roadmaps')}
                className="signature-btn-primary"
              >
                <span>Explore Calibrated Roadmaps</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={resetQuiz}
                className="signature-btn-secondary"
              >
                <RotateCcw size={15} />
                <span>Retake Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <div className="signature-page-container">
      <div className="signature-ambient-glow" aria-hidden="true" />
      <div className="signature-grid-bg" aria-hidden="true" />

      <div className="signature-inner max-w-[820px]">
        {/* Page Header */}
        <div className="signature-header">
          <div className="signature-badge">
            <span className="signature-bracket">[</span>
            <span>04 // SKILL EVALUATION</span>
            <span className="signature-bracket">]</span>
          </div>
          <h1 className="signature-title">Technical Skill Calibration</h1>
          <p className="signature-subtitle">
            Timed adaptive challenges to assess computer science foundations, syntax comprehension, and architecture problem solving.
          </p>
        </div>

        {/* Progress HUD Bar */}
        <div className="signature-card p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-200">
                [ QUESTION {currentIdx + 1 < 10 ? `0${currentIdx + 1}` : currentIdx + 1} / {questions.length < 10 ? `0${questions.length}` : questions.length} ]
              </span>
            </div>
            <span className="text-blue-400 font-semibold">{progressPercent}% COMPLETE</span>
          </div>

          <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Bento Card */}
        <div className="signature-card flex flex-col gap-6">
          <div className="signature-card-top">
            <span className="signature-card-tag">
              <span className="signature-bracket">[</span>
              <span>QUESTION {currentIdx + 1} SPECIFICATION</span>
              <span className="signature-bracket">]</span>
            </span>
            <span className="signature-pill">
              MULTIPLE CHOICE
            </span>
          </div>

          {/* Question Text */}
          <div className="flex items-start gap-3.5">
            <HelpCircle size={22} className="text-blue-400 shrink-0 mt-0.5" />
            <h2 className="text-lg md:text-xl font-semibold text-zinc-100 leading-snug">
              {currentQuestion?.question}
            </h2>
          </div>

          {/* Options List */}
          <div className="flex flex-col gap-3">
            {currentQuestion?.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
              const letter = optionLetters[idx] || `${idx + 1}`;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQuestion.id, idx)}
                  type="button"
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)] text-white'
                      : 'bg-white/[0.015] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.03] text-zinc-300'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-400'
                      : 'bg-white/[0.04] text-zinc-400 border-white/[0.08]'
                  }`}>
                    {letter}
                  </span>
                  <span className="text-sm md:text-base font-normal flex-1">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] mt-2">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="signature-btn-secondary"
            >
              Back
            </button>

            {currentIdx === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < questions.length || submitting}
                className="signature-btn-primary"
              >
                <span>{submitting ? 'Calibrating...' : 'Submit Answers'}</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion?.id] === undefined}
                className="signature-btn-primary"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
