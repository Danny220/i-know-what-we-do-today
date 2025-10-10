import React from "react";

export default function Container({children, className, ...props}) {
    return (
        <div className={`max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`} {...props}>{children}</div>
    );
}