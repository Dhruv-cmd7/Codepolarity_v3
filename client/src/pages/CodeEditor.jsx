import React, { useState, useEffect, useRef } from 'react';
import { Play, Save, Code, Terminal, Eye, FileCode, Check, Trash2, List } from 'lucide-react';

const CodeEditor = ({ token, user, initialTemplateId, onClearTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [activeSnippetId, setActiveSnippetId] = useState('');
  
  // Editor State
  const [code, setCode] = useState('// Select a template or write code here...');
  const [language, setLanguage] = useState('javascript');
  const [title, setTitle] = useState('Untitled Snippet');
  
  // Running/Result State
  const [outputTab, setOutputTab] = useState('console'); // 'console' or 'preview'
  const [consoleLogs, setConsoleLogs] = useState(['Console initialized. Click "Run Code" to execute.']);
  const [iframeDoc, setIframeDoc] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', ''
  
  const editorRef = useRef(null);

  useEffect(() => {
    fetchTemplates();
    fetchSavedSnippets();
  }, [token]);

  useEffect(() => {
    // If a template was requested by the Roadmap Explorer
    if (initialTemplateId && templates.length > 0) {
      const selected = templates.find(t => t.id === initialTemplateId);
      if (selected) {
        loadTemplate(selected);
      }
      onClearTemplate(); // Reset global flag
    }
  }, [initialTemplateId, templates]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/editor/templates', {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (res.ok) {
        setTemplates(data);
        // Load first template as default if code is empty
        if (data.length > 0 && code.startsWith('//')) {
          loadTemplate(data[1]); // Default to JS template first
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSavedSnippets = async () => {
    try {
      const res = await fetch('/api/editor/snippets', {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (res.ok) {
        setSavedSnippets(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadTemplate = (template) => {
    setCode(template.code);
    setLanguage(template.language);
    setTitle(template.title);
    setActiveSnippetId('');
    if (template.language === 'html') {
      setOutputTab('preview');
      setIframeDoc(template.code);
    } else {
      setOutputTab('console');
      setConsoleLogs([`Loaded template: ${template.title}. Click "Run Code" to test.`]);
    }
  };

  const loadSnippet = (snippet) => {
    setCode(snippet.code);
    setLanguage(snippet.language);
    setTitle(snippet.title);
    setActiveSnippetId(snippet._id);
    if (snippet.language === 'html') {
      setOutputTab('preview');
      setIframeDoc(snippet.code);
    } else {
      setOutputTab('console');
      setConsoleLogs([`Loaded snippet: ${snippet.title}.`]);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    
    if (language === 'html') {
      setOutputTab('preview');
      setIframeDoc(code);
      setIsRunning(false);
    } else {
      setOutputTab('console');
      const logs = [];
      const customConsole = {
        log: (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        },
        error: (...args) => {
          logs.push('🔴 ERROR: ' + args.join(' '));
        },
        warn: (...args) => {
          logs.push('🟡 WARNING: ' + args.join(' '));
        }
      };

      try {
        // Execute JS in controlled Function environment
        const runFn = new Function('console', code);
        runFn(customConsole);
        if (logs.length === 0) {
          logs.push('Code executed successfully. No console output generated.');
        }
      } catch (err) {
        logs.push('🔴 RUNTIME ERROR: ' + err.message);
      }
      
      setConsoleLogs(logs);
      setIsRunning(false);
    }
  };

  const handleSaveCode = async () => {
    if (!title.trim()) {
      alert('Please enter a title for your snippet');
      return;
    }

    try {
      setSaveStatus('saving');
      const res = await fetch('/api/editor/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          title,
          code,
          language,
          snippetId: activeSnippetId || undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSavedSnippets(data);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } else {
        alert(data.msg || 'Save failed');
        setSaveStatus('');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('');
    }
  };

  const handleDeleteSnippet = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this snippet?')) return;
    try {
      const res = await fetch(`/api/editor/snippets/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (res.ok) {
        setSavedSnippets(data);
        if (activeSnippetId === id) {
          setCode('');
          setTitle('Untitled Snippet');
          setActiveSnippetId('');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Enable Tab indentation inside textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setCode(newValue);
      // reset cursor position
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div className="glow-orb glow-orb-cyan" style={{ top: '10%', right: '20%' }}></div>

      {/* Control Bar */}
      <div className="glass-panel" style={styles.controlBar}>
        <div style={styles.controlLeft}>
          <FileCode size={20} style={{ color: 'var(--accent-cyan)' }} />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.titleInput}
            placeholder="Name your file..."
          />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.langSelect}
          >
            <option value="javascript">JavaScript</option>
            <option value="html">HTML / CSS / JS</option>
          </select>
        </div>

        <div style={styles.controlRight}>
          <button onClick={handleRunCode} className="btn-primary" style={styles.actionBtn}>
            <Play size={14} style={{ marginRight: '6px', fill: 'currentColor' }} />
            Run Code
          </button>
          
          <button onClick={handleSaveCode} className="btn-secondary" style={styles.actionBtnSec}>
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? (
              <>
                <Check size={14} style={{ marginRight: '6px', color: 'var(--accent-success)' }} />
                Saved
              </>
            ) : (
              <>
                <Save size={14} style={{ marginRight: '6px' }} />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <div style={styles.editorWorkspace}>
        {/* Left Side: Code Templates & Saved Snippets List */}
        <div className="glass-panel" style={styles.sidebarPanel}>
          <div style={styles.sidebarSection}>
            <h4 style={styles.sidebarHeading}>
              <List size={14} style={{ marginRight: '6px', color: 'var(--accent-cyan)' }} />
              Practice Assignments
            </h4>
            <div style={styles.snippetList}>
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => loadTemplate(t)}
                  style={styles.snippetItem}
                >
                  <span style={styles.snippetName}>{t.title}</span>
                  <span style={{
                    ...styles.langBadge,
                    color: t.language === 'html' ? 'var(--accent-purple)' : 'var(--accent-cyan)'
                  }}>{t.language}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...styles.sidebarSection, borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
            <h4 style={styles.sidebarHeading}>
              <Save size={14} style={{ marginRight: '6px', color: 'var(--accent-purple)' }} />
              My Saved Code
            </h4>
            <div style={styles.snippetList}>
              {savedSnippets.length > 0 ? (
                savedSnippets.map(s => (
                  <div
                    key={s._id}
                    onClick={() => loadSnippet(s)}
                    style={{
                      ...styles.snippetItem,
                      border: activeSnippetId === s._id ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                      background: activeSnippetId === s._id ? 'rgba(0, 242, 254, 0.04)' : 'transparent',
                    }}
                  >
                    <span style={styles.snippetName}>{s.title}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        ...styles.langBadge,
                        color: s.language === 'html' ? 'var(--accent-purple)' : 'var(--accent-cyan)'
                      }}>{s.language}</span>
                      <button onClick={(e) => handleDeleteSnippet(s._id, e)} style={styles.deleteBtn} title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={styles.emptyMsg}>No saved snippets yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Center Panel: Editor Window */}
        <div className="glass-panel" style={styles.editorPanel}>
          <div style={styles.editorHeader}>
            <span style={styles.editorLabel}>EDITOR</span>
            <span style={styles.editorFile}>{language.toUpperCase()} ENGINE</span>
          </div>
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.textarea}
            placeholder="Write JavaScript algorithms or HTML layout here..."
            spellCheck="false"
          />
        </div>

        {/* Right Panel: Output and Sandbox Viewer */}
        <div className="glass-panel" style={styles.outputPanel}>
          <div style={styles.tabsHeader}>
            <button
              onClick={() => setOutputTab('console')}
              style={{
                ...styles.tabLink,
                color: outputTab === 'console' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                borderBottomColor: outputTab === 'console' ? 'var(--accent-cyan)' : 'transparent'
              }}
            >
              <Terminal size={14} style={{ marginRight: '6px' }} />
              Console Logs
            </button>
            {language === 'html' && (
              <button
                onClick={() => setOutputTab('preview')}
                style={{
                  ...styles.tabLink,
                  color: outputTab === 'preview' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  borderBottomColor: outputTab === 'preview' ? 'var(--accent-cyan)' : 'transparent'
                }}
              >
                <Eye size={14} style={{ marginRight: '6px' }} />
                Live Preview
              </button>
            )}
          </div>

          <div style={styles.outputContent}>
            {outputTab === 'console' ? (
              <div style={styles.terminalContainer}>
                {consoleLogs.map((log, idx) => (
                  <div key={idx} style={styles.terminalLine}>
                    {log}
                  </div>
                ))}
              </div>
            ) : (
              <iframe
                title="HTML Preview Sandbox"
                srcDoc={iframeDoc}
                style={styles.iframe}
                sandbox="allow-scripts"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1350px',
    margin: '2rem auto',
    padding: '0 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  controlBar: {
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '12px',
  },
  controlLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    flex: 1,
  },
  titleInput: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border-light)',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
    fontSize: '1.1rem',
    padding: '4px 8px',
    outline: 'none',
    width: '250px',
    transition: 'var(--transition-smooth)',
  },
  langSelect: {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-light)',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-sans)',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    outline: 'none',
    cursor: 'pointer',
  },
  controlRight: {
    display: 'flex',
    gap: '1rem',
  },
  actionBtn: {
    padding: '0.5rem 1.4rem',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
  },
  actionBtnSec: {
    padding: '0.5rem 1.4rem',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
  },
  editorWorkspace: {
    display: 'grid',
    gridTemplateColumns: '260px 1.3fr 1.2fr',
    gap: '1.5rem',
    height: '620px',
    alignItems: 'stretch',
  },
  sidebarPanel: {
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    overflowY: 'auto',
  },
  sidebarSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sidebarHeading: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
  },
  snippetList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  snippetItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.6rem 0.8rem',
    borderRadius: '8px',
    border: '1px solid transparent',
    background: 'rgba(255, 255, 255, 0.01)',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'var(--font-sans)',
    transition: 'var(--transition-fast)',
  },
  snippetName: {
    fontSize: '0.85rem',
    color: 'var(--text-main)',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '120px',
  },
  langBadge: {
    fontSize: '0.65rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '1px 5px',
    borderRadius: '4px',
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-dim)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    transition: 'var(--transition-fast)',
  },
  emptyMsg: {
    color: 'var(--text-dim)',
    fontSize: '0.8rem',
    fontStyle: 'italic',
    paddingLeft: '8px',
  },
  editorPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    overflow: 'hidden',
  },
  editorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.8rem 1.5rem',
    borderBottom: '1px solid var(--border-light)',
    background: 'rgba(7, 9, 21, 0.4)',
  },
  editorLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-dim)',
    letterSpacing: '1px',
  },
  editorFile: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)',
    letterSpacing: '1px',
  },
  textarea: {
    flex: 1,
    background: 'var(--bg-input)',
    color: 'var(--text-main)',
    border: 'none',
    padding: '1.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    resize: 'none',
    outline: 'none',
    whiteSpace: 'pre',
    overflow: 'auto',
  },
  outputPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    overflow: 'hidden',
  },
  tabsHeader: {
    display: 'flex',
    background: 'rgba(7, 9, 21, 0.4)',
    borderBottom: '1px solid var(--border-light)',
  },
  tabLink: {
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    padding: '0.8rem 1.2rem',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '2px solid transparent',
    fontFamily: 'var(--font-sans)',
    transition: 'var(--transition-fast)',
  },
  outputContent: {
    flex: 1,
    background: '#04050d',
    position: 'relative',
    overflow: 'auto',
  },
  terminalContainer: {
    padding: '1.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem',
    lineHeight: '1.6',
    color: '#00f5d4', // Green terminal code
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  terminalLine: {
    whiteSpace: 'pre-wrap',
    borderLeft: '2px solid rgba(0, 245, 212, 0.2)',
    paddingLeft: '10px',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    background: '#ffffff', // Render HTML inside pure white viewport
  }
};

export default CodeEditor;
