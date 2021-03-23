import React, { useContext, useEffect, useState } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import WritingBlock from './WritingBlock';
import InstructionBlock from './InstructionBlock';
import EditBlock from './EditBlock';
import Banner from '../../Banner';

type storageObject = {
  title: string;
  editMode: boolean;
  editInput?: string;
  lines?: Array<{
    id: number;
    text: string;
    example: string;
    menuOpen: false;
  }>;
};

const PoemActivity = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const title = state.data.lesson?.activity?.title;

  const [cookies, setCookie] = useCookies([`lesson-${state.syllabusLessonID}`]);
  const [editMode, setEditMode] = useState({
    open: state.componentState.poem && state.componentState.poem.editMode ? state.componentState.poem.editMode : false,
    input: state.componentState.poem && state.componentState.poem.editInput ? state.componentState.poem.editInput : '',
  });
  const { video, link, text } = state.data.lesson.activity.instructions;
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    /**
     *
     *
     * IF YES COOKIE SET
     *
     *
     */
    if (cookies[`lesson-${state.syllabusLessonID}`]?.poem) {
      if (!cookies[`lesson-${state.syllabusLessonID}`]?.poem?.editMode) {
        dispatch({
          type: 'SET_INITIAL_COMPONENT_STATE',
          payload: {
            name: 'poem',
            content: cookies[`lesson-${state.syllabusLessonID}`].poem,
          },
        });
      }

      if (cookies[`lesson-${state.syllabusLessonID}`]?.poem?.editMode) {
        setEditMode((prev) => {
          return {
            ...prev,
            editMode: true,
            input: cookies[`lesson-${state.syllabusLessonID}`].poem.editInput,
          };
        });

        dispatch({
          type: 'SET_INITIAL_COMPONENT_STATE',
          payload: {
            name: 'poem',
            content: cookies[`lesson-${state.syllabusLessonID}`]?.poem,
          },
        });
      }
    }

    /**
     *
     *
     * IF NO COOKIE SET
     *
     *
     */
    if (!cookies[`lesson-${state.syllabusLessonID}`]?.poem && !state.componentState.poem) {
      let storageObj: storageObject = {
        title: '',
        editMode: false,
        editInput: '',
        lines: [],
      };

      dispatch({
        type: 'SET_INITIAL_COMPONENT_STATE',
        payload: {
          name: 'poem',
          content: storageObj,
        },
      });

      setCookie(`lesson-${state.syllabusLessonID}`, {
        ...cookies[`lesson-${state.syllabusLessonID}`],
        poem: storageObj,
      });
    }
  }, []);

  useEffect(() => {
    if (state.componentState.poem && editMode.open === true) {
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'poem',
          inputName: 'editMode',
          content: true,
        },
      });

      setCookie(`lesson-${state.syllabusLessonID}`, {
        ...cookies[`lesson-${state.syllabusLessonID}`],
        poem: {
          ...cookies[`lesson-${state.syllabusLessonID}`].poem,
          editMode: true,
        },
      });
    }
  }, [editMode.open]);

  useEffect(() => {
    if (state.componentState.poem) {
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'poem',
          inputName: 'editInput',
          content: editMode.input,
        },
      });
    }
  }, [editMode.input]);

  return (
    <>
      <div className={theme.section}>
        <Banner title={title} />
        <InstructionBlock editMode={editMode.open} />
        <div className="relative flex flex-col justify-between items-center">
          {!editMode.open ? (
            <WritingBlock editMode={editMode} setEditMode={setEditMode} />
          ) : (
            <EditBlock editMode={editMode} />
          )}
        </div>
      </div>
    </>
  );
};

export default PoemActivity;
