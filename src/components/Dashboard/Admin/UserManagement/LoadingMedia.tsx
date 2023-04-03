import React from 'react';

import Loader from 'atoms/Loader';
import Size from './Size';

const LoadingMedia = ({filename, size}: any) => {
  return (
    <div className="relative h-40 w-auto max-w-56 flex-col border-0 border-lightest  hover:border-light  rounded-lg p-2 min-h-48 min-w-48 flex items-center justify-center">
      <div className="h-2/10 min-w-auto p-2 pt-0 text-medium  truncate">{filename}</div>
      <div className="h-8/10 flex items-center min-w-48 bg-lightest  rounded-lg">
        <Loader />
      </div>
      <Size size={size} />
    </div>
  );
};

export default LoadingMedia;
