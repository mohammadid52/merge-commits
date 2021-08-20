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
  const {previewMode} = useULBContext();

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
      if (getStudentDataValue(id)[0] === '' && isStudent) {
        handleUpdateStudentData(id, [editorState]);
      }
    }
  }, [editorState]);

  //  LOAD & UNLOAD STUDENT DATA INTO EDITOR  //
  useEffect(() => {
    if (isInLesson && !isStudent) {
      const incomingStudentVal = getStudentDataValue(id)[0];
      if (incomingStudentVal !== '') {
        setEditorState(incomingStudentVal);
      } else {
        setEditorState(value[0].value);
      }
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
  // useEffect(() => {
  //   window.addEventListener('beforeunload', function (e) {
  //     var confirmationMessage =
  //       'It looks like you have been editing something. ' +
  //       'If you leave before saving, your changes will be lost.';

  //     (e || window.event).returnValue = confirmationMessage; //Gecko + IE
  //     return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
  //   });
  // },[]);
  return (
    <div className={`p-4`}>
      <CustomRichTextEditor
        theme={themeColor}
        features={features}
        withStyles
        rounded
        customStyle
        dark={theme === 'dark'}
        initialValue={isInLesson && isStudent ? getStudentDataValue(id)[0] : editorState}
        onChange={
          isInLesson && isStudent
            ? (html) => handleUpdateStudentData(id, [html])
            : () => {}
        }
      />
      {!isInLesson && !previewMode && (
        <div className="w-auto flex items-center justify-end mt-4">
          <Buttons
            onClick={onHighlighterBlockCreate}
            label={saving ? 'saving' : 'save'}
          />
        </div>
      )}
      {/* {!isInLesson && !previewMode && (
        <span className="w-auto relative inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className="w-auto inline-flex items-center px-4 py-2 border-0  text-base leading-6 font-medium rounded-md transition ease-in-out duration-150 ">
            Save
          </button>
          <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full iconoclast:bg-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 iconoclast:bg-main"></span>
          </span>
        </span>
      )} */}
    </div>
  );
};

export default HighlighterBlock;
