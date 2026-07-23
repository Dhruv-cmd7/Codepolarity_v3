const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Hardcoded templates for practice
const templates = [
  {
    id: 'template-html',
    title: 'Landing Page Hero Section',
    language: 'html',
    description: 'Build a premium, glassmorphic hero page structure with centered text and glowing buttons.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      background: #080914;
      color: #ffffff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      overflow: hidden;
    }
    
    .hero-card {
      background: rgba(15, 17, 38, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 3rem;
      border-radius: 16px;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 0 40px rgba(0, 242, 254, 0.15);
      animation: float 4s ease-in-out infinite;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      color: #a0aec0;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .cta-btn {
      background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
      color: #080914;
      border: none;
      padding: 0.8rem 2rem;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.4);
      transition: all 0.3s ease;
    }

    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 25px rgba(0, 242, 254, 0.7);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  </style>
</head>
<body>
  <div class="hero-card">
    <h1>Antigravity Space</h1>
    <p>Welcome to the next-generation learning workspace. Build, compile, and visualizer your frontend projects live in real time.</p>
    <button class="cta-btn" onclick="alert('Liftoff initialized!')">Initialize Liftoff</button>
  </div>
</body>
</html>`
  },
  {
    id: 'template-revstring',
    title: 'Reverse a String (JavaScript)',
    language: 'javascript',
    description: 'Implement a function to reverse a string. Validate it using the console below.',
    code: `// Write an algorithm to reverse the input string
function reverseString(str) {
  // Your code here
  return str.split('').reverse().join('');
}

// Test cases
console.log("Input: 'hello' -> Output:", reverseString('hello'));
console.log("Input: 'antigravity' -> Output:", reverseString('antigravity'));
console.log("Input: 'algorithm' -> Output:", reverseString('algorithm'));
`
  },
  {
    id: 'template-fibonacci',
    title: 'Fibonacci Sequence Generator',
    language: 'javascript',
    description: 'Generate the first N numbers of the Fibonacci sequence starting with 0 and 1.',
    code: `// Write a function to return an array of the first n Fibonacci numbers
function fibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  
  const seq = [0, 1];
  while (seq.length < n) {
    seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  }
  return seq;
}

// Test cases
console.log("Fibonacci(5) ->", fibonacci(5)); // Should output: [0, 1, 1, 2, 3]
console.log("Fibonacci(10) ->", fibonacci(10));
`
  },
  {
    id: 'template-bubblesort',
    title: 'Bubble Sort Algorithm',
    language: 'javascript',
    description: 'Implement bubble sort to sort an array of numbers in ascending order.',
    code: `// Implement bubble sort
function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

// Test cases
const unsorted = [64, 34, 25, 12, 22, 11, 90];
console.log("Unsorted Array:", unsorted);
console.log("Sorted Array:  ", bubbleSort([...unsorted]));
`
  }
];

// @route    GET api/editor/templates
// @desc     Get practice templates
// @access   Private
router.get('/templates', auth, (req, res) => {
  res.json(templates);
});

// @route    GET api/editor/snippets
// @desc     Get all saved user snippets
// @access   Private
router.get('/snippets', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user.savedCodeSnippets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/editor/save
// @desc     Save or update a code snippet
// @access   Private
router.post('/save', auth, async (req, res) => {
  const { title, code, language, snippetId } = req.body;

  if (!title || !code || !language) {
    return res.status(400).json({ msg: 'Please provide title, code, and language' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (snippetId) {
      // Update existing snippet
      const snippet = user.savedCodeSnippets.id(snippetId);
      if (snippet) {
        snippet.title = title;
        snippet.code = code;
        snippet.language = language;
        snippet.updatedAt = Date.now();
      } else {
        // Create new one if ID not found
        user.savedCodeSnippets.push({ title, code, language });
      }
    } else {
      // Create new snippet
      user.savedCodeSnippets.push({ title, code, language });
    }

    await user.save();
    res.json(user.savedCodeSnippets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    DELETE api/editor/snippets/:id
// @desc     Delete a saved snippet
// @access   Private
router.delete('/snippets/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.savedCodeSnippets.pull({ _id: req.params.id });
    await user.save();

    res.json(user.savedCodeSnippets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
