import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const FacultyProfileSkeleton = () => {
  return (
    <div className="flex justify-center dark:bg-gray-900 p-4 min-h-screen transition-colors duration-500">
      <div className="w-full max-w-6xl space-y-6">
        {/* Profile Header Card Skeleton */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-500/20 to-indigo-600/20" />
          <CardHeader className="relative -mt-16 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="flex-1 text-center sm:text-left space-y-2">
                <Skeleton className="h-8 w-64 mx-auto sm:mx-0" />
                <div className="flex gap-2 justify-center sm:justify-start">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-48 mx-auto sm:mx-0" />
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
          </CardHeader>
        </Card>

        {/* Profile Content Skeleton */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Tabs Skeleton */}
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>

              {/* Content Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                  >
                    <Skeleton className="h-4 w-4 mt-1" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacultyProfileSkeleton;
