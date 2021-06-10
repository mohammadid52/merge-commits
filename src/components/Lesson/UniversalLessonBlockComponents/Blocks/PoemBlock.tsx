import React, {useContext, useEffect, useState} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import WritingBlock from './PoemBlock/WritingBlock';
import {PagePartInput} from '../../../../interfaces/UniversalLessonInterfaces';

interface PoemBlockProps extends RowWrapperProps {
  id?: string;
  value?: any;
  type?: string;
}

const PoemBlock = (props: PoemBlockProps) => {
  const {id, value} = props;
  const [poemInput, setPoemInput] = useState<PagePartInput[]>([]);

  return (
    <div
      className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center z-50`}>
      <div className="relative flex flex-col justify-between items-center">
        <WritingBlock
          id={id}
          linestarters={value}
          poemInput={poemInput}
          setPoemInput={setPoemInput}
        />
      </div>
    </div>
  );
};

export default PoemBlock;
