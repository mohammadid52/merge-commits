import {RowWrapperProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import React from 'react';
import ReactPlayer from 'react-player';

interface VideoBlockProps extends RowWrapperProps {
  id: string;
  value: any;
}

export const VideoBlock = (props: VideoBlockProps) => {
  const {id, dataIdAttribute} = props;

  const {value: url, height = '560', width = '315'} = props.value[0];

  return (
    <div id={id} data-id={dataIdAttribute} className={``}>
      {url && <ReactPlayer url={url} width={`${width}px`} height={`${height}px`} />}
    </div>
  );
};
