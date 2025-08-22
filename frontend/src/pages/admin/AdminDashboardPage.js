import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 2 }}>
        {["Users", "Stores", "Ratings"].map((label, i) => (
          <Grid item xs={12} sm={4} key={label}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">{label}</Typography>
              <Typography variant="h4">
                {i === 0 ? stats.users : i === 1 ? stats.stores : stats.ratings}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/stores")}
          >
            Manage Stores
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
