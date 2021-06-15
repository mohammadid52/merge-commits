import React, { useState } from 'react';
import { FinalText, SelectedTextGroup } from '../../LessonComponents/LyricsPage/LyricsModules/LyricsActivity';
import SelectableBlock from './HighlighterBlock/SelectableBlock';
import HighlightColorBlock from './HighlighterBlock/HighlightColorBlock';
import { RowWrapperProps } from '../../../../interfaces/UniversalLessonBuilderInterfaces';

type SelectObject = {
  id?: string | number;
  anchor: string;
  focus: string;
  color: string;
  content: Array<{id: string | number; text: string}>;
};

interface HighlighterBlockProps extends RowWrapperProps {
  id?: string;
  type?: string;
  value?: any;
}

const HighlighterBlock = (props: HighlighterBlockProps) => {
  const {id, value} = props;
  const [color, setColor] = useState('');
  const [selected, setSelected] = useState<Array<SelectObject>>([]);

  //  text
  const [finalText, setFinalText] = useState<FinalText>({});
  const [initialSelectedText, setInitialSelectedText] = useState<SelectedTextGroup>({});
  const [selectGroup, setSelectGroup] = useState<number>(0);

  return (
    <div className={`p-4`}>
      <HighlightColorBlock
        color={color}
        setColor={setColor}
      />
      <SelectableBlock
        rawText={value && value.length > 0 ? value[0] : ''}
        color={color}
        selected={selected}
        setSelected={setSelected}
        initialSelectedText={initialSelectedText}
        setInitialSelectedText={setInitialSelectedText}
        finalText={finalText}
        setFinalText={setFinalText}
        selectGroup={selectGroup}
        setSelectGroup={setSelectGroup}
      />
    </div>
  );
};

export default HighlighterBlock;
