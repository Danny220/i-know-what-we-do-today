import React from "react";
import Skeleton from "../ui/Skeleton.jsx";

function GroupListSkeleton() {
  return (
    <div className="block p-4 bg-gray-700 rounded-lg">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export default GroupListSkeleton;
