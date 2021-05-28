import React from 'react';
import LoadingMedia from './LoadingMedia';
import Size from './Size';

const ImageMedia = ({attachment}: any) => {
  return attachment.url === 'loading' ? (
    <LoadingMedia size={attachment.size} filename={attachment.filename} />
  ) : (
    <div className="relative h-40 w-auto max-w-56 flex-col border-0 border-gray-300 hover:border-gray-400 rounded-lg p-2 min-h-48 min-w-32 flex items-center justify-center">
      <p className="truncate min-w-auto text-center p-2 pt-0 text-gray-500">
        {attachment.filename}
      </p>

      <Size size={attachment.size} />
      <img
        style={{objectFit: 'cover'}}
        className="h-32 w-auto rounded-lg"
        src={attachment.url}
        id="output_image2"
      />
    </div>
  );
};

export default ImageMedia;
