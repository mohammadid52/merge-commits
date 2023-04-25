import {useGlobalContext} from '@contexts/GlobalContext';
import useAuth from '@customHooks/useAuth';
import useStudentDataValue from 'customHooks/studentDataValue';
import {ContentState, convertToRaw, EditorState} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import React, {useState} from 'react';
import WritingBlock from './WritingBlock';
import WritingExerciseEditor from './WritingExerciseEditor';

interface EditingBlockProps {
  id?: string;
  setFields?: React.Dispatch<React.SetStateAction<{poemHtml: string; poemText: string}>>;
  inputID?: string;
  value?: string;
  options?: any;
}

const EditingBlock = ({options, inputID = '', value}: EditingBlockProps) => {
  const {lessonState} = useGlobalContext();
  const initialState = () => EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState);
  const {isStudent} = useAuth();

  const sendTextToEditor = async (text: string, cb?: any) => {
    insertTextNew(text);
    if (cb) {
      cb();
    }
  };

  const viewingStudent = lessonState.studentViewing;

  const {setDataValue, getDataValue} = useStudentDataValue();

  const onChangeCallback = (html: string, _: string) => {
    setDataValue(inputID, [html]);
  };

  const insertTextNew = (addItem: string) => {
    const data = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const aa = data.concat(`<span><br/>${addItem}</span>`);

    const contentBlock = htmlToDraft(aa);
    const contentState = ContentState.createFromBlockArray(contentBlock?.contentBlocks);

    const updateState = EditorState.createWithContent(contentState);
    setEditorState(updateState);
  };

  const initialValue = viewingStudent ? getDataValue(inputID)[0] : value;

  const isStudentViewing = !isStudent && viewingStudent !== '';

  return (
    <div className="relative flex flex-col justify-between items-center w-full ">
      <div className="relative w-full">
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
        isStudentViewing={isStudentViewing}
        initialValue={initialValue}
        onChangeCallback={onChangeCallback}
        editorState={editorState}
        setEditorState={setEditorState}
      />
    </div>
  );
};

export default EditingBlock;
