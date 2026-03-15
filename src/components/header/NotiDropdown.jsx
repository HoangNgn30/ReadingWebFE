import { useState, useEffect } from 'react';
import { IoMdNotificationsOutline } from "react-icons/io";
import { toast } from 'react-toastify';
import notificationApi from '../../services/notificationServices';

const NotiDropdown = ({ isOpen, onClose, notifications }) => {
  const unreadCount = notifications.filter(noti => !noti.isRead).length;

  const formatTime = (createdAt) => {
    try {
      const date = new Date(createdAt);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) {
        return 'Vừa xong';
      }
      
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
      }
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
      }
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) {
        return `${diffInDays} ngày trước`;
      }
      
      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) {
        return `${diffInMonths} tháng trước`;
      }
      
      const diffInYears = Math.floor(diffInMonths / 12);
      return `${diffInYears} năm trước`;
    } catch (error) {
      return 'Thời gian không xác định';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Thông báo</h3>
        {unreadCount > 0 && (
          <span className="ml-2 text-sm text-red-500">{unreadCount} thông báo mới</span>
        )}
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`px-4 py-3 hover:bg-gray-300 cursor-pointer ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <div className="flex items-center gap-x-2 mt-1">
                    <p className="text-xs text-gray-500">{formatTime(notification.createdAt)}</p>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-3 text-center text-gray-500">
            Không có thông báo mới
          </div>
        )}
      </div>
    </div>
  );
};

export default NotiDropdown;