import React from "react";
import Skeleton from "../ui/Skeleton.jsx";

function MemberListSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  );
}

export default MemberListSkeleton;
