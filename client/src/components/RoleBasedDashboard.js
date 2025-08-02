import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserDashboard from '../pages/dashboard/UserDashboard';
import SupportDashboard from '../pages/dashboard/SupportDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import NotificationBell from './NotificationBell';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  const DashboardComponent = () => {
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

  return (
    <div className="relative">
      <NotificationBell />
      <DashboardComponent />
    </div>
  );
};

export default RoleBasedDashboard; 