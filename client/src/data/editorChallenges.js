export const defaultChallenges = [
  {
    id: 'challenge-twosum',
    title: 'Two Sum Problem',
    category: 'algorithms',
    difficulty: 'Easy',
    language: 'javascript',
    tags: ['Hash Map', 'Arrays', 'Google Favorite'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] == 2 + 4 == 6.' },
      { input: 'nums = [3, 3], target = 6', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 3 + 3 == 6.' }
    ],
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test Run:
console.log("Result:", twoSum([2, 7, 11, 15], 9));
`,
    tests: [
      { name: 'Standard Case', run: 'twoSum([2, 7, 11, 15], 9)', expected: [0, 1] },
      { name: 'Non-consecutive indices', run: 'twoSum([3, 2, 4], 6)', expected: [1, 2] },
      { name: 'Duplicate values', run: 'twoSum([3, 3], 6)', expected: [0, 1] },
      { name: 'Negative numbers', run: 'twoSum([-1, -2, -3, -4, -5], -8)', expected: [2, 4] }
    ]
  },
  {
    id: 'challenge-palindrome',
    title: 'Valid Palindrome Checker',
    category: 'algorithms',
    difficulty: 'Easy',
    language: 'javascript',
    tags: ['Strings', 'Two Pointers'],
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  // Normalize string: remove non-alphanumeric & lowercase
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}

// Test Run:
console.log("Is Palindrome?", isPalindrome("A man, a plan, a canal: Panama"));
console.log("Is Palindrome?", isPalindrome("race a car"));
`,
    tests: [
      { name: 'Standard Palindrome', run: 'isPalindrome("A man, a plan, a canal: Panama")', expected: true },
      { name: 'Not a Palindrome', run: 'isPalindrome("race a car")', expected: false },
      { name: 'Empty / whitespace', run: 'isPalindrome("   ")', expected: true },
      { name: 'Single character', run: 'isPalindrome("a.")', expected: true }
    ]
  },
  {
    id: 'challenge-revstring',
    title: 'Reverse String Algorithm',
    category: 'algorithms',
    difficulty: 'Easy',
    language: 'javascript',
    tags: ['Strings', 'Recursion', 'Basics'],
    description: `Write a function that reverses an input string. Provide an efficient implementation without relying on external libraries.`,
    examples: [
      { input: 'str = "hello"', output: '"olleh"' },
      { input: 'str = "Codepolarity"', output: '"ytiralepodoC"' }
    ],
    starterCode: `function reverseString(str) {
  // Implement your algorithm
  return str.split('').reverse().join('');
}

console.log("Reversed:", reverseString('hello'));
console.log("Reversed:", reverseString('Codepolarity'));
`,
    tests: [
      { name: 'Simple word', run: 'reverseString("hello")', expected: 'olleh' },
      { name: 'Brand word', run: 'reverseString("Codepolarity")', expected: 'ytiralepodoC' },
      { name: 'Sentence with spaces', run: 'reverseString("code fast")', expected: 'tsaf edoc' }
    ]
  },
  {
    id: 'challenge-fibonacci',
    title: 'Fibonacci Sequence Generator',
    category: 'algorithms',
    difficulty: 'Medium',
    language: 'javascript',
    tags: ['Dynamic Programming', 'Math'],
    description: `The Fibonacci numbers form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1. Write a function that returns an array of the first \`n\` Fibonacci numbers.`,
    examples: [
      { input: 'n = 5', output: '[0, 1, 1, 2, 3]' },
      { input: 'n = 8', output: '[0, 1, 1, 2, 3, 5, 8, 13]' }
    ],
    starterCode: `function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  
  const seq = [0, 1];
  while (seq.length < n) {
    seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  }
  return seq;
}

console.log("Fibonacci(5):", fibonacci(5));
console.log("Fibonacci(8):", fibonacci(8));
`,
    tests: [
      { name: 'Zero length', run: 'fibonacci(0)', expected: [] },
      { name: 'Single item', run: 'fibonacci(1)', expected: [0] },
      { name: '5 terms', run: 'fibonacci(5)', expected: [0, 1, 1, 2, 3] },
      { name: '8 terms', run: 'fibonacci(8)', expected: [0, 1, 1, 2, 3, 5, 8, 13] }
    ]
  },
  {
    id: 'challenge-debounce',
    title: 'Debounce Function',
    category: 'utilities',
    difficulty: 'Medium',
    language: 'javascript',
    tags: ['Higher-Order Functions', 'Async', 'Front-End System Design'],
    description: `Create a \`debounce(fn, delay)\` function. When called repeatedly, the debounced function delays invoking \`fn\` until after \`delay\` milliseconds have elapsed since the last time it was invoked.`,
    examples: [
      { input: 'delay = 100ms', output: 'Executes once after 100ms silence' }
    ],
    starterCode: `function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Verification demo:
let count = 0;
const increment = debounce(() => {
  count++;
  console.log("Debounced Execution! Count is:", count);
}, 200);

increment();
increment();
increment(); // Only this final call fires after 200ms
console.log("Dispatched 3 rapid calls. Waiting for debounce delay...");
`,
    tests: [
      { name: 'Debounce returns function', run: 'typeof debounce(() => {}, 100)', expected: 'function' }
    ]
  },
  {
    id: 'challenge-bubblesort',
    title: 'Bubble Sort Algorithm',
    category: 'algorithms',
    difficulty: 'Easy',
    language: 'javascript',
    tags: ['Sorting', 'Arrays'],
    description: `Implement the bubble sort algorithm to sort an array of numbers in ascending numerical order.`,
    examples: [
      { input: '[64, 34, 25, 12, 22, 11, 90]', output: '[11, 12, 22, 25, 34, 64, 90]' }
    ],
    starterCode: `function bubbleSort(arr) {
  const list = [...arr];
  const n = list.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (list[j] > list[j + 1]) {
        [list[j], list[j + 1]] = [list[j + 1], list[j]];
      }
    }
  }
  return list;
}

const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Unsorted:", numbers);
console.log("Sorted:  ", bubbleSort(numbers));
`,
    tests: [
      { name: 'Random array', run: 'bubbleSort([5, 2, 9, 1, 5, 6])', expected: [1, 2, 5, 5, 6, 9] },
      { name: 'Already sorted', run: 'bubbleSort([1, 2, 3])', expected: [1, 2, 3] },
      { name: 'Empty array', run: 'bubbleSort([])', expected: [] }
    ]
  },
  {
    id: 'template-html-hero',
    title: 'Glassmorphic Hero Webpage',
    category: 'web',
    difficulty: 'Medium',
    language: 'html',
    tags: ['CSS Glassmorphism', 'Flexbox', 'Responsive'],
    description: `Interactive responsive modern hero section designed with cyber-dark aesthetics, backdrop-filter blur, radiant gradient glow, and interactive micro-interactions.`,
    examples: [],
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Codepolarity Hero Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 20%, #151a33 0%, #070913 80%);
      color: #f8fafc;
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow-x: hidden;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(0, 242, 254, 0.08);
      border: 1px solid rgba(0, 242, 254, 0.25);
      color: #00f2fe;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 20px;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00f2fe;
      box-shadow: 0 0 10px #00f2fe;
      animation: pulse 2s infinite;
    }

    .card {
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 48px 36px;
      max-width: 580px;
      text-align: center;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.12);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.9), 0 0 60px rgba(0, 242, 254, 0.22);
    }

    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #ffffff 30%, #00f2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      color: #94a3b8;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    .button-group {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 26px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
      color: #070913;
      border: none;
      box-shadow: 0 4px 20px rgba(0, 242, 254, 0.35);
    }

    .btn-primary:hover {
      transform: scale(1.03);
      box-shadow: 0 6px 26px rgba(0, 242, 254, 0.55);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .counter-display {
      margin-top: 24px;
      font-family: monospace;
      font-size: 0.85rem;
      color: #38bdf8;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="pulse-dot"></span>
      Codepolarity Cloud v3.0
    </div>
    <h1>Build Future-Ready Web Apps</h1>
    <p>Real-time client sandbox environment with instant compilation, zero-latency feedback, and modern web APIs.</p>
    <div class="button-group">
      <button class="btn btn-primary" onclick="launchRocket()">🚀 Launch Engine</button>
      <button class="btn btn-secondary" onclick="logMetrics()">📊 Output Metrics</button>
    </div>
    <div id="output" class="counter-display">Clicks: 0 | Engine: Idle</div>
  </div>

  <script>
    let clicks = 0;
    function launchRocket() {
      clicks++;
      const out = document.getElementById('output');
      out.innerText = 'Clicks: ' + clicks + ' | Engine: 🔥 Accelerated!';
      console.log('Engine fired! Total clicks:', clicks, 'Timestamp:', new Date().toLocaleTimeString());
    }

    function logMetrics() {
      console.log('System Status: 100% Healthy');
      console.warn('Memory Allocation: 42.8 MB / 512 MB');
      console.info('Client Latency: 0.4ms');
    }
  </script>
</body>
</html>
`,
    tests: []
  },
  {
    id: 'template-canvas-particles',
    title: 'Cyber Interactive Canvas Particles',
    category: 'web',
    difficulty: 'Hard',
    language: 'html',
    tags: ['HTML5 Canvas', 'Physics', 'Interactive'],
    description: `HTML5 Canvas interactive particle constellation system with mouse interaction, physics springs, and neon connecting lines.`,
    examples: [],
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background: #060813;
      font-family: monospace;
    }
    canvas { display: block; }
    .overlay {
      position: absolute;
      top: 16px;
      left: 16px;
      color: #00f2fe;
      background: rgba(6, 8, 19, 0.7);
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid rgba(0, 242, 254, 0.2);
      pointer-events: none;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="overlay">Move your mouse across the canvas ✨</div>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const mouse = { x: width / 2, y: height / 2, radius: 120 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const particles = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1.5
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse connection
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        if (distMouse < mouse.radius) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(0, 242, 254, ' + (1 - distMouse / mouse.radius) + ')';
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Particle connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(139, 92, 246, ' + (0.35 * (1 - dist / 100)) + ')';
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      requestAnimationFrame(animate);
    }
    animate();
    console.log("Canvas particles simulation initialized! (" + count + " nodes)");
  </script>
</body>
</html>
`,
    tests: []
  }
];

export const editorThemes = [
  { id: 'vs-dark', name: 'VS Dark Modern', bg: '#1e1e1e', type: 'dark' },
  { id: 'dracula', name: 'Dracula Purple', bg: '#282a36', type: 'dark' },
  { id: 'tokyo-night', name: 'Tokyo Night Cyber', bg: '#1a1b26', type: 'dark' },
  { id: 'one-dark', name: 'One Dark Pro', bg: '#21252b', type: 'dark' },
  { id: 'light', name: 'Light Modern', bg: '#ffffff', type: 'light' },
];

export const supportedLanguages = [
  { id: 'javascript', name: 'JavaScript', monacoLang: 'javascript', ext: 'js', badge: 'JS', color: '#f7df1e' },
  { id: 'typescript', name: 'TypeScript', monacoLang: 'typescript', ext: 'ts', badge: 'TS', color: '#3178c6' },
  { id: 'html', name: 'HTML / CSS / JS', monacoLang: 'html', ext: 'html', badge: 'WEB', color: '#e34f26' },
  { id: 'css', name: 'CSS Stylesheet', monacoLang: 'css', ext: 'css', badge: 'CSS', color: '#1572b6' },
  { id: 'json', name: 'JSON Data', monacoLang: 'json', ext: 'json', badge: 'JSON', color: '#00f2fe' },
  { id: 'python', name: 'Python (Pyodide/Script)', monacoLang: 'python', ext: 'py', badge: 'PY', color: '#3572a5' },
  { id: 'sql', name: 'SQL Query', monacoLang: 'sql', ext: 'sql', badge: 'SQL', color: '#e38c00' },
];
