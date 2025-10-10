import React from 'react'

export default function Label({children, htmlFor}) {
    return (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300">{children}</label>
    )
}