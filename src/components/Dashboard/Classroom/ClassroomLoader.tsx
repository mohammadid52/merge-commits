import React from 'react';

const ClassroomLoader = () => {
  return (
    <div className="relative h-72 bg-white customShadow  rounded-xl flex mb-8 text-sm text-darker-gray">
      <div className="animate-pulse h-full space-y-8 flex flex-col">
        <div className="flex h-full flex-col md:flex-row">
          <div className="w-full  sm:min-h-48  sm:w-2.5/10 p-2 bg-gray-400 rounded-tl-xl rounded-bl-xl shadow"></div>
          <div className="w-full relative sm:w-7.5/10 flex flex-col rounded-b">
            <div className="h-44 p-4 px-5">
              <div className="h-6 bg-gray-400 rounded w-5/10 mb-2"></div>
              <div className="h-4 bg-gray-400 mb-1 rounded w-full"></div>
              <div className="h-4 bg-gray-400 mb-1 rounded w-full"></div>
              <div className="h-4 bg-gray-400 mb-1 rounded w-full"></div>
            </div>

            <div className="h-8 absolute bottom-0 w-full bg-transparent border-t-0 border-gray-200 flex justify-between text-base p-2 px-3 rounded-br">
              <div className="flex bg-gray-400 justify-center items-center  w-1/3 mr-4 h-full" />
              <div className="flex bg-gray-400 justify-center items-center  w-1/3 mr-4 h-full" />
              <div className=" bg-gray-400 justify-center h-full  w-1/3" />
            </div>
            <div className="w-full bg-gray-400 block sm:hidden"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomLoader;
