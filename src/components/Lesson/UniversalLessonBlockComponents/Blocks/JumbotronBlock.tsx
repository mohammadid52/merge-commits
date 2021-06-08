import React from 'react';
import {
  RowComposerProps,
  RowWrapperProps,
} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import QuoteBlock from '../../LessonComponents/Intro/QuoteBlock';

interface JumbotronBlockProps extends RowWrapperProps {
  id?: string;
  value?: string;
  type?: string;
}

export const JumbotronBlock = (props: JumbotronBlockProps) => {
  const {id, value} = props;
  return (
    <div
      className="h-96 flex flex-col mb-4 justify-between items-center bg-cover bg-right-top rounded-xl z-10"
      style={{backgroundImage: `url()`}}>
      <QuoteBlock />
    </div>
  )
}