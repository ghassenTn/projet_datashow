import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import ProfLayout from './layouts/ProfLayout';
import { ADMIN_ROUTES } from './routes/adminRoutes';
import { PROF_ROUTES } from './routes/profRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique */}
        <Route path="/" element={<LoginPage />} />

        {/* Routes Admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          {ADMIN_ROUTES.map(route => (
            <Route 
              key={route.id} 
              path={route.path} 
              element={<route.component />} 
            />
          ))}
        </Route>

        {/* Routes Professeur */}
        <Route element={<ProfLayout />}>
          <Route path="/prof" element={<Navigate to="/prof/dashboard" replace />} />
          {PROF_ROUTES.map(route => (
            <Route 
              key={route.id} 
              path={route.path} 
              element={<route.component />} 
            />
          ))}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
