import { create } from "zustand";
import apiClient from "../clients/apiClient.js";

const useGroupStore = create(set => ({
    // Initial state
    groups: [],
    isLoading: false,

    // Actions

    /**
     * Fetches all groups for the current user and updates the store.
     */
    fetchGroups: async () => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get('/groups');
            set({groups: response.data, isLoading: false});
        } catch (error) {
            console.error('Error fetching groups:', error);
            set({isLoading: false});
        }
    },

    /**
     * Creates a new group and then refreshes the group list.
     * @param {object} groupData - { name, description }
     */
    createGroup: async (groupData) => {
        try {
            await apiClient.post('/groups', groupData);
            await useGroupStore.getState().fetchGroups();
        } catch (err) {
            console.error('Error creating group:', err);
            // # TODO error handling with UI
        }
    }
}));

export default useGroupStore;