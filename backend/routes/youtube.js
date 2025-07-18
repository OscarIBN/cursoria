const express = require('express');
const axios = require('axios');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
const cors = require('cors');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'your_youtube_api_key';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Search YouTube videos
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, maxResults = 10 } = req.query;
    if (!q) return res.status(400).json({ error: 'Query is required' });
    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        q,
        key: YOUTUBE_API_KEY,
        maxResults,
        type: 'video',
      },
    });
    // Always return videos as an array for frontend compatibility
    res.json({ videos: response.data.items });
  } catch (error) {
    console.error('YouTube search error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to search YouTube' });
  }
});

// Test endpoint without authentication (for development only)
router.get('/search-test', async (req, res) => {
  try {
    const { q, maxResults = 10 } = req.query;
    if (!q) return res.status(400).json({ error: 'Query is required' });
    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        q,
        key: YOUTUBE_API_KEY,
        maxResults,
        type: 'video',
      },
    });
    res.json({ videos: response.data.items });
  } catch (error) {
    console.error('YouTube search error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to search YouTube' });
  }
});

// Get video details
router.get('/video/:videoId', authenticateToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'snippet,statistics',
        id: videoId,
        key: YOUTUBE_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('YouTube video error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch video details' });
  }
});

// Get channel details
router.get('/channel/:channelId', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const response = await axios.get(`${YOUTUBE_API_BASE}/channels`, {
      params: {
        part: 'snippet,statistics',
        id: channelId,
        key: YOUTUBE_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('YouTube channel error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch channel details' });
  }
});

// Get trending videos (most popular)
router.get('/trending', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'snippet,statistics',
        chart: 'mostPopular',
        regionCode: 'US',
        maxResults: 10,
        key: YOUTUBE_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('YouTube trending error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch trending videos' });
  }
});

// Get videos from a channel
router.get('/channel/:channelId/videos', authenticateToken, async (req, res) => {
  try {
    const { channelId } = req.params;
    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        channelId,
        maxResults: 10,
        order: 'date',
        key: YOUTUBE_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('YouTube channel videos error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch channel videos' });
  }
});

module.exports = router; 