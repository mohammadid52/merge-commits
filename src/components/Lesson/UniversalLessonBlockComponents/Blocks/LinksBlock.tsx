import {LinkPreview} from '@dhaiwat10/react-link-preview';
import {RowWrapperProps} from 'interfaces/UniversalLessonBuilderInterfaces';
import React from 'react';

interface LinksBlockProps extends RowWrapperProps {
  id?: string;
  type?: string;
  value?: {id: string; type: string; label: string; value: string}[];
}

const LinksBlock = (props: LinksBlockProps) => {
  const {id, value} = props;

  return (
    <div className="h-full w-full flex flex-col items-center rounded-lg">
      <div className="w-full h-full flex flex-row items-center justify-center">
        <div className="h-full w-full flex flex-row">
          {value &&
            value.length > 0 &&
            value.map(
              (
                item: {id: string; type: string; label: string; value: string},
                key: number
              ) => (
                <div
                  id={id + 'custom'}
                  key={`${id}_${key}`}
                  className="h-full  p-2 flex justify-center items-start px-4">
                  <LinkPreview url={item.value} height={400} imageHeight={200} />
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default LinksBlock;
