import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserDashboard from '../pages/dashboard/UserDashboard';
import SupportDashboard from '../pages/dashboard/SupportDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'support_agent':
      return <SupportDashboard />;
    case 'end_user':
    default:
      return <UserDashboard />;
  }
};

export default RoleBasedDashboard; 