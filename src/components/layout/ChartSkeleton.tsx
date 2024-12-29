import { Box } from "@radix-ui/themes";
import { Skeleton } from "@chakra-ui/react";

export function ChartSkeleton() {
  return (
    <div className="w-full h-[400px] mt-8">
      <Skeleton height="24px" width="200px" className="mx-auto mb-4" />
      <Box className="w-full h-[350px] bg-gray-100 rounded-lg animate-pulse" />
    </div>
  );
}
