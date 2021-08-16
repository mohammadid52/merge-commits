import React from 'react';

const ClassroomLoader = () => {
  return (
    <div className="relative bg-white shadow rounded-lg flex mb-8 text-sm text-darker-gray">
      <div className="animate-pulse space-y-8 flex flex-col">
        <div className="flex flex-col md:flex-row">
          <div className="w-full h-48 md:h-auto sm:w-2.5/10 p-2 bg-gray-400 rounded-tl rounded-bl shadow"></div>
          <div className="w-full sm:w-7.5/10 flex flex-col rounded-b">
            <div className="h-44 p-4 px-5">
              <div className="h-6 bg-gray-400 rounded w-5/10 mb-2"></div>
              <div className="h-4 bg-gray-400 rounded w-full"></div>
            </div>
            <div className="h-8 w-full px-5 bg-transparent border-t-0 border-gray-600 flex justify-between text-base p-2 px-3 rounded-br">
              <div className="flex bg-gray-400 justify-center items-center sm:w-3/10 w-2/5 mr-4 h-full" />
              <div className="flex bg-gray-400 justify-center items-center sm:w-5/10 w-3/5 mr-4 h-full" />
              <div className="flex bg-gray-400 justify-center h-full hidden sm:block" />
            </div>
            <div className="w-full bg-gray-400 block sm:hidden"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomLoader;
