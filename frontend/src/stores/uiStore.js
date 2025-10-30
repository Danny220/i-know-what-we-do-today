import {create} from 'zustand';

const useUiStore = create((set) => ({
    isLoading: false,

    /**
     * Set loading state
     * @param status - boolean indicating loading state
     */
    setLoading: (status) => set({ isLoading: status }),
}));

export default useUiStore;