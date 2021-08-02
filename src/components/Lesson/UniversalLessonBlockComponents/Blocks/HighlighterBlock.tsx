import React, {useContext, useState} from 'react';
import {RowWrapperProps} from '../../../../interfaces/UniversalLessonBuilderInterfaces';
import RichTextEditor from '../../../Atoms/RichTextEditor';
import {isEmpty} from '@aws-amplify/core';
import {GlobalContext} from '../../../../contexts/GlobalContext';
import Buttons from '../../../Atoms/Buttons';
import {updateLessonPageToDB} from '../../../../utilities/updateLessonPageToDB';
import {v4 as uuidv4} from 'uuid';
import {useULBContext} from '../../../../contexts/UniversalLessonBuilderContext';
import {getAsset} from '../../../../assets';
import CustomRichTextEditor from './HighlighterBlock/CustomRichTextEditor';
import {useEffect} from 'react';
import useInLessonCheck from '../../../../customHooks/checkIfInLesson';
import {StudentPageInput} from '../../../../interfaces/UniversalLessonInterfaces';

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

  const {
    clientKey,
    state: {user, lessonPage: {theme = 'dark'} = {}},
    lessonState,
    lessonDispatch,
  } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  // ##################################################################### //
  // ########################## ULB FUNCTIONS ? ########################## //
  // ##################################################################### //
  /**
   * TODO:
   *  These functions should not be 'inside' the actual lesson-component
   *  Please remove/refactor them to be at the builder level
   */
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

  const [saving, setSaving] = useState(false);

  // ##################################################################### //
  // ######################## STUDENT DATA CONTEXT ####################### //
  // ##################################################################### //
  const isStudent = user && user.role === 'ST';
  const isInLesson = useInLessonCheck();
  const [editorState, setEditorState] = useState(!isEmpty(value) ? value[0].value : '');

  // ~~ INIT STUDENT DATA HIGHLIGHTED TEXT ~ //
  useEffect(() => {
    if (!isEmpty(value)) {
      if (getStudentDataValue(id)[0] === '' && isStudent) {
        handleUpdateStudentData(id, [editorState]);
      }
    }
  }, [editorState]);

  useEffect(() => {
    if (isInLesson && !isStudent) {
      const valval = getStudentDataValue(id)[0];
      setEditorState(valval);
    }
  }, [lessonState.studentData]);

  // ~~~~~~~~~~~ UPDATE FUNCTION ~~~~~~~~~~~ //
  const handleUpdateStudentData = (domID: string, input: string[]) => {
    lessonDispatch({
      type: 'UPDATE_STUDENT_DATA',
      payload: {
        pageIdx: lessonState.currentPage,
        data: {
          domID: domID,
          input: input,
        },
      },
    });
  };

  // ~~~~~~~~~~~~~ GET FUNCTION ~~~~~~~~~~~~ //
  const getStudentDataValue = (domID: string) => {
    const pageData = lessonState.studentData[lessonState.currentPage];
    const getInput = pageData
      ? pageData.find((inputObj: StudentPageInput) => inputObj.domID === domID)
      : undefined;
    if (getInput) {
      return getInput?.input;
    } else {
      return [''];
    }
  };

  const features: string[] = ['colorPicker', 'remove', 'inline'];

  return (
    <div className={`p-4`}>
      <CustomRichTextEditor
        theme={themeColor}
        features={features}
        rounded
        customStyle
        dark={theme === 'dark'}
        // initialValue={editorState}
        initialValue={isInLesson && isStudent ? getStudentDataValue(id)[0] : editorState}
        onChange={
          isInLesson && isStudent
            ? (html) => handleUpdateStudentData(id, [html])
            : () => {}
        }
      />
      {!isInLesson && (
        <div className="w-auto flex items-center justify-end">
          <Buttons
            onClick={onHighlighterBlockCreate}
            label={saving ? 'saving' : 'save'}
          />
        </div>
      )}
    </div>
  );
};

export default HighlighterBlock;
