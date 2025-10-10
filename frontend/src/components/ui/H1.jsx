import React from "react";

export default function H1({children, className, ...props}) {
    return (
        <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${className}`} {...props}>{children}</h1>
    );
}