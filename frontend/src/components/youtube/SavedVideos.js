import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete,
  PlayArrow,
  Bookmark,
  Info,
} from '@mui/icons-material';
import { youtubeService } from '../../services/youtubeService';

const SavedVideos = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchSavedVideos();
  }, []);

  const fetchSavedVideos = async () => {
    try {
      const videos = await youtubeService.getSavedVideos();
      setSavedVideos(videos);
    } catch (error) {
      setError('Failed to load saved videos');
      console.error('Error fetching saved videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await youtubeService.removeSavedVideo(videoId);
      setSavedVideos(prev => prev.filter(video => video.video_id !== videoId));
    } catch (error) {
      console.error('Error removing video:', error);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Saved Videos
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {savedVideos.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Bookmark sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No saved videos yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search for videos and save them to see them here
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {savedVideos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={video.thumbnail_url}
                  alt={video.video_title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {truncateText(video.video_title, 60)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {truncateText(video.video_description)}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={video.channel_title}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`Saved ${formatDate(video.saved_at)}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Button
                        size="small"
                        startIcon={<PlayArrow />}
                        href={`https://www.youtube.com/watch?v=${video.video_id}`}
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
                      color="error"
                      onClick={() => handleRemoveVideo(video.video_id)}
                      title="Remove from saved"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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
            <DialogTitle>{selectedVideo.video_title}</DialogTitle>
            <DialogContent>
              <Box display="flex" gap={2} mb={2}>
                <img
                  src={selectedVideo.thumbnail_url}
                  alt={selectedVideo.video_title}
                  style={{ width: 200, height: 150, objectFit: 'cover' }}
                />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedVideo.channel_title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Published: {formatDate(selectedVideo.published_at)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Saved: {formatDate(selectedVideo.saved_at)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1">
                {selectedVideo.video_description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                href={`https://www.youtube.com/watch?v=${selectedVideo.video_id}`}
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

export default SavedVideos; 