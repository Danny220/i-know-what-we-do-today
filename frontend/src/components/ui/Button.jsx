import React from "react";

function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
