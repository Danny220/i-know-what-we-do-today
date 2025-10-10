import React from "react";

function Textarea({className, ...props}) {
    return (
        <textarea className={`block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400
        focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
        disabled:bg-gray-500 disabled:border-gray-600 ${className}`} {...props} />
    );
}

export default Textarea;