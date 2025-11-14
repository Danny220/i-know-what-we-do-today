import React from "react";
import Skeleton from "../ui/Skeleton.jsx";

function EventListSkeleton() {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/3 mb-3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export default EventListSkeleton;
