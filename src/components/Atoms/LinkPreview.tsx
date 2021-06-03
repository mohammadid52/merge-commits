// @ts-ignore
import {ReactTinyLink} from 'react-tiny-link';
import React from 'react';

interface LinkPreviewProps {
  url: string;
  showGraphic?: boolean;
}

const LinkPreview = ({url, showGraphic = true}: LinkPreviewProps) => {
  if (url) {
    return (
      <ReactTinyLink
        cardSize="small"
        showGraphic={showGraphic}
        maxLine={2}
        minLine={1}
        url={url}
      />
    );
  } else {
    <a href={url}>{url}</a>;
  }
};

export default LinkPreview;
