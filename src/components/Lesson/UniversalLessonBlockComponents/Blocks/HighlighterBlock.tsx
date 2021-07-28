import React, {useContext, useState} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import RichTextEditor from '../../../Atoms/RichTextEditor';
import {isEmpty} from '@aws-amplify/core';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import Buttons from '../../../Atoms/Buttons';
import {updateLessonPageToDB} from '../../../../utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';

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
  pagePartId?: string;
  value?: any;
  position?: number;
}

const HighlighterBlock = (props: HighlighterBlockProps) => {
  const {id, value, pagePartId, updateBlockContentULBHandler, position} = props;

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const {
    state: {lessonPage: {theme = 'dark'} = {}},
  } = useContext(GlobalContext);

  const [editorState, setEditorState] = useState(!isEmpty(value) ? value[0].value : '');

  const addToDB = async (list: any) => {
    const input = {
      id: list.id,
      lessonPlan: [...list.lessonPlan],
    };

    await updateLessonPageToDB(input);
    setSaving(false);
  };

  const onHighlighterBlockCreate = async () => {
    setSaving(true);
    const updatedList = updateBlockContentULBHandler(
      pagePartId,
      'partContent',
      'highlighter-input',
      [{id: uuidv4().toString(), value: editorState}],
      position
    );

    await addToDB(updatedList);
  };

  const onEditorStateChange = (html: string) => {
    setEditorState(html);
  };

  const features: string[] = ['colorPicker', 'remove', 'inline'];

  const [saving, setSaving] = useState(false);

  return (
    <div className={`p-4`}>
      <RichTextEditor
        features={features}
        rounded
        customStyle
        dark={theme === 'dark'}
        initialValue={editorState}
        onChange={(html) => onEditorStateChange(html)}
      />
      <div className="w-auto flex items-center justify-end">
        <Buttons onClick={onHighlighterBlockCreate} label={saving ? 'saving' : 'save'} />
      </div>
    </div>
  );
};

export default HighlighterBlock;
