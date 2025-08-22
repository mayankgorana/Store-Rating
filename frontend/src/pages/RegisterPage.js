  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";

  import {
    Container,
    Grid,
    Paper,
    Box,
    Avatar,
    Typography,
    TextField,
    Button,
    Link,
    CssBaseline,
  } from "@mui/material";
  import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
  import axios from "axios";

  export default function RegisterPage() {
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      address: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      try {
        await axios.post("http://localhost:5000/api/auth/signup", form);
        navigate("/");
      } catch (err) {
        setError(err.response?.data?.error || "Registration failed");
      }
    };

    return (
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />

        <Grid
          item
          xs={12}
          sm={7}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ maxWidth: 450, margin: "auto" }}
        >
          <Container maxWidth="sm" sx={{ my: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" fontWeight="bold">
                Register
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Name"
                  name="name"
                  autoFocus
                  value={form.name}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
                {error && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
                >
                  Sign Up
                </Button>
                
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                  <Grid item>
                    <Link href="/" variant="body2">
                      Already have an account? Sign In
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
        </Grid>

        <Grid/>
      </Grid>
    );
  }
