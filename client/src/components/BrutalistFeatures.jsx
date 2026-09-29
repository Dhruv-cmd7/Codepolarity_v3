import React from 'react';
import { Route, Terminal, Keyboard, CheckCircle2, ArrowUpRight } from 'lucide-react';

/**
 * BrutalistFeatures
 * Minimal, clean Swiss architectural layout with simple plain-language copy and prominent action buttons.
 */
export default function BrutalistFeatures({ setCurrentPage, onOpenAuth, user }) {
  const handleCardClick = (pageId) => {
    if (setCurrentPage && pageId) {
      setCurrentPage(pageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const features = [
    {
      id: 'roadmaps',
      num: '01',
      tag: 'LEARNING PATHS',
      title: 'Developer Roadmaps',
      desc: 'Step-by-step guides covering web development, computer science, and system design.',
      pills: ['Frontend', 'Backend', 'System Design'],
      btnText: 'Explore Roadmaps',
      icon: Route,
    },
    {
      id: 'editor',
      num: '02',
      tag: 'CLOUD RUNTIME',
      title: 'Online IDE',
      desc: 'Write, run, and test code in 20+ languages directly in your browser with zero setup.',
      pills: ['Python', 'JavaScript', 'C++ / Java'],
      btnText: 'Launch Editor',
      icon: Terminal,
    },
    {
      id: 'typlab',
      num: '03',
      tag: 'SPEED DRILLS',
      title: 'Typlab',
      desc: 'Practice typing real code syntax to build muscle memory, speed, and accuracy.',
      pills: ['Speed Drills', 'Live Telemetry', 'Real Syntax'],
      btnText: 'Start Typing',
      icon: Keyboard,
    },
    {
      id: 'assessment',
      num: '04',
      tag: 'SKILL EVALUATION',
      title: 'Skill Assessments',
      desc: 'Test your problem-solving skills with timed coding challenges and automated scoring.',
      pills: ['Algorithms', 'Timed Challenges', 'Score Report'],
      btnText: 'Take Assessment',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="features" aria-labelledby="features-title" className="brutalist-features-section">
      <div className="brutalist-features-container">
        {/* Section Header */}
        <div className="brutalist-features-header">
          <div className="brutalist-features-badge" aria-hidden="true">
            <span className="brutalist-bracket">[</span>
            <span>01 // CAPABILITIES</span>
            <span className="brutalist-bracket">]</span>
          </div>

          <h2 id="features-title" className="brutalist-features-title">
            Engineered for Mastery.
          </h2>

          <p className="brutalist-features-subtitle">
            Four focused tools to help you learn faster, practice code, and track real progress.
          </p>
        </div>

        {/* 2x2 Minimal Clean Grid */}
        <div className="brutalist-grid" role="list">
          {features.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                id={`bento-card-${item.id}`}
                role="article"
                aria-labelledby={`card-${item.num}-title`}
                tabIndex={0}
                className="brutalist-card"
                onClick={() => handleCardClick(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(item.id);
                  }
                }}
              >
                {/* Top Metadata: Index + Category Tag + Icon */}
                <div className="brutalist-card-top">
                  <div className="brutalist-card-id">
                    <span className="brutalist-num">[ {item.num} ]</span>
                    <span className="brutalist-tag">{item.tag}</span>
                  </div>
                  <div className="brutalist-card-icon-wrap" aria-hidden="true">
                    <IconComponent size={20} className="brutalist-card-icon" />
                  </div>
                </div>

                {/* Card Body: Simple Words */}
                <div className="brutalist-card-body">
                  <h3 id={`card-${item.num}-title`} className="brutalist-card-title">
                    {item.title}
                  </h3>
                  <p className="brutalist-card-desc">
                    {item.desc}
                  </p>
                </div>

                {/* Minimalist Feature Pills */}
                <div className="brutalist-card-pills" aria-hidden="true">
                  {item.pills.map((pill) => (
                    <span key={pill} className="brutalist-pill">
                      <span className="brutalist-pill-bracket">[</span> {pill} <span className="brutalist-pill-bracket">]</span>
                    </span>
                  ))}
                </div>

                {/* Simple & Clean Action Button */}
                <div className="brutalist-card-footer">
                  <button
                    type="button"
                    className="brutalist-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(item.id);
                    }}
                    aria-label={item.btnText}
                  >
                    <span>{item.btnText}</span>
                    <ArrowUpRight size={16} className="brutalist-btn-arrow" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
