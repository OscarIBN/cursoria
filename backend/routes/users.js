const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id;
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }
    await pool.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3',
      [username, email, userId]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get saved videos
router.get('/saved-videos', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM user_saved_videos WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching saved videos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save a video
router.post('/saved-videos', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId, title, channelTitle, thumbnail } = req.body;
    await pool.query(
      'INSERT INTO user_saved_videos (user_id, video_id, video_title, channel_title, thumbnail_url) VALUES ($1, $2, $3, $4, $5)',
      [userId, videoId, title, channelTitle, thumbnail]
    );
    res.status(201).json({ message: 'Video saved successfully' });
  } catch (error) {
    console.error('Error saving video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a saved video
router.delete('/saved-videos/:videoId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId } = req.params;
    await pool.query(
      'DELETE FROM user_saved_videos WHERE user_id = $1 AND video_id = $2',
      [userId, videoId]
    );
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 