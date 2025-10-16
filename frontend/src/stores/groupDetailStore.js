import {create} from "zustand";
import apiClient from "../clients/apiClient.js";

const useGroupDetailStore = create(set => ({
    // Initial state
    group: null,
    isLoading: false,

    // Actions
    /**
     * Fetches group details for the given group ID and updates the store.
     * @param groupId - The ID of the group to fetch details for.
     * @returns {Promise<void>} - A promise that resolves when the group details are fetched.
     */
    fetchGroupDetails: async (groupId) => {
        if (!groupId) return;
        set({isLoading: true});
        try {
            const response = await apiClient.get(`/groups/${groupId}`);
            set({group: response.data, isLoading: false});
        } catch (error) {
            console.error('Error fetching group details:', error);
            set({isLoading: false, group: null});
        }
    },

    /**
     * Updates the group details in the store. This action is used when the user makes changes to the group details.
     * @param groupId
     * @param groupData
     * @returns {Promise<void>}
     */
    updateGroup: async (groupId, groupData) => {
        try {
            const response = await apiClient.put(`/groups/${groupId}`, groupData);
            set({group: response.data});
        } catch (error) {
            console.error('Error updating group:', error);
            throw error;
        }
    },

    /**
     * Removes the group from the store.
     * @param groupId - The ID of the group to remove.
     * @returns {Promise<void>} - A promise that resolves when the group is removed.
     */
    deleteGroup: async (groupId) => {
        try {
            await apiClient.delete(`/groups/${groupId}`);
        } catch (error) {
            console.error('Error deleting group:', error);
            throw error;
        }
    }
}));

export default useGroupDetailStore;