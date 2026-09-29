export const defineCustomMonacoThemes = (monaco) => {
  // Codepolarity Minimal Studio Theme - Clean, restrained, high-clarity
  monaco.editor.defineTheme('codepolarity-minimal', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { background: '0c0d12', token: '' },
      { token: 'comment', foreground: '52525b', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c084fc' },
      { token: 'identifier', foreground: 'e4e4e7' },
      { token: 'string', foreground: '86efac' },
      { token: 'number', foreground: 'fde047' },
      { token: 'type', foreground: '93c5fd' },
      { token: 'function', foreground: '38bdf8' },
      { token: 'delimiter', foreground: '71717a' },
      { token: 'operator', foreground: 'a1a1aa' },
      { token: 'tag', foreground: 'f472b6' },
      { token: 'attribute.name', foreground: '93c5fd' },
      { token: 'attribute.value', foreground: '86efac' },
    ],
    colors: {
      'editor.background': '#0c0d12',
      'editor.foreground': '#e4e4e7',
      'editor.lineHighlightBackground': '#14161f',
      'editor.selectionBackground': '#27272a88',
      'editor.inactiveSelectionBackground': '#27272a44',
      'editorCursor.foreground': '#ffffff',
      'editorLineNumber.foreground': '#3f3f46',
      'editorLineNumber.activeForeground': '#a1a1aa',
      'editorIndentGuide.background': '#1e2029',
      'editorIndentGuide.activeBackground': '#3f3f46',
      'editorWhitespace.foreground': '#27272a',
      'editorWidget.background': '#12141c',
      'editorWidget.border': '#27272a',
      'editorSuggestWidget.background': '#12141c',
      'editorSuggestWidget.border': '#27272a',
      'editorSuggestWidget.selectedBackground': '#1f222e',
      'minimap.background': '#0c0d12',
    }
  });

  // Codepolarity Clean Light Theme
  monaco.editor.defineTheme('codepolarity-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { background: 'ffffff', token: '' },
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'keyword', foreground: '9333ea' },
      { token: 'identifier', foreground: '0f172a' },
      { token: 'string', foreground: '16a34a' },
      { token: 'number', foreground: 'd97706' },
      { token: 'type', foreground: '2563eb' },
      { token: 'function', foreground: '0284c7' },
      { token: 'delimiter', foreground: '64748b' },
      { token: 'operator', foreground: '475569' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#0f172a',
      'editor.lineHighlightBackground': '#f1f5f9',
      'editor.selectionBackground': '#e2e8f0',
      'editorCursor.foreground': '#0f172a',
      'editorLineNumber.foreground': '#94a3b8',
      'editorLineNumber.activeForeground': '#0f172a',
      'editorIndentGuide.background': '#e2e8f0',
      'editorIndentGuide.activeBackground': '#cbd5e1',
      'minimap.background': '#ffffff',
    }
  });

  // Tokyo Night Theme
  monaco.editor.defineTheme('tokyo-night', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { background: '16161e', token: '' },
      { token: 'comment', foreground: '565f89', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'bb9af7' },
      { token: 'string', foreground: '9ece6a' },
      { token: 'number', foreground: 'ff9e64' },
      { token: 'function', foreground: '7aa2f7' },
      { token: 'type', foreground: '2ac3de' },
    ],
    colors: {
      'editor.background': '#16161e',
      'editor.foreground': '#c0caf5',
      'editor.lineHighlightBackground': '#1f2335',
      'editor.selectionBackground': '#33467c',
      'editorCursor.foreground': '#c0caf5',
      'editorLineNumber.foreground': '#3b4261',
      'editorLineNumber.activeForeground': '#7aa2f7',
    }
  });

  // Dracula Theme
  monaco.editor.defineTheme('dracula', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { background: '191a21', token: '' },
      { token: 'comment', foreground: '6272a4' },
      { token: 'keyword', foreground: 'ff79c6' },
      { token: 'string', foreground: 'f1fa8c' },
      { token: 'number', foreground: 'bd93f9' },
      { token: 'function', foreground: '50fa7b' },
      { token: 'type', foreground: '8be9fd' },
    ],
    colors: {
      'editor.background': '#191a21',
      'editor.foreground': '#f8f8f2',
      'editor.lineHighlightBackground': '#21222c',
      'editor.selectionBackground': '#44475a',
      'editorCursor.foreground': '#f8f8f2',
      'editorLineNumber.foreground': '#6272a4',
      'editorLineNumber.activeForeground': '#f1fa8c',
    }
  });
};
