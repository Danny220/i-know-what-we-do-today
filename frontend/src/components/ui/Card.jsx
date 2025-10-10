import React from "react";

function Card({children, className, ...props}) {
    return (
        <div className={`w-full p-8 space-y-6 bg-gray-800 rounded-lg shadow-md ${className}`} {...props}>{children}</div>
    );
}

export default Card;