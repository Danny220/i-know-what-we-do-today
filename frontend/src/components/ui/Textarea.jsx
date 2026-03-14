import React from "react";

function Textarea({className = '', ...props}) {
    return (
        <textarea className={`block w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-sm text-white shadow-sm placeholder-gray-400 transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[100px] ${className}`} {...props} />
    );
}

export default Textarea;