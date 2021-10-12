import {stringify} from 'querystring';
import React, {useEffect, useState} from 'react';

import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {getImageFromS3Static} from '../../../../utilities/services';

interface ImageBlockProps extends RowWrapperProps {
  id: string;
  value: any;
  customVideo?: boolean;
}

export const ImageBlock = (props: ImageBlockProps) => {
  const {id, dataIdAttribute, value} = props;
  const [imageState, setImageState] = useState<{
    url: string;
    width: string;
    height: string;
    caption: string;
  }>({url: '', width: '', height: '', caption: ''});

  useEffect(() => {
    if (value && value.length > 0) {
      let {value: url, width = '', height = '', caption = ''} = value[0];
      setImageState({
        url: url,
        width: width,
        height: height,
        caption: caption,
      });
    }
  }, [value]);

  const styleAttribute = {
    width: imageState.width === 'auto' ? 'auto' : `${imageState.width}px`,
    height: imageState.height === 'auto' ? 'auto' : `${imageState.height}px`,
  };

  return (
    <div id={id} data-id={dataIdAttribute} className={`px-4 py-5 sm:p-6`}>
      {imageState.url && (
        <img
          className="mx-auto"
          style={styleAttribute}
          width={imageState.width}
          height={imageState.height}
          src={getImageFromS3Static(imageState.url)}
          alt=""
        />
      )}

      <p className="text-center">{imageState.caption}</p>
    </div>
  );
};
