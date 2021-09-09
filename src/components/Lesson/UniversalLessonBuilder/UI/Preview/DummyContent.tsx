import {times} from 'lodash';
import React from 'react';

const DummyContent = ({len = 1}: {len?: number}) => {
  return (
    <div className="max-w-sm w-full mx-auto mt-6">
      <div className="space-y-8 flex flex-col">
        {times(len, (idx) => (
          <div key={idx} className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-400 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-400 rounded"></div>
              <div className="h-4 bg-gray-400 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DummyContent;
