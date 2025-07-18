import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Person, Edit, Save, Cancel } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { youtubeService } from '../services/youtubeService';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [youtubeData, setYoutubeData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchYouTubeData();
  }, []);

  const fetchYouTubeData = async () => {
    try {
      const data = await youtubeService.getUserYouTubeData();
      setYoutubeData(data);
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setEditMode(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateProfile(formData.username, formData.email);
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setEditMode(false);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>

      <Grid container spacing={3}>
        {/* User Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Person sx={{ mr: 1 }} />
              <Typography variant="h6">User Information</Typography>
              {!editMode && (
                <Button
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{ ml: 'auto' }}
                >
                  Edit
                </Button>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                margin="normal"
              />

              {editMode && (
                <Box display="flex" gap={2} mt={3}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>

            {!editMode && (
              <Box mt={3}>
                <Typography variant="body2" color="text.secondary">
                  Member since: {formatDate(user?.created_at)}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* YouTube Data */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              YouTube Integration
            </Typography>
            
            {youtubeData ? (
              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Channel:</strong> {youtubeData.youtube_username}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Channel ID:</strong> {youtubeData.youtube_channel_id}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="h4" color="primary">
                      {youtubeData.subscription_count || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Subscribers
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" color="primary">
                      {youtubeData.video_count || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Videos
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="h4" color="primary">
                      {youtubeData.view_count || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Views
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Last updated: {formatDate(youtubeData.updated_at)}
                </Typography>
              </Box>
            ) : (
              <Box textAlign="center" py={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  No YouTube data connected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect your YouTube channel to see your stats here
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Account Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Statistics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {user?.id ? 'Active' : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Account Status
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {formatDate(user?.created_at)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Join Date
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {youtubeData ? 'Connected' : 'Not Connected'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      YouTube Status
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 