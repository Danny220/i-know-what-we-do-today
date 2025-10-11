import React from "react";

export default function H4({children, className, ...props}) {
    return (
        <h4 className={`text-sm font-semibold text-gray-300 mb-2 ${className}`} {...props}>{children}</h4>
    );
}