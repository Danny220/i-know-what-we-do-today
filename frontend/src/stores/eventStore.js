import { create } from "zustand";
import apiClient from "../clients/apiClient.js";

const useEventStore = create(set => ({
    // Initial state
    events: [],
    isLoading: false,

    // Actions
    /**
     * Fetches all events for the given group and updates the store.
     * @param groupId - The ID of the group to fetch events for.
     * @returns {Promise<void>} - A promise that resolves when the events are fetched.
     */
    fetchEvents: async (groupId) => {
        set({isLoading: true});
        try {
            const response = await apiClient.get(`/groups/${groupId}/events`);
            set({events: response.data, isLoading: false});
        } catch (error) {
            console.error('Error fetching events:', error);
            set({isLoading: false});
        }
    }
}))

export default useEventStore;