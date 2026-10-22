import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  useMarkAllAsRead,
  useNotifications,
} from "../hooks/useNotifications.js";

function Notifications() {
  const { data: notifications = [], isError, isLoading } = useNotifications();
  const { mutateAsync: markAllAsRead, isPending } = useMarkAllAsRead();

  const [isOpen, setIsOpen] = useState(false);
  const [wasOpen, setWasOpen] = useState(false);

  const hasUnread = notifications.some((notif) => !notif.is_read);

  const handleToggle = async () => {
    setWasOpen(isOpen);
    setIsOpen(!isOpen);

    if (!isOpen && wasOpen) {
      await markAllAsRead(undefined);
    }
  };

  if (isError) {
    return <div className="text-red-400">Failed to load notifications.</div>;
  }
  if (isLoading) {
    return <div className="text-gray-400">Loading notifications...</div>;
  }
  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative text-gray-300 hover:text-white"
        disabled={isPending}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {hasUnread && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-700 rounded-lg shadow-lg overflow-hidden z-20">
          <div className="py-2 px-4 text-white font-bold border-b border-gray-600">
            Notifications
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <Link
                  to={notif.link_url}
                  key={notif.id}
                  className={`block px-4 py-3 hover:bg-gray-500 ${!notif.is_read ? "bg-gray-600" : "bg-transparent"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-sm text-gray-200">{notif.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400 p-4">No new notifications.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
