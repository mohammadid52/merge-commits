import React from 'react';

import LoadingMedia from './LoadingMedia';
import Size from './Size';

const VideoMedia = ({attachment, type}: {type: string; attachment: any}) => {
  return attachment.url === 'loading' ? (
    <LoadingMedia size={attachment.size} filename={attachment.filename} />
  ) : (
    <div className="h-auto relative w-72 border-0 p-4 border-gray-300">
      <p className="truncate text-center min-w-auto p-2 pt-0 text-gray-500">
        {attachment.filename}
      </p>
      <Size size={attachment.size} />
      <video controls className="rounded-lg" src={attachment.url}>
        <source type={type} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
export default React.memo(VideoMedia);
