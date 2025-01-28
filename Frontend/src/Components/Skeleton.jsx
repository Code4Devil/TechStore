import React from 'react';

const Skeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1 bg-gray-200">
          <div className="w-full h-48"></div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;