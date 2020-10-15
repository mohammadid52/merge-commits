import React from 'react';

interface VideoBlockProps {
  link: string;
  fullscreen: boolean;
}

const VideoBlock = (props: VideoBlockProps) => {
  const { link, fullscreen } = props;

  return (
    <>
      {!fullscreen ? (
        <div className='w-full h-480 rounded-xl'>
          <iframe
            width='w-auto'
            height='480'
            src={link}
            frameBorder='0'
            allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen></iframe>
        </div>
      ) : null}
    </>
  );
};

export default VideoBlock;
