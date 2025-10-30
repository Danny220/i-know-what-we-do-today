import React from "react";
import useUiStore from "../../stores/uiStore.js";

function GlobalLoader() {
    const isLoading = useUiStore((state) => state.isLoading);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
        </div>
    )
}

export default GlobalLoader;