import React, { useContext, useEffect, useState } from 'react';


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

const PoemBlock = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  // useEffect(() => {
    /**
     *
     *
     * IF YES COOKIE SET
     *
     *
     */
    // if (cookies[`lesson-${state.syllabusLessonID}`]?.poem) {
    //   if (!cookies[`lesson-${state.syllabusLessonID}`]?.poem?.editMode) {
    //     dispatch({
    //       type: 'SET_INITIAL_COMPONENT_STATE',
    //       payload: {
    //         name: 'poem',
    //         content: cookies[`lesson-${state.syllabusLessonID}`].poem,
    //       },
    //     });
    //   }
    //
    //   if (cookies[`lesson-${state.syllabusLessonID}`]?.poem?.editMode) {
    //     setEditMode((prev) => {
    //       return {
    //         ...prev,
    //         editMode: true,
    //         input: cookies[`lesson-${state.syllabusLessonID}`].poem.editInput,
    //       };
    //     });
    //
    //     dispatch({
    //       type: 'SET_INITIAL_COMPONENT_STATE',
    //       payload: {
    //         name: 'poem',
    //         content: cookies[`lesson-${state.syllabusLessonID}`]?.poem,
    //       },
    //     });
    //   }
    // }

    /**
     *
     *
     * IF NO COOKIE SET
     *
     *
     */
  //   if (!cookies[`lesson-${state.syllabusLessonID}`]?.poem && !state.componentState.poem) {
  //     let storageObj: storageObject = {
  //       title: '',
  //       editMode: false,
  //       editInput: '',
  //       lines: [],
  //     };
  //
  //     dispatch({
  //       type: 'SET_INITIAL_COMPONENT_STATE',
  //       payload: {
  //         name: 'poem',
  //         content: storageObj,
  //       },
  //     });
  //
  //     setCookie(`lesson-${state.syllabusLessonID}`, {
  //       ...cookies[`lesson-${state.syllabusLessonID}`],
  //       poem: storageObj,
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   if (state.componentState.poem && editMode.open === true) {
  //     dispatch({
  //       type: 'UPDATE_COMPONENT_STATE',
  //       payload: {
  //         componentName: 'poem',
  //         inputName: 'editMode',
  //         content: true,
  //       },
  //     });
  //
  //     setCookie(`lesson-${state.syllabusLessonID}`, {
  //       ...cookies[`lesson-${state.syllabusLessonID}`],
  //       poem: {
  //         ...cookies[`lesson-${state.syllabusLessonID}`].poem,
  //         editMode: true,
  //       },
  //     });
  //   }
  // }, [editMode.open]);

  // useEffect(() => {
  //   if (state.componentState.poem) {
  //     dispatch({
  //       type: 'UPDATE_COMPONENT_STATE',
  //       payload: {
  //         componentName: 'poem',
  //         inputName: 'editInput',
  //         content: editMode.input,
  //       },
  //     });
  //   }
  // }, [editMode.input]);

  return (
      <div className={`w-full max-w-256 mx-auto  flex flex-col justify-between items-center z-50`}>
        <div className="relative flex flex-col justify-between items-center">
          {/*{!editMode ? (*/}
          {/*  <WritingBlock editMode={editMode} setEditMode={setEditMode} />*/}
          {/*) : (*/}
          {/*  <EditBlock editMode={editMode} />*/}
          {/*)}*/}
        </div>
      </div>
  );
};

export default PoemBlock;
