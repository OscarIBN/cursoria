import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const youtubeService = {
  // Search YouTube videos
  searchVideos: async (query, maxResults = 10) => {
    const response = await api.get('/youtube/search', {
      params: {
        q: query,
        maxResults,
      },
    });
    return response.data.videos;
  },

  // Get video details
  getVideoDetails: async (videoId) => {
    const response = await api.get(`/youtube/video/${videoId}`);
    return response.data.video;
  },

  // Get channel information
  getChannelInfo: async (channelId) => {
    const response = await api.get(`/youtube/channel/${channelId}`);
    return response.data.channel;
  },

  // Get trending videos
  getTrendingVideos: async (regionCode = 'US', maxResults = 10) => {
    const response = await api.get('/youtube/trending', {
      params: {
        regionCode,
        maxResults,
      },
    });
    return response.data.videos;
  },

  // Get channel videos
  getChannelVideos: async (channelId, maxResults = 10) => {
    const response = await api.get(`/youtube/channel/${channelId}/videos`, {
      params: {
        maxResults,
      },
    });
    return response.data.videos;
  },

  // Get user's saved videos
  getSavedVideos: async () => {
    const response = await api.get('/users/saved-videos');
    return Array.isArray(response.data) ? response.data : [];
  },

  // Save a video
  saveVideo: async (videoData) => {
    const response = await api.post('/users/saved-videos', videoData);
    return response.data;
  },

  // Remove saved video
  removeSavedVideo: async (videoId) => {
    const response = await api.delete(`/users/saved-videos/${videoId}`);
    return response.data;
  },
}; 