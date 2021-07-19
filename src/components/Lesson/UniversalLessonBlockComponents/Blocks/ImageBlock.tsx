import React, {useEffect, useState} from 'react';
import useOnScreen from '../../../../customHooks/useOnScreen';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {getImageFromS3Static} from '../../../../utilities/services';

interface ImageBlockProps extends RowWrapperProps {
  id: string;
  value: any;
  customVideo?: boolean;
}

export const ImageBlock = (props: ImageBlockProps) => {
  const {id, dataIdAttribute, customVideo = false, value} = props;

  const {value: url, width = '', height = '', caption = ''} = value;

  const styleAttribute = {
    width: width === 'auto' ? 'auto' : `${width}px`,
    height: height === 'auto' ? 'auto' : `${height}px`,
  };

  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = React.useRef(null);
  const isVideoOnScreen = useOnScreen(videoRef);

  const [showPIP, setShowPIP] = useState(false);
  console.log('🚀 ~ file: ImageBlock.tsx ~ line 28 ~ ImageBlock ~ showPIP', showPIP);

  useEffect(() => {
    if (isPlaying) {
      if (!isVideoOnScreen) {
        setShowPIP(true);
      } else {
        setShowPIP(false);
      }
    }
  }, [isVideoOnScreen, isPlaying]);

  // if playing and if not on screen show pip
  // if playing and on screen hide pip

  useEffect(() => {
    if (showPIP) {
      // @ts-ignore
      if (document?.pictureInPictureEnabled) {
        videoRef?.current?.requestPictureInPicture();
      }
    } else {
      // @ts-ignore
      if (document.pictureInPictureElement) {
        // @ts-ignore
        document?.exitPictureInPicture();
      }
    }
  }, [showPIP]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('playing', () => {
        setIsPlaying(true);
      });
      videoRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
      });
    }
    return videoRef.current.addEventListener('pause', () => {
      setIsPlaying(false);
    });
  }, [videoRef.current]);

  return (
    <div id={id} data-id={dataIdAttribute} className={`px-4 py-5 sm:p-6`}>
      {customVideo ? (
        <video
          width={width}
          ref={videoRef}
          height={height}
          controls
          className="rounded-lg"
          src={getImageFromS3Static(url)}>
          <source />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          className="mx-auto"
          style={styleAttribute}
          width={width}
          height={height}
          src={getImageFromS3Static(url)}
          alt=""
        />
      )}
      <p className="text-center">{caption}</p>
    </div>
  );
};
