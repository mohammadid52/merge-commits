import React from 'react';

const InstitutionRowLoader = () => {
  return (
    <div className="animate-pulse space-y-8 flex flex-col">
      <div className="flex justify-between bg-white w-full border-b-0 border-gray-200">
        <div className="w-3/10 px-8 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 flex items-center rounded-full bg-gray-400"></div>
            <div className="ml-2">
              <div className="bg-gray-400 w-32 h-4"></div>
            </div>
          </div>
        </div>
        <div className="w-1.5/10 flex justify-left items-center px-8 py-4 whitespace-nowrap">
          <div className="w-16 flex h-4 bg-gray-400"></div>
        </div>
        <div className="w-3.5/10 flex justify-left items-center px-8 py-4 whitespace-nowrap">
          <div className="flex h-4 bg-gray-400" />
        </div>
        <div className="w-1.5/10 flex justify-left items-center px-8 py-4 whitespace-nowrap">
          <span className="flex h-4 bg-gray-400"></span>
        </div>
        <div className="w-1/10 flex justify-left items-center px-8 py-4 whitespace-nowrap">
          <div className={`flex justify-left bg-gray-400 h-4`} />
        </div>
      </div>
    </div>
  );
};

export default InstitutionRowLoader;
