import React, {useContext} from 'react';
import {GlobalContext} from '@contexts/GlobalContext';
import {RowWrapperProps} from '@interfaces/UniversalLessonBuilderInterfaces';

interface ParagraphBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
  pagePartId: string;
}

export const ParagraphBlock = (props: ParagraphBlockProps) => {
  const {id, value, type} = props;
  const {
    state: {lessonPage: {themeTextColor = ''} = {}},
  } = useContext(GlobalContext);

  const Paragraph = ({inputID, inputValue}: any) => {
    return (
      <div className="flex w-auto items-center p-4 paragraph-block">
        <p
          key={inputID}
          id={inputID}
          dangerouslySetInnerHTML={{__html: inputValue?.value || '<p></p>'}}
          className={`whitespace-pre-wrap remove-white-bg ${themeTextColor}`}></p>
      </div>
    );
  };

  return (
    <div className="w-auto">
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) => (
          <React.Fragment key={`paragraphBlock_${i}`}>
            {/* {composeParagraph(id, v, type)} */}
            <Paragraph inputID={id} inputValue={v} />
          </React.Fragment>
        ))}
    </div>
  );
};
