import {create} from 'zustand';
import apiClient from "../clients/apiClient.js";

const useProfileStore = create((set) => ({
    profile: null,
    isLoading: false,

    /**
     * Fetches the profile data for the given user ID.
     * @param userId - The user ID to fetch the profile for.
     * @returns {Promise<void>} - Promise that resolves when the profile data is fetched.
     */
    fetchProfile: async (userId) => {
        set({isLoading: true});
        try {
            const response = await apiClient.get(`/profiles/${userId}`);
            set({profile: response.data, isLoading: false});
        } catch (error) {
            console.error('Failed to fetch profile: ', error.message);
            set({isLoading: false});
        }
    },

    updateProfile: async (profileData) => {
        set({isLoading: true});
        try {
            await apiClient.put('/profiles/me', profileData);
            set(state => ({...state, profile: {...state.profile, ...profileData}, isLoading: false}))
        } catch (error) {
            console.error('Failed to update profile: ', error.message);
            set({isLoading: false});
            throw error;
        }
    }
}));

export default useProfileStore;