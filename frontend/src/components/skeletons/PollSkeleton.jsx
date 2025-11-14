import Skeleton from "../ui/Skeleton.jsx";

function PollSkeleton() {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-1/4" />
      </div>
    </div>
  );
}

export default PollSkeleton;
