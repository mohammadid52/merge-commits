import {Image} from 'antd';
import {RowWrapperProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import {useEffect, useState} from 'react';
import {getImageFromS3Static} from 'utilities/services';

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
        caption: caption
      });
    }
  }, [value]);

  const styleAttribute = {
    width: imageState.width === 'auto' ? '100%' : `${imageState.width}px`,
    height: imageState.height === 'auto' ? '100%' : `${imageState.height}px`
  };

  return (
    <div id={id} data-id={dataIdAttribute} className={``}>
      <Image style={styleAttribute} src={getImageFromS3Static(imageState.url)} />

      {imageState.caption && <p className="text-left mt-2">{imageState.caption}</p>}
    </div>
  );
};
