import { create } from "zustand";
import apiClient from "../clients/apiClient.js";

const useMessageStore = create((set, get) => ({
  messages: [],
  isLoading: false,

  /**
   * Fetches messages for a specific group
   * @param groupId {string} - The ID of the group
   * @returns {Promise<void>} - A promise that resolves when the messages are fetched
   */
  fetchMessages: async (groupId) => {
    if (!groupId) return;
    set({ isLoading: true });
    try {
      const response = await apiClient.get(`/groups/${groupId}/messages`);
      set({ messages: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  postMessage: async (groupId, content) => {
    try {
      await apiClient.post(`/groups/${groupId}/messages`, { content });
      await get().fetchMessages(groupId);
    } catch (error) {
      console.error("Failed to post message", error);
      throw error;
    }
  },
}));

export default useMessageStore;
