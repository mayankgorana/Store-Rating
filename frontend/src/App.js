import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StoreListPage from './pages/StoreListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/stores" element={<StoreListPage />} />
      </Routes>
    </Router>
  );
}
export default App;
