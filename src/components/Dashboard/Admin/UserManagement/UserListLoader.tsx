import React from 'react';

const UserListLoader = () => {
  return (
    <div className="animate-pulse space-y-8 flex flex-col">
      <div className="flex justify-between bg-white w-full border-b-0 border-gray-200">
        <div className="w-4/10 px-8 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 flex items-center rounded-full bg-gray-400"></div>
            <div className="ml-2">
              <div className="bg-gray-400 w-32 h-3"></div>
              <div className="bg-gray-400 w-44 h-3 mt-1"></div>
            </div>
          </div>
        </div>
        <div className="w-2/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <div className="w-16 flex h-4 bg-gray-400"></div>
        </div>
        <div className="w-2/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <div className="w-16 flex h-4 bg-gray-400" />
        </div>
        <div className="w-2/10 flex justify-center items-center px-8 py-4 whitespace-nowrap">
          <span className="w-16 flex h-4 bg-gray-400"></span>
        </div>
      </div>
    </div>
  );
};

export default UserListLoader;
