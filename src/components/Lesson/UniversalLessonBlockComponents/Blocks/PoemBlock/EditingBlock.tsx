import useStudentDataValue from 'customHooks/studentDataValue';
import {ContentState, convertToRaw, EditorState, Modifier} from 'draft-js';
import React, {useState} from 'react';
import WritingBlock from './WritingBlock';
import WritingExerciseEditor from './WritingExerciseEditor';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import {useGlobalContext} from '@contexts/GlobalContext';

interface EditingBlockProps {
  id?: string;
  setFields?: React.Dispatch<React.SetStateAction<{poemHtml: string; poemText: string}>>;
  inputID?: string;
  value?: string;
  options?: any;
}

const EditingBlock = ({options, inputID, value}: EditingBlockProps) => {
  const {lessonState} = useGlobalContext();
  const initialState = () => EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);

  const sendTextToEditor = async (text: string, cb?: any) => {
    await insertTextNew(text);
    if (cb) {
      cb();
    }
  };

  const viewingStudent = lessonState.studentViewing;

  const {setDataValue, getDataValue} = useStudentDataValue();

  const onChangeCallback = (html: string, text: string) => {
    setDataValue(inputID, [html]);
  };

  const insertTextNew = async (addItem: string) => {
    const data = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const aa = data.concat(`<span><br/>${addItem}</span>`);

    const contentBlock = htmlToDraft(aa);
    const contentState = ContentState.createFromBlockArray(contentBlock?.contentBlocks);

    const updateState = await EditorState.createWithContent(contentState);
    setEditorState(updateState);
  };

  const initialValue = viewingStudent ? getDataValue(inputID)[0] : value;

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
        initialValue={initialValue}
        onChangeCallback={onChangeCallback}
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </div>
  );
};

export default EditingBlock;
