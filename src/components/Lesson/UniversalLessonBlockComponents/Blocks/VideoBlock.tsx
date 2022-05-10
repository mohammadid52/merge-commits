import React from 'react';
import ReactPlayer from 'react-player';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface VideoBlockProps extends RowWrapperProps {
  id: string;
  value: any;
}

export const VideoBlock = (props: VideoBlockProps) => {
  const {id, dataIdAttribute} = props;

  const {value: url, height = '560', width = '315'} = props.value[0];

  return (
    <div
      id={id}
      data-id={dataIdAttribute}
      className={`bg-component-dark border-0 border-gray-700 px-4 py-5 rounded-2xl sm:p-6 flex justify-center`}>
      {url && <ReactPlayer url={url} width={`${width}px`} height={`${height}px`} />}
    </div>
  );
};
