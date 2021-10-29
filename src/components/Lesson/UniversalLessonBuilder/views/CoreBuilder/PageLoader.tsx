import times from 'lodash/times';
import map from 'lodash/map';
import React from 'react';

const PageLoader = ({len = 3}: {len?: number}) => {
  return (
    <div className="p-4 max-w-sm w-full mx-auto mt-12">
      <div className="animate-pulse space-y-8 flex flex-col">
        {map(
          times(len, (idx) => (
            <div key={idx} className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-400 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-400 rounded"></div>
                <div className="h-4 bg-gray-400 rounded w-5/6"></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PageLoader;
