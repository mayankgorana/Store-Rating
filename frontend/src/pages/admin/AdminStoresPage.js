import React, { useEffect, useState, useCallback } from 'react';
import {
  Container, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, TextField, Button, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TableSortLabel, Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminStoresPage() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '' });
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchStores = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    }
  }, [token]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleOpenDialog = (store = null) => {
    setCurrentStore(store);
    setFormData({
      name: store?.name || '',
      email: store?.email || '',
      address: store?.address || '',
      password: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStore(null);
    setFormData({ name: '', email: '', address: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (formData.name.length < 3 || formData.name.length > 60) return alert("Store name must be 3–60 characters");
      if (formData.address.length > 400) return alert("Address cannot exceed 400 characters");

      if (currentStore) {
        // Update store only (no password)
        await axios.put(`http://localhost:5000/api/admin/stores/${currentStore.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // 1. Create store owner user
        const userRes = await axios.post('http://localhost:5000/api/admin/users', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'store_owner'
        }, { headers: { Authorization: `Bearer ${token}` } });

        const ownerId = userRes.data.id;

        // 2. Create store with owner_id
        await axios.post('http://localhost:5000/api/admin/stores', {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          owner_id: ownerId
        }, { headers: { Authorization: `Bearer ${token}` }});
      }

      handleCloseDialog();
      fetchStores();
    } catch (err) {
      alert('Failed to save store');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirm delete store?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStores();
    } catch (err) {
      alert('Failed to delete store');
      console.error(err);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedStores = [...stores]
    .filter(store =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[orderBy]?.toString().toLowerCase() || '';
      const valB = b[orderBy]?.toString().toLowerCase() || '';
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4">Manage Stores</Typography>
        <Button variant="outlined" onClick={() => navigate("/admin/dashboard")}>Back to Dashboard</Button>
      </Grid>

      <TextField
        label="Search by Name or Address"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ mb: 2 }}>
        Add Store
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {['name', 'email', 'address', 'owner_id', 'avg_rating'].map((col) => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : 'asc'}
                    onClick={() => handleSort(col)}
                  >
                    {col.replace("_", " ").toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStores.map(store => (
              <TableRow key={store.id}>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.email}</TableCell>
                <TableCell>{store.address}</TableCell>
                <TableCell>{store.owner_id}</TableCell>
                <TableCell>{store.avg_rating ? Number(store.avg_rating).toFixed(1) : 'N/A'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(store)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(store.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {sortedStores.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No stores found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentStore ? 'Edit Store' : 'Add Store'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Owner Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth margin="normal" />
          {!currentStore && (
            <TextField label="Owner Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth margin="normal" required />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{currentStore ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
