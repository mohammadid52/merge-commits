import useStudentDataValue from 'customHooks/studentDataValue';
import React, {useEffect, useState} from 'react';
import WritingExerciseEditor from './WritingExerciseEditor';
import {EditorState, Modifier} from 'draft-js';
import WritingBlock from './WritingBlock';
import {isEmpty} from 'lodash';

interface EditingBlockProps {
  id?: string;
  setFields?: React.Dispatch<React.SetStateAction<{poemHtml: string; poemText: string}>>;
  inputID?: string;
  value?: string;
  options?: any;
}

const EditingBlock = ({options, inputID, value}: EditingBlockProps) => {
  const initialState = () => EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);

  const sendTextToEditor = (text: string, cb?: any) => {
    setEditorState(insertText(text, editorState));
    if (cb) {
      cb();
    }
  };

  const {setDataValue} = useStudentDataValue();

  const onChangeCallback = (html: string, text: string) => {
    setDataValue(inputID, [html]);
  };

  // useEffect(() => {
  //   if (!isEmpty(value)) {
  //     sendTextToEditor(value);
  //   }
  // }, []);

  const insertText = (text: string, editorValue: any) => {
    const currentContent = editorValue.getCurrentContent();
    const currentSelection = editorValue.getSelection();

    const newContent = Modifier.replaceText(currentContent, currentSelection, text);

    const newEditorState = EditorState.push(editorValue, newContent, 'insert-characters');
    return EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());
  };

  return (
    <div className="relative flex flex-col justify-between items-center ">
      <div className="relative">
        {options ? (
          <WritingBlock
            id={inputID}
            sendTextToEditor={sendTextToEditor}
            linestarters={options}
          />
        ) : null}
      </div>
      <WritingExerciseEditor
        minHeight={400}
        initialValue={value}
        onChangeCallback={onChangeCallback}
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </div>
  );
};

export default EditingBlock;
