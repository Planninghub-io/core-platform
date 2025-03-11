
import React from "react";

export const NoRecommendations: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-8 text-center">
      <h3 className="text-lg font-medium text-gray-900">No recommendations found</h3>
      <p className="mt-2 text-gray-600">
        Try broadening your search criteria or checking a different location.
      </p>
    </div>
  );
};
