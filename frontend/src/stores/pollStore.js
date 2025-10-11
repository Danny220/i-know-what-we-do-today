import {create} from "zustand";
import apiClient from "../clients/apiClient.js";

const usePollStore = create((set, get) => ({
    // Initial state
    polls: [],
    isLoading: false,

    // Actions
    /**
     * Fetches all polls for the given group and updates the store.
     * @param groupId - The ID of the group to fetch polls for.
     * @returns {Promise<void>} - A promise that resolves when the polls are fetched.
     */
    fetchPolls: async (groupId) => {
        if (!groupId) return;
        set({isLoading: true});
        try {
            const response = await apiClient.get(`/groups/${groupId}/polls`);
            set({polls: response.data, isLoading: false});
        } catch (error) {
            console.error('Error fetching polls:', error);
            set({isLoading: false});
        }
    },

    /**
     * Creates a new poll for the given group and updates the store.
     * @param groupId - The ID of the group to create the poll for.
     * @param pollData - The data for the new poll.
     * @returns {Promise<void>} - A promise that resolves when the poll is created.
     */
    createPoll: async (groupId, pollData) => {
        if (!groupId) return;

        set({isLoading: true});

        try {
            await apiClient.post(`/groups/${groupId}/polls`, pollData);
            await get().fetchPolls(groupId);
        } catch (err) {
            console.error('Error creating poll:', err);
            // # TODO error handling with UI
            set({isLoading: false});
            throw err;
        }
    },

    finalizePoll: async (groupId, pollId) => {
      set({isLoading: true});
      try {
          await apiClient.post(`/groups/${groupId}/polls/${pollId}/finalize`);
          await get().fetchPolls(groupId);
      } catch (err) {
          console.error('Error finalizing poll:', err);
          throw err;
      }
    },

    /**
     * Votes on a poll with the given option ID.
     * @param groupId - The ID of the group to vote on the poll.
     * @param pollId - The ID of the poll to vote on.
     * @param optionId - The ID of the option to vote for.
     * @returns {Promise<void>} - A promise that resolves when the vote is registered.
     */
    voteOnPoll: async (groupId, pollId, optionId) =>  {
        try {
            await apiClient.post(`/groups/${groupId}/polls/${pollId}/vote`, {optionId});
            alert('Vote registered!');
            // TODO: refresh the poll data to show vote counts
        } catch (error) {
            console.error("Error while voting", error);
            throw error;
        }
    }
}));

export default usePollStore;