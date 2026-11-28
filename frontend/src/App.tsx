
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Temporary pages; we'll implement these next
import MyListings from "./pages/MyListings";
import Profile from "./pages/Profile";
import CreateProperty from "./pages/CreateProperty";
import EditProperty from "./pages/EditProperty";

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="listings" element={<MyListings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="create" element={<CreateProperty />} />
              <Route path="edit/:id" element={<EditProperty />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
