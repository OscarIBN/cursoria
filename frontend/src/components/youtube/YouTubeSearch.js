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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  PlayArrow,
  Bookmark,
  Info,
  BookmarkBorder,
} from '@mui/icons-material';
import { youtubeService } from '../../services/youtubeService';

const YouTubeSearch = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await youtubeService.searchVideos(query);
      setVideos(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search videos. Please try again.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVideo = async (video) => {
    try {
      const videoData = {
        videoId: video.id.videoId,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails.medium.url,
      };
      await youtubeService.saveVideo(videoData);
      // Show success message or update UI
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Search YouTube Videos
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            fullWidth
            label="Search videos"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter search terms..."
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Search />}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {Array.isArray(videos) && videos.length > 0 && (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={`video-${video.id.videoId}`}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {truncateText(video.snippet.title, 60)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {truncateText(video.snippet.description)}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={video.snippet.channelTitle}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={formatDate(video.snippet.publishedAt)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Button
                        size="small"
                        startIcon={<PlayArrow />}
                        href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                        target="_blank"
                        sx={{ mr: 1 }}
                      >
                        Watch
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Info />}
                        onClick={() => handleVideoClick(video)}
                      >
                        Details
                      </Button>
                    </Box>
                    
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleSaveVideo(video)}
                      title="Save video"
                    >
                      <BookmarkBorder />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {Array.isArray(videos) && videos.length === 0 && !loading && query && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No videos found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try different search terms
          </Typography>
        </Box>
      )}

      {/* Video Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedVideo && (
          <>
            <DialogTitle>{selectedVideo.snippet.title}</DialogTitle>
            <DialogContent>
              <Box display="flex" gap={2} mb={2}>
                <img
                  src={selectedVideo.snippet.thumbnails.medium.url}
                  alt={selectedVideo.snippet.title}
                  style={{ width: 200, height: 150, objectFit: 'cover' }}
                />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedVideo.snippet.channelTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Published: {formatDate(selectedVideo.snippet.publishedAt)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Video ID: {selectedVideo.id.videoId}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1">
                {selectedVideo.snippet.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                href={`https://www.youtube.com/watch?v=${selectedVideo.id.videoId}`}
                target="_blank"
                startIcon={<PlayArrow />}
              >
                Watch on YouTube
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default YouTubeSearch; 