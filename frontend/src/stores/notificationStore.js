import {create} from "zustand";
import apiClient from "../clients/apiClient.js";

const useNotificationStore = create((set) => ({
    notifications: [],
    hasUnread: false,

    /**
     * Fetch notifications from the API and update the store state.
     * @returns {Promise<void>} - Promise that resolves when the notifications are fetched and updated.
     */
    fetchNotifications: async () => {
        try {
            const response = await apiClient.get('/notifications');
            set({ notifications: response.data, hasUnread: response.data.length > 0 });
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    },

    /**
     * Mark all notification as read.
     * @returns {Promise<void>} - Promise that resolves when all notifications are marked as read.
     */
    markAllAsRead: async () => {
        try {
            await apiClient.post('/notifications/mark-as-read');
            set({ notifications: [], hasUnread: false });
        } catch (error) {
            console.error('Failed to mark notifications as read', error);
        }
    },
}));

export default useNotificationStore;