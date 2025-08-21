import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    // POST to backend for Login
    await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
    // On success, redirect based on role
  };
  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}
