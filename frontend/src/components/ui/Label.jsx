import React from 'react'

export default function Label({children, htmlFor, className = '', ...props}) {
    return (
        <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-300 mb-1.5 ${className}`} {...props}>{children}</label>
    )
}