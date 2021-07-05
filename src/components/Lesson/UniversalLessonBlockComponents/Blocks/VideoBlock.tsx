import React from 'react';
import ReactPlayer from 'react-player';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface VideoBlockProps extends RowWrapperProps {
  id: string;
  value: any;
}

export const VideoBlock = (props: VideoBlockProps) => {
  const {id, dataIdAttribute, value} = props;
  const {value: url, height = '560', width = '315'} = value;

  return (
    <div
      id={id}
      data-id={dataIdAttribute}
      className={`px-4 py-5 sm:p-6 flex justify-center`}>
      <ReactPlayer url={url} width={`${width}px`} height={`${height}px`} />
    </div>
  );
};
