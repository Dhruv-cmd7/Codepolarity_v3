const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Hardcoded assessment questions
const questions = [
  {
    id: 1,
    question: "What is the output of 'typeof NaN' in JavaScript?",
    options: ["'number'", "'NaN'", "'undefined'", "'object'"],
    correctAnswer: 0 // 'number'
  },
  {
    id: 2,
    question: "Which of the following is NOT a primitive data type in JavaScript?",
    options: ["String", "Number", "Boolean", "Object"],
    correctAnswer: 3 // Object
  },
  {
    id: 3,
    question: "In CSS, what is the correct property to adjust space inside a border?",
    options: ["margin", "padding", "border-spacing", "indent"],
    correctAnswer: 1 // padding
  },
  {
    id: 4,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyperlink Text Management Language",
      "Home Tool Markup Language"
    ],
    correctAnswer: 0
  },
  {
    id: 5,
    question: "What is the time complexity of searching in a balanced Binary Search Tree (BST) in the worst case?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 2 // O(log n)
  },
  {
    id: 6,
    question: "Which data structure operates on a Last-In, First-Out (LIFO) basis?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: 1 // Stack
  },
  {
    id: 7,
    question: "In Machine Learning, what is 'Supervised Learning'?",
    options: [
      "Training a model without any labeled training data",
      "Training a model where input data is paired with correct labels",
      "Learning by playing a game and receiving rewards",
      "Monitoring the AI's predictions manually during production"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "What is the primary purpose of an Activation Function in a neural network?",
    options: [
      "To normalize the inputs of the network",
      "To introduce non-linearity into the network",
      "To calculate the gradient of the loss function",
      "To speed up database retrieval times"
    ],
    correctAnswer: 1 // To introduce non-linearity
  },
  {
    id: 9,
    question: "What does REST stand for in web API design?",
    options: [
      "Representational State Transfer",
      "Responsive System Terminal",
      "Remote Entry Standard Transfer",
      "Retrieved Energy State Transition"
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    question: "Which SQL command is used to retrieve data from a database table?",
    options: ["GET", "SELECT", "RETRIEVE", "OPEN"],
    correctAnswer: 1 // SELECT
  }
];

// @route    GET api/assessment/questions
// @desc     Get all assessment questions
// @access   Private (or Public)
router.get('/questions', auth, (req, res) => {
  // Strip correct answer for the client
  const clientQuestions = questions.map(({ id, question, options }) => ({
    id,
    question,
    options
  }));
  res.json(clientQuestions);
});

// @route    POST api/assessment/submit
// @desc     Submit assessment answers and calculate study level
// @access   Private
router.post('/submit', auth, async (req, res) => {
  const { answers } = req.body; // Map of questionId -> selectedOptionIndex (e.g., { 1: 0, 2: 3 })

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ msg: 'Please provide answers mapping.' });
  }

  try {
    let score = 0;
    
    // Grade the answers
    questions.forEach(q => {
      if (answers[q.id] !== undefined && answers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    // Determine level
    let level = 'Beginner';
    if (score >= 8) {
      level = 'Advanced';
    } else if (score >= 5) {
      level = 'Intermediate';
    }

    // Save user profile level
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.completedQuiz = true;
    user.quizScore = score;
    user.studyLevel = level;
    await user.save();

    res.json({
      score,
      totalQuestions: questions.length,
      level,
      user: {
        id: user.id,
        username: user.username,
        completedQuiz: user.completedQuiz,
        quizScore: user.quizScore,
        studyLevel: user.studyLevel
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
