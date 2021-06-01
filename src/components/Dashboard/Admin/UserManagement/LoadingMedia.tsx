import React from 'react';

import Loader from '../../../Atoms/Loader';
import Size from './Size';

const LoadingMedia = ({filename, size}: any) => {
  return (
    <div className="relative h-40 w-auto max-w-56 flex-col border-0 border-gray-300 hover:border-gray-400 rounded-lg p-2 min-h-48 min-w-48 flex items-center justify-center">
      <div className="h-2/10 min-w-auto p-2 pt-0 text-gray-500 truncate">{filename}</div>
      <div className="h-8/10 flex items-center min-w-48 bg-gray-100 rounded-lg">
        <Loader color="#6366F1" />
      </div>
      <Size size={size} />
    </div>
  );
};

export default LoadingMedia;
