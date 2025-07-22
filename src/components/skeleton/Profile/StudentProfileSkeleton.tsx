const StudentProfileSkeleton = () => {
  return (
    <div className="flex justify-center bg-gray-50 p-4 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-5 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-3 bg-gray-300 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>

        {/* Section Skeletons */}
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-3 bg-gray-200 rounded w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProfileSkeleton;
