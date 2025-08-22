import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  Paper,
  Rating,
  TextField,
  Button,
  Box,
} from "@mui/material";

export default function StoreListPage() {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const token = localStorage.getItem("token");

  // Fetch stores and user ratings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all stores
        const storesRes = await axios.get("http://localhost:5000/api/stores", {
          headers,
        });
        setStores(storesRes.data);

        // Fetch user ratings (assuming backend API endpoint exists)
        const ratingsRes = await axios.get(
          "http://localhost:5000/api/ratings/user",
          { headers }
        );
        // ratingsRes.data assumed to be an array of { store_id, rating }
        const ratingsMap = {};
        ratingsRes.data.forEach((r) => {
          ratingsMap[r.store_id] = r.rating;
        });
        setUserRatings(ratingsMap);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          // clear token and redirect to login
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      }
    };
    fetchData();
  }, [token]);

  // Submit or update rating for a store
  const submitRating = async (storeId, ratingValue) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const user = JSON.parse(localStorage.getItem("user")) || {};

      await axios.post(
        "http://localhost:5000/api/ratings",
        {
          user_id: user.id, // <-- include this
          store_id: storeId,
          rating: ratingValue,
        },
        { headers }
      );

      setUserRatings((prev) => ({ ...prev, [storeId]: ratingValue }));
    } catch (err) {
      console.error("Failed to submit rating", err);
      alert(err.response?.data?.error || "Failed to submit rating");
    }
  };

  // Filtered stores based on search
  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchName.toLowerCase()) &&
      store.address.toLowerCase().includes(searchAddress.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Store Ratings
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Search by Address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          fullWidth
        />
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="stores table">
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Address</b>
              </TableCell>
              <TableCell>
                <b>Average Rating</b>
              </TableCell>
              <TableCell>
                <b>Your Rating</b>
              </TableCell>
              <TableCell>
                <b>Submit/Update Rating</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStores.map((store) => {
              const userRating = userRatings[store.id] || 0;
              return (
                <TableRow key={store.id}>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell>
                    <Rating
                      name={`avg-rating-${store.id}`}
                      value={parseFloat(store.average_rating) || 0}
                      precision={0.1}
                      readOnly
                    />{" "}
                    ({parseFloat(store.average_rating || 0).toFixed(1)})
                  </TableCell>
                  <TableCell>
                    {userRating > 0 ? userRating : "Not rated"}
                  </TableCell>
                  <TableCell>
                    <Rating
                      name={`user-rating-${store.id}`}
                      value={userRating}
                      precision={1}
                      onChange={(_, value) => submitRating(store.id, value)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
