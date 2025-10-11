import React from "react";

function Button({children, className, ...props}) {
    return (
        <button className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`} {...props}>{children}</button>
    );
}

export default Button;