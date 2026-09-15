const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Username is taken' });
    }

    user = new User({
      username,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecretantigravitykey123!@#',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecretantigravitykey123!@#',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/auth/google
// @desc     Authenticate with Google ID Token
// @access   Public
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ msg: 'Google credential token is required' });
  }

  try {
    let email, name, picture, googleId;

    // Verify token using google-auth-library or Google tokeninfo endpoint
    let verified = false;
    try {
      const { OAuth2Client } = require('google-auth-library');
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      const client = new OAuth2Client(googleClientId);

      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId || undefined,
      });
      const payload = ticket.getPayload();
      googleId = payload['sub'];
      email = payload['email'];
      name = payload['name'];
      picture = payload['picture'];
      verified = true;
    } catch (libErr) {
      // Fallback: Query Google's tokeninfo API directly
      const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      if (!tokenInfoRes.ok) {
        return res.status(400).json({ msg: 'Invalid or expired Google token' });
      }
      const data = await tokenInfoRes.json();
      googleId = data.sub;
      email = data.email;
      name = data.name;
      picture = data.picture;
      verified = true;
    }

    if (!verified || !email) {
      return res.status(400).json({ msg: 'Failed to extract verified user from Google token' });
    }

    // 1. Look for user by googleId
    let user = await User.findOne({ googleId });

    // 2. If not found by googleId, check by email
    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        // Link Google ID and avatar if existing account
        user.googleId = googleId;
        if (!user.avatar && picture) {
          user.avatar = picture;
        }
        await user.save();
      }
    }

    // 3. If user still doesn't exist, create a new user
    if (!user) {
      let baseUsername = (name ? name.toLowerCase().replace(/[^a-z0-9]/g, '') : email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')) || 'coder';
      let uniqueUsername = baseUsername;
      let counter = 1;

      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}${Math.floor(100 + Math.random() * 900)}`;
        counter++;
        if (counter > 10) {
          uniqueUsername = `${baseUsername}_${Date.now().toString().slice(-4)}`;
          break;
        }
      }

      user = new User({
        username: uniqueUsername,
        email: email.toLowerCase(),
        googleId,
        avatar: picture || '',
        authProvider: 'google'
      });

      await user.save();
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'supersecretantigravitykey123!@#',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            studyLevel: user.studyLevel
          }
        });
      }
    );
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(500).json({ msg: 'Google authentication failed' });
  }
});

// @route    GET api/auth/me
// @desc     Get user by token
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
