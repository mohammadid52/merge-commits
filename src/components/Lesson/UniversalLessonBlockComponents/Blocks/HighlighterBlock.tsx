import {isEmpty} from '@aws-amplify/core';
import useStudentDataValue from '@customHooks/studentDataValue';
import React, {useContext, useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import {getAsset} from 'assets';
import {GlobalContext} from '@contexts/GlobalContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import {RowWrapperProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import Buttons from '@atoms/Buttons';
import CustomRichTextEditor from './HighlighterBlock/CustomRichTextEditor';

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
  } = useContext(GlobalContext);

  const themeColor = getAsset(clientKey, 'themeClassName');
  const isInLesson = useInLessonCheck();

  const switchContext = isInLesson ? undefined : useULBContext();
  const previewMode = isInLesson ? false : switchContext.previewMode;

  const {getDataValue, setDataValue} = useStudentDataValue();

  // ~~~~~~~~~~~~~~~~ PAGES ~~~~~~~~~~~~~~~~ //

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
  const [editorState, setEditorState] = useState('');

  // ~~~~~~~~~~ INIT DEFAULT STATE ~~~~~~~~~ //
  useEffect(() => {
    if (!isEmpty(value)) {
      setEditorState(value[0].value);
    }
  }, [value]);

  // ~~ INIT STUDENT DATA HIGHLIGHTED TEXT ~ //
  useEffect(() => {
    if (editorState !== '') {
      if (getDataValue(id)[0] === '' && isStudent) {
        setDataValue(id, [editorState]);
      }
    }
  }, [editorState]);

  //  LOAD & UNLOAD STUDENT DATA INTO EDITOR  //
  useEffect(() => {
    if (isInLesson && !isStudent) {
      const incomingStudentVal = getDataValue(id)[0];
      if (incomingStudentVal !== '') {
        setEditorState(incomingStudentVal);
      } else {
        setEditorState(value[0].value);
      }
    }
  }, [lessonState.studentData]);

  const features: string[] = ['colorPicker', 'inline'];

  return (
    <div className={` py-4 `}>
      <CustomRichTextEditor
        theme={themeColor}
        features={features}
        withStyles
        rounded
        customStyle
        dark={theme === 'dark'}
        initialValue={isInLesson && isStudent ? getDataValue(id)[0] : editorState}
        onChange={isInLesson && isStudent ? (html) => setDataValue(id, [html]) : () => {}}
      />
      {!isInLesson && !previewMode && (
        <div className="w-auto flex items-center justify-end mt-4">
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
