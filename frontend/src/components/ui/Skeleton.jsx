import React from "react";

function Skeleton({ className }) {
  return (
    <div className={`bg-gray-600 rounded-md animate-pulse ${className}`}></div>
  );
}

export default Skeleton;
