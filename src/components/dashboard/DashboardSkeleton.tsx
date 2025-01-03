import { Skeleton } from "@chakra-ui/react";

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Total Spending Chart Skeleton */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <Skeleton height="24px" width="150px" className="mb-4" />
        <Skeleton height="200px" className="w-full rounded-lg" />
      </div>

      {/* Ongoing Budgets Skeleton */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <Skeleton height="24px" width="150px" className="mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton height="24px" width="80%" />
              <Skeleton height="8px" width="100%" />
              <Skeleton height="16px" width="40%" />
            </div>
          ))}
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <Skeleton height="24px" width="180px" className="mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton height="16px" width="16px" />
                <Skeleton height="16px" width="120px" />
              </div>
              <Skeleton height="16px" width="80px" />
            </div>
          ))}
        </div>
      </div>

      {/* Vendors Skeleton */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <Skeleton height="24px" width="160px" className="mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton height="16px" width="16px" />
                <Skeleton height="16px" width="120px" />
              </div>
              <Skeleton height="16px" width="80px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
