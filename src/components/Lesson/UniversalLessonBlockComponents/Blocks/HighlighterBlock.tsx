import Buttons from '@atoms/Buttons';
import {isEmpty} from '@aws-amplify/core';
import {GlobalContext} from '@contexts/GlobalContext';
import {useULBContext} from '@contexts/UniversalLessonBuilderContext';
import useInLessonCheck from '@customHooks/checkIfInLesson';
import useStudentDataValue from '@customHooks/studentDataValue';
import {RowWrapperProps} from '@interfaces/UniversalLessonBuilderInterfaces';
import {UniversalLessonPage} from '@interfaces/UniversalLessonInterfaces';
import {updateLessonPageToDB} from '@utilities/updateLessonPageToDB';
import {getAsset} from 'assets';
import {findIndex, get} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
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
    lessonState
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
      lessonPlan: [...list.lessonPlan]
    };

    await updateLessonPageToDB(input);
    setSaving(false);
  };

  const onHighlighterBlockCreate = async () => {
    setSaving(true);

    const currentPage: UniversalLessonPage = get(
      switchContext.universalLessonDetails,
      `lessonPlan[${lessonState.currentPage}]`,
      null
    );

    const pageContentIdx = findIndex(
      currentPage?.pageContent,
      (d: any) => d.id === pagePartId
    );

    const pageContent = currentPage.pageContent[pageContentIdx];
    const partContentIdx = findIndex(pageContent?.partContent, (d) => d.id === id);

    const updatedList = updateBlockContentULBHandler(
      pagePartId,
      'partContent',
      'highlighter-input',
      [{id: uuidv4().toString(), value: staticText}],
      position,
      '',
      '',
      pageContentIdx,
      partContentIdx
    );

    await addToDB(updatedList);
  };

  const [saving, setSaving] = useState(false);

  // ##################################################################### //
  // ######################## STUDENT DATA CONTEXT ####################### //
  // ##################################################################### //
  const isStudent = user && user.role === 'ST';
  const [editorState, setEditorState] = useState('');

  const [staticText, setStaticText] = useState('');

  const [loading, setLoading] = useState(true);
  console.log(
    '🚀 ~ file: HighlighterBlock.tsx ~ line 104 ~ HighlighterBlock ~ loading',
    loading
  );

  // ~~~~~~~~~~ INIT DEFAULT STATE ~~~~~~~~~ //
  useEffect(() => {
    if (!isEmpty(value)) {
      setLoading(true);
      setTimeout(() => {
        setDataValue(id, [value[0].value]);
        setEditorState(value[0].value);
        setStaticText(value[0].value);
      }, 300);
      setLoading(false);
    }
  }, [value]);

  // ~~ INIT STUDENT DATA HIGHLIGHTED TEXT ~ //
  useEffect(() => {
    if (editorState !== '') {
      if (getDataValue(id)[0] === '' && isStudent) {
        setLoading(true);
        setDataValue(id, [editorState]);
        setLoading(false);
      }
    }
  }, [editorState]);

  //  LOAD & UNLOAD STUDENT DATA INTO EDITOR  //
  useEffect(() => {
    setTimeout(() => {
      if (isInLesson && !isStudent) {
        setLoading(true);
        const incomingStudentVal = getDataValue(id)[0];
        if (incomingStudentVal !== '') {
          setEditorState(incomingStudentVal);
        } else {
          setEditorState(value[0].value);
        }
        setLoading(false);
      }
    }, 300);
  }, [lessonState.studentData]);

  const features: string[] = ['colorPicker', 'inline'];

  const fetchTeacherValue = () => {
    const currentPage: UniversalLessonPage = get(
      lessonState.lessonData,
      `lessonPlan[${lessonState.currentPage}]`,
      null
    );

    const pageContentIdx = findIndex(
      currentPage?.pageContent,
      (d: any) => d.id === pagePartId
    );

    const pageContent = currentPage.pageContent[pageContentIdx];

    const partContentIdx = findIndex(pageContent?.partContent, (d) => d.id === id);
    const value = pageContent.partContent[partContentIdx].value[0].value;
    setDataValue(id, [value]);

    return value;
  };

  const initialValue =
    isInLesson && isStudent ? editorState || getDataValue(id)[0] : editorState;

  useEffect(() => {
    if (initialValue) {
      setDataValue(id, [initialValue]);
    }
  }, [initialValue]);

  return (
    <div className={` py-4 `}>
      {!loading ? (
        <CustomRichTextEditor
          theme={themeColor}
          fetchTeacherValue={fetchTeacherValue}
          features={features}
          id={id}
          withStyles
          rounded
          customStyle
          dark={theme === 'dark'}
          initialValue={initialValue}
          onChange={
            isInLesson && isStudent
              ? (html) => setDataValue(id, [html])
              : (html) => setStaticText(html)
          }
        />
      ) : null}
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
