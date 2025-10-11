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
    }
}));

export default useGroupDetailStore;