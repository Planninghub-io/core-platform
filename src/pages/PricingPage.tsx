
import React from 'react';

const PricingPage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Pricing Plans</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Basic</h2>
          <p className="text-gray-600 mb-4">For small events</p>
        </div>
        <div className="p-6 rounded-lg bg-white shadow-md border-2 border-purple-400">
          <h2 className="text-xl font-semibold mb-4">Professional</h2>
          <p className="text-gray-600 mb-4">For medium sized events</p>
        </div>
        <div className="p-6 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-semibold mb-4">Enterprise</h2>
          <p className="text-gray-600 mb-4">For large-scale events</p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
