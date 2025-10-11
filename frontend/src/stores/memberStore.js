import {create} from "zustand";
import apiClient from "../clients/apiClient.js";

const useMemberStore = create((set, get) => ({
    // Initial state
    members: [],
    isLoading: false,

    /**
     * Fetches all members for the given group and updates the store.
     * @param groupId - The ID of the group to fetch members for.
     * @returns {Promise<void>} - A promise that resolves when the members are fetched.
     */
    fetchMembers: async (groupId) => {
        if (!groupId) return;
        set({isLoading: true});
        try {
            const response = await apiClient.get(`/groups/${groupId}/members`);
            set({members: response.data, isLoading: false});
        } catch (error) {
            console.error('Error fetching members:', error);
            set({isLoading: false});
        }
    },

    /**
     * Removes a member from the group.
     * @param groupId - The ID of the group to remove the member from.
     * @param memberId - The ID of the member to remove.
     * @returns {Promise<void>} - A promise that resolves when the member is removed.
     */
    removeMember: async (groupId, memberId) => {
        try {
            await apiClient.delete(`/groups/${groupId}/members/${memberId}`);
            await get().fetchMembers(groupId);
        } catch (error) {
            console.error('Error removing member:', error);
            throw error;
        }
    }
}));

export default useMemberStore;