import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Bookmark,
  BookmarkBorder,
  PlayArrow,
} from '@mui/icons-material';
import { youtubeService } from '../../services/youtubeService';

const YouTubeSearch = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedVideos, setSavedVideos] = useState(new Set());

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const searchResults = await youtubeService.searchVideos(query, 20);
      setVideos(searchResults);
      
      // Get current saved videos to check which ones are already saved
      const currentSaved = await youtubeService.getSavedVideos();
      const savedIds = new Set(currentSaved.map(video => video.video_id));
      setSavedVideos(savedIds);
    } catch (error) {
      setError('Failed to search videos. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVideo = async (video) => {
    try {
      await youtubeService.saveVideo({
        video_id: video.id,
        video_title: video.title,
        video_description: video.description,
        channel_title: video.channelTitle,
        thumbnail_url: video.thumbnail,
        published_at: video.publishedAt,
      });
      
      setSavedVideos(prev => new Set([...prev, video.id]));
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await youtubeService.removeSavedVideo(videoId);
      setSavedVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
    } catch (error) {
      console.error('Error removing video:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Search YouTube Videos
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : <Search />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {videos.length > 0 && (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {truncateText(video.title, 60)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {truncateText(video.description)}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={video.channelTitle}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={formatDate(video.publishedAt)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Button
                      size="small"
                      startIcon={<PlayArrow />}
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                    >
                      Watch
                    </Button>
                    
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (savedVideos.has(video.id)) {
                          handleRemoveVideo(video.id);
                        } else {
                          handleSaveVideo(video);
                        }
                      }}
                      color={savedVideos.has(video.id) ? 'primary' : 'default'}
                    >
                      {savedVideos.has(video.id) ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && videos.length === 0 && query && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No videos found for "{query}"
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try a different search term
          </Typography>
        </Box>
      )}

      {!query && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            Enter a search term to find YouTube videos
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default YouTubeSearch; 