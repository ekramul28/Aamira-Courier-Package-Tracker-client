import type { FC } from "react";

const FacultyCardSkeleton: FC = () => {
  return (
    <div className="animate-pulse group mx-auto bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="grid md:grid-cols-[1fr_2fr] gap-6 p-6">
        <div className="overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-700 h-[280px] w-full" />
        <div className="flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
            <div className="flex gap-4 mt-4">
              <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
          </div>
          <div className="mt-5 h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default FacultyCardSkeleton;
