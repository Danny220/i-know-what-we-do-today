import React from "react";
import Skeleton from "../ui/Skeleton.jsx";

function MessageBoardSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-3" />
        </div>
        <Skeleton className="w-3/4 h-4" />
      </div>
    </div>
  );
}

export default MessageBoardSkeleton;
