import React, { useState, useEffect, useRef } from 'react';

interface VideoBlockProps {
  link: string;
  fullscreen: boolean;
}

const VideoBlock = (props: VideoBlockProps) => {
  const { link, fullscreen } = props;

   /**
   * Specific code for making toolbar sticky
   */
  const [isSticky, setSticky] = useState(false);
  const ref = useRef(null);

  const handleScroll = () => {
    if (ref.current) {
      setSticky(ref.current.getBoundingClientRect().bottom <= 24);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  return (
    <>
      {!fullscreen ? (
        <div ref={ref} className={`z-50 w-128 rounded-xl`} style={{height: '320px'}}>
          <iframe
            className={`${isSticky ? 'fixed z-50 top-4 right-2 w-1/4 h-1/4' : ''} rounded-xl`}
            height='320'
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
