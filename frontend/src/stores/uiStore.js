import { create } from "zustand";

const useUiStore = create((set, get) => ({
  isLoading: false,
  requestCount: 0,
  loaderTimer: null,
  delay: 500,

  /**
   * Start a request
   */
  startRequest: () => {
    const count = get().requestCount + 1;
    set({ requestCount: count });

    if (!get().loaderTimer && !get().isLoading) {
      const timer = setTimeout(() => {
        if (get().requestCount > 0) {
          set({ isLoading: true });
        }
      }, get().delay);
      set({ loaderTimer: timer });
    }
  },

  /**
   * End a request
   */
  endRequest: () => {
    const count = Math.max(0, get().requestCount - 1);
    set({ requestCount: count });

    if (count === 0) {
      if (get().loaderTimer) {
        clearTimeout(get().loaderTimer);
      }
      set({ isLoading: false, loaderTimer: null });
    }
  },
}));

export default useUiStore;
