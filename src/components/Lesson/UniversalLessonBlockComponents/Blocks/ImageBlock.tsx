import React from 'react';
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
  return (
    <div id={id} data-id={dataIdAttribute} className={`px-4 py-5 sm:p-6`}>
      {customVideo ? (
        <video
          width={width}
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
