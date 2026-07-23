const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roadmapsData = require('../data/roadmapsData');
const User = require('../models/User');

// @route    GET api/roadmaps
// @desc     Get all roadmaps
// @access   Private
router.get('/', auth, (req, res) => {
  res.json(roadmapsData);
});

// @route    GET api/roadmaps/:id
// @desc     Get roadmap by ID
// @access   Private
router.get('/:id', auth, (req, res) => {
  const roadmap = roadmapsData[req.params.id];
  if (!roadmap) {
    return res.status(404).json({ msg: 'Roadmap not found' });
  }
  res.json(roadmap);
});

// @route    POST api/roadmaps/select
// @desc     Select an active career roadmap
// @access   Private
router.post('/select', auth, async (req, res) => {
  const { roadmapId } = req.body;

  if (!roadmapId || !roadmapsData[roadmapId]) {
    return res.status(400).json({ msg: 'Invalid Roadmap ID' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.activeRoadmap = roadmapId;
    await user.save();

    res.json({ activeRoadmap: user.activeRoadmap });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/roadmaps/complete-node
// @desc     Toggle completion of a roadmap node
// @access   Private
router.post('/complete-node', auth, async (req, res) => {
  const { nodeId } = req.body;

  if (!nodeId) {
    return res.status(400).json({ msg: 'Node ID is required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const index = user.completedNodes.indexOf(nodeId);
    if (index > -1) {
      // Node is already completed, toggle it off (remove it)
      user.completedNodes.splice(index, 1);
    } else {
      // Node is not completed, toggle it on (add it)
      user.completedNodes.push(nodeId);
    }

    await user.save();
    res.json({ completedNodes: user.completedNodes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/roadmaps/progress
// @desc     Get progress percentages for all roadmaps
// @access   Private
router.get('/progress/summary', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const summary = {};
    Object.keys(roadmapsData).forEach(key => {
      const roadmap = roadmapsData[key];
      const totalNodes = roadmap.nodes.length;
      const completedCount = roadmap.nodes.filter(node => 
        user.completedNodes.includes(node.id)
      ).length;

      summary[key] = {
        title: roadmap.title,
        total: totalNodes,
        completed: completedCount,
        percent: totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0
      };
    });

    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
