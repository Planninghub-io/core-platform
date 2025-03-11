
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const VenueRecommendationSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
};

export const VenueRecommendationsLoading: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Loading recommendations...</h3>
      {[1, 2, 3].map((i) => (
        <VenueRecommendationSkeleton key={i} />
      ))}
    </div>
  );
};
