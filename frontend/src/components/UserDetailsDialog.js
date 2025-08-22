import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Rating } from '@mui/material';
import api from '../../utils/api';

export default function StoreOwnerDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/owner/ratings')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {data.store.name} - Ratings Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom>
        Average Rating: <Rating value={data.averageRating} precision={0.1} readOnly /> ({data.averageRating.toFixed(1)})
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Submitted At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.ratings.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.rating}</TableCell>
                <TableCell>{new Date(r.submitted_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}