import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name || 'User'}!
      </Typography>
      <Typography variant="body1" paragraph>
        Role: {user.role || 'N/A'}
      </Typography>

      <Box sx={{ my: 4 }}>
        <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => navigate('/stores')}>
          View Stores
        </Button>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}
