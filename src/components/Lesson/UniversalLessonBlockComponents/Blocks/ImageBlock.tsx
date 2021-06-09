import React from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface VideoBlockProps extends RowWrapperProps {
  id: string;
  value: any;
}

export const ImageBlock = (props: VideoBlockProps) => {
  const {id, dataIdAttribute, value} = props;
  const {url, width = '', height = '', caption = ''} = value;
  return (
    <div
      id={id}
      data-id={dataIdAttribute}
      className={`bg-white bg-opacity-20 px-4 py-5 sm:p-6`}>
      <img
        className="mx-auto"
        style={{width: `${width}px`, height: `${height}px`}}
        width={width}
        height={height}
        src={url}
        alt=""
      />
      <p className="text-center">{caption}</p>
    </div>
  );
};
