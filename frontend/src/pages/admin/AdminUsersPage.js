import React, { useEffect, useState, useCallback } from "react";
import {
  Container, Typography, Paper, Button, Table, TableHead,
  TableBody, TableCell, TableRow, TextField, Grid,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  TableSortLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "normal_user", address: ""
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Confirm delete user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
      console.error(err);
    }
  };

  // Add user dialog
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: "", email: "", password: "", role: "normal_user", address: "" });
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      return alert("Name, Email, and Password are required");
    }
    try {
      await axios.post("http://localhost:5000/api/admin/users", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleCloseDialog();
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  // Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedUsers = [...users]
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[orderBy]?.toString().toLowerCase();
      const valB = b[orderBy]?.toString().toLowerCase();
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4">Manage Users</Typography>
        <Button variant="outlined" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </Button>
      </Grid>

      <TextField
        label="Search by name, email, role"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button variant="contained" onClick={handleOpenDialog} sx={{ mb: 2 }}>
        Add User
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {["name", "email", "address", "role"].map(col => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : "asc"}
                    onClick={() => handleSort(col)}
                  >
                    {col.toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {sortedUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth margin="normal" />
          <TextField
            label="Role"
            name="role"
            select
            SelectProps={{ native: true }}
            value={formData.role}
            onChange={handleChange}
            fullWidth margin="normal"
          >
            <option value="normal_user">Normal User</option>
            <option value="admin_user">Admin User</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add User</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
