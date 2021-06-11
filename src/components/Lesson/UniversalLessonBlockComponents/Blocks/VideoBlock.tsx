import React from 'react';
import ReactPlayer from 'react-player';
import {
  RowWrapperProps,
} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface VideoBlockProps extends RowWrapperProps {
  id: string;
  value: any;
}

export const VideoBlock = (props: VideoBlockProps) => {
  const {id, dataIdAttribute, value} = props;
  const {url, size = ''} = value;
  const width: string = size ? `${size.split(' x ')[0]}px` : '315px';
  const height: string = size ? `${size.split(' x ')[1]}px` : '560px';
  return (
    <div
      id={id}
      data-id={dataIdAttribute}
      className={`px-4 py-5 sm:p-6 flex justify-center`}>
      <ReactPlayer url={url} width={width} height={height} />
    </div>
  );
};
