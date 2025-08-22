import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StoreListPage from "./pages/StoreListPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";   
import AdminStoresPage from "./pages/admin/AdminStoresPage"; 
import StoreOwnerDashboardPage from "./pages/owner/StoreOwnerDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Normal User */}
        <Route
          path="/stores"
          element={
            <ProtectedRoute allowedRoles={["normal_user"]}>
              <StoreListPage />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["system_admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["system_admin"]}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute allowedRoles={["system_admin"]}>
              <AdminStoresPage />
            </ProtectedRoute>
          }
        />

        {/* Store Owner */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["store_owner"]}>
              <StoreOwnerDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Optional general dashboard (all roles can see) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["system_admin", "store_owner", "normal_user"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
