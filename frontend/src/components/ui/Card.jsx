import React from "react";

function Card({children, className = '', ...props}) {
    return (
        <div className={`w-full p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-lg ${className}`} {...props}>{children}</div>
    );
}

export default Card;