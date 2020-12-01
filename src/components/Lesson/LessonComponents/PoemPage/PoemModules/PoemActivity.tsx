import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import WritingBlock from './WritingBlock';
import InstructionBlock from './InstructionBlock';
import ToolBar from './ToolBar';
import Banner from './Banner';
import EditBlock from './EditBlock';
import InstructionsPopup from '../../../Popup/InstructionsPopup';

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
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
  const [editMode, setEditMode] = useState({
    open:
      state.componentState.poem && state.componentState.poem.editMode
        ? state.componentState.poem.editMode
        : false,
    input:
      state.componentState.poem && state.componentState.poem.editInput
        ? state.componentState.poem.editInput
        : '',
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
    if (cookies[`lesson-${state.classroomID}`]?.poem) {
      if (!cookies[`lesson-${state.classroomID}`]?.poem?.editMode) {
        dispatch({
          type: 'SET_INITIAL_COMPONENT_STATE',
          payload: {
            name: 'poem',
            content: cookies[`lesson-${state.classroomID}`].poem,
          },
        });
      }

      if (cookies[`lesson-${state.classroomID}`]?.poem?.editMode) {
        setEditMode((prev) => {
          return {
            ...prev,
            editMode: true,
            input: cookies[`lesson-${state.classroomID}`].poem.editInput,
          };
        });

        dispatch({
          type: 'SET_INITIAL_COMPONENT_STATE',
          payload: {
            name: 'poem',
            content: cookies[`lesson-${state.classroomID}`]?.poem,
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
    if (!cookies[`lesson-${state.classroomID}`]?.poem && !state.componentState.poem) {
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

      setCookie(`lesson-${state.classroomID}`, {
        ...cookies[`lesson-${state.classroomID}`],
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

      setCookie(`lesson-${state.classroomID}`, {
        ...cookies[`lesson-${state.classroomID}`],
        poem: {
          ...cookies[`lesson-${state.classroomID}`].poem,
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
      {/* <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/> */}
      <div className={theme.section}>
        <Banner />
        <InstructionBlock editMode={editMode.open} />
        <div className='relative flex flex-col justify-between items-center'>
          {!editMode.open ? (
            <WritingBlock editMode={editMode} setEditMode={setEditMode} />
          ) : (
            <EditBlock editMode={editMode} />
          )}

          {/* <ToolBar editMode={editMode} setEditMode={setEditMode} /> */}
        </div>
      </div>
    </>
  );
};

export default PoemActivity;
