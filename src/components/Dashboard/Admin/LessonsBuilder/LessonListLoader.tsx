import React from 'react';

const LessonListLoader = () => {
  return (
    <div className="animate-pulse space-y-8 flex flex-col">
      <div className="flex justify-between bg-white w-full border-b-0 border-gray-200">
        <div className="w-.5/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <div className="w-16 flex h-4 bg-gray-400"></div>
        </div>
        <div className="w-3/10 flex items-center px-8 py-4 whitespace-nowrap">
          <div className="w-24 flex h-4 bg-gray-400"></div>
        </div>
        <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <div className="w-16 flex h-4 bg-gray-400" />
        </div>
        <div className="w-1.5/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <div className="w-16 flex h-4 bg-gray-400" />
        </div>
        <div className="w-1.5/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <div className="w-16 flex h-4 bg-gray-400" />
        </div>
        <div className="w-1.5/10 flex justify-start items-center px-8 py-4 whitespace-nowrap">
          <div className="w-16 flex h-4 bg-gray-400" />
        </div>
        <div className="w-1/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <span className="w-16 flex h-4 bg-gray-400"></span>
        </div>
      </div>
    </div>
  );
};

export default LessonListLoader;
