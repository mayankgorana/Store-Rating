import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function StoreOwnerDashboardPage() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", address: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/owner/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.store) {
          setStore(res.data.store);
          setFormData({
            name: res.data.store.name,
            email: res.data.store.email,
            address: res.data.store.address
          });
        }
        setRatings(res.data.ratings || []);
        setAverageRating(res.data.averageRating);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchDashboard();
  }, [token]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/owner/stores/${store.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStore(prev => ({ ...prev, ...formData }));
      handleCloseDialog();
    } catch (err) {
      alert("Failed to update store");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Header with Logout */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Store Owner Dashboard</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Store Info */}
      {store && (
        <Paper sx={{ p: 2, mb: 4 }}>
          <Typography variant="h6">My Store</Typography>
          <Typography><b>Name:</b> {store.name}</Typography>
          <Typography><b>Email:</b> {store.email}</Typography>
          <Typography><b>Address:</b> {store.address}</Typography>
          <Button onClick={handleOpenDialog} variant="outlined" sx={{ mt: 1 }}>
            Edit Store
          </Button>
        </Paper>
      )}

      {/* Ratings Section */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Store Ratings</Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Average Rating: {averageRating ? averageRating.toFixed(1) : "No ratings yet"}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ratings.length > 0 ? ratings.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.username}</TableCell>
                <TableCell>{r.rating}</TableCell>
                <TableCell>{new Date(r.submitted_at || Date.now()).toLocaleDateString()}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={3} align="center">No ratings yet</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Store</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
