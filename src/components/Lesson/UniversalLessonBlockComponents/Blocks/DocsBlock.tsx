import {getImageFromS3Static} from 'utilities/services';
import React from 'react';
// @ts-ignore
import FileViewer from 'react-file-viewer';

const getExtension = (fname: string) =>
  fname.slice(((fname.lastIndexOf('.') - 1) >>> 0) + 2);

const DocsBlock = (props: any) => {
  const {value} = props;
  const docsData = value[0];
  const type = getExtension(docsData.value);

  const file = getImageFromS3Static('ULB/' + docsData.value);

  return (
    <div style={{color: '#000'}} className={`border-0 border-gray-700  rounded-md`}>
      <FileViewer
        fileType={type}
        onError={(err: any) => console.error(err)}
        filePath={file}
      />
    </div>
  );
};

export default DocsBlock;
