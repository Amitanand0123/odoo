import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Bell, X, Check } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationsData } = useQuery(
    'notifications',
    () => notificationService.getNotifications(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      enabled: !!user
    }
  );

  // Fetch unread count
  const { data: unreadData } = useQuery(
    'unreadCount',
    () => notificationService.getUnreadCount(),
    {
      refetchInterval: 30000,
      enabled: !!user
    }
  );

  const markAsReadMutation = useMutation(
    (notificationId) => notificationService.markAsRead(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications', 'unreadCount']);
      }
    }
  );

  const markAllAsReadMutation = useMutation(
    () => notificationService.markAllAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications', 'unreadCount']);
      }
    }
  );

  const handleMarkAsRead = (notificationId) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const notifications = notificationsData?.data || [];
  const unreadCount = unreadData?.data?.count || 0;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        {/* Notification Bell Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {isOpen && (
          <div className="absolute top-12 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell; 