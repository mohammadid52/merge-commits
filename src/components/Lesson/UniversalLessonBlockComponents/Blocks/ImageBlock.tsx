import React from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {getImageFromS3Static} from '../../../../utilities/services';

interface ImageBlockProps extends RowWrapperProps {
  id: string;
  value: any;
}

export const ImageBlock = (props: ImageBlockProps) => {
  const {id, dataIdAttribute, value} = props;
  const {value: url, width = '', height = '', caption = ''} = value;
  const styleAttribute = {
    width: width === 'auto' ? 'auto' : `${width}px`,
    height: height === 'auto' ? 'auto' : `${height}px`,
  };
  return (
    <div id={id} data-id={dataIdAttribute} className={`px-4 py-5 sm:p-6`}>
      <img
        className="mx-auto"
        style={styleAttribute}
        width={width}
        height={height}
        src={getImageFromS3Static(url)}
        alt=""
      />
      <p className="text-center">{caption}</p>
    </div>
  );
};
