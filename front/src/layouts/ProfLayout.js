import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function ProfLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Sidebar role="prof" onLogout={handleLogout} />
      <main style={{ flex: 1, overflowY: 'auto', background: '#f4f6fb' }}>
        <Outlet />
      </main>
    </div>
  );
}
