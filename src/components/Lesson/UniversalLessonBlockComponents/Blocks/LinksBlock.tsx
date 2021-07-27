import React, {useContext} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import {LinkPreview} from '@dhaiwat10/react-link-preview';

interface LinksBlockProps extends RowWrapperProps {
  id?: string;
  type?: string;
  value?: {id: string; type: string; label: string; value: string}[];
}

const LinksBlock = (props: LinksBlockProps) => {
  const {id, value} = props;
  const {
    state: {lessonPage: {theme: lessonPageTheme = '', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);
  const iconColor = lessonPageTheme === 'light' ? 'black' : 'white';

  const isDark = lessonPageTheme !== 'light';

  return (
    <div id={id} className="h-full w-full flex flex-col items-center rounded-lg">
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
                  key={`${id}_${key}`}
                  className="h-full p-2 flex justify-center items-start px-4">
                  <LinkPreview url={item.value} />
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default LinksBlock;
