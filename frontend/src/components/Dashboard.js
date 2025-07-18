import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
} from '@mui/material';
import {
  YouTube,
  VideoLibrary,
  TrendingUp,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { youtubeService } from '../services/youtubeService';

const Dashboard = () => {
  const { user } = useAuth();
  const [youtubeData, setYoutubeData] = useState(null);
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [youtubeDataResult, savedVideosResult] = await Promise.all([
          youtubeService.getUserYouTubeData(),
          youtubeService.getSavedVideos(),
        ]);
        
        setYoutubeData(youtubeDataResult);
        setSavedVideos(savedVideosResult || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.username}!
      </Typography>

      <Grid container spacing={3}>
        {/* YouTube Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <YouTube color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">YouTube Stats</Typography>
              </Box>
              {youtubeData ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Channel: {youtubeData.youtube_username || 'Not connected'}
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {youtubeData.subscription_count || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subscribers
                  </Typography>
                  <Box mt={2}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="h6">
                          {youtubeData.video_count || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Videos
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">
                          {youtubeData.view_count || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Views
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No YouTube data connected
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Saved Videos */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <VideoLibrary color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Saved Videos</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {savedVideos.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Videos saved
              </Typography>
              {savedVideos.length > 0 && (
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary">
                    Recently saved:
                  </Typography>
                  <List dense>
                    {savedVideos.slice(0, 3).map((video) => (
                      <ListItem key={video.id} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            src={video.thumbnail_url}
                            variant="rounded"
                            sx={{ width: 40, height: 30 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={video.video_title}
                          secondary={video.channel_title}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Quick Actions</Typography>
              </Box>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  fullWidth
                  href="/search"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Search Videos
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  href="/saved"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  View Saved Videos
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  href="/profile"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Edit Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {savedVideos.length > 0 ? (
              <List>
                {savedVideos.slice(0, 5).map((video) => (
                  <ListItem key={video.id} divider>
                    <ListItemAvatar>
                      <Avatar
                        src={video.thumbnail_url}
                        variant="rounded"
                        sx={{ width: 60, height: 45 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={video.video_title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {video.channel_title}
                          </Typography>
                          <Chip
                            label={`Saved ${new Date(video.saved_at).toLocaleDateString()}`}
                            size="small"
                            color="primary"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent activity. Start by searching and saving some videos!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 