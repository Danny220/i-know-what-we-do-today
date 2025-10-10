import React from "react";

export default function H2({children, className, ...props}) {
    return (
        <h2 className={`mb-2 text-2xl font-bold text-center text-white ${className}`} {...props}>{children}</h2>
    );
}