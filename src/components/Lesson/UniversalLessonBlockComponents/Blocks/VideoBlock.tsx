import React from 'react';
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
  const width: string = `${size.split(' x ')[0]}px` || '315';
  const height: string = `${size.split(' x ')[1]}px` || '560';
  return (
    <p
      id={id}
      data-id={dataIdAttribute}
      className={`bg-white bg-opacity-20 px-4 py-5 sm:p-6`}>
      <iframe
        width={width}
        height={height}
        title={'video'}
        frameBorder="0"
        src={url}
        allowFullScreen></iframe>
    </p>
  );
};
