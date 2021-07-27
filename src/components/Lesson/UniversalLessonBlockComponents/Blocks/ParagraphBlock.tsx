import React, {useContext} from 'react';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import ReactHtmlParser from 'react-html-parser';

import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';

interface ParagraphBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;

  pagePartId: string;
}

export const ParagraphBlock = (props: ParagraphBlockProps) => {
  const {id, value, type} = props;
  const {
    state: {lessonPage: {lessonPageTheme = 'dark', themeTextColor = ''} = {}},
  } = useContext(GlobalContext);

  const Paragraph = ({inputID, inputValue}: any) => {
    return (
      <div className="flex w-auto items-center p-4">
        <p key={inputID} id={inputID} className={`whitespace-pre-wrap ${themeTextColor}`}>
          {ReactHtmlParser(inputValue.value)}
        </p>
      </div>
    );
  };

  const composeParagraph = (inputID: string, inputValue: string, inputType: string) => {
    switch (inputType) {
      default:
        return <Paragraph inputID={inputID} inputValue={inputValue} />;
    }
  };

  return (
    <div className="w-auto">
      {value &&
        value.length > 0 &&
        value.map((v: any, i: number) => (
          <React.Fragment key={`paragraphBlock_${i}`}>
            {composeParagraph(id, v, type)}
          </React.Fragment>
        ))}
    </div>
  );
};
