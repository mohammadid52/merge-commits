import React, { useState, useContext, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';

interface ListFormProps {
  nrLists: number | null;
  listArray: string[];
}

interface ListInput {
  title: string;
  story: string[];
}

const ListForm = (props: ListFormProps) => {
  const { nrLists, listArray } = props;
  const { state, theme, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
  const [input, setInput] = useState({
    title: state.componentState.story && state.componentState.story.title ? state.componentState.story.title : '',
    story:
      state.componentState.story && state.componentState.story.story ? state.componentState.story.story : listArray,
  });

  // const [input, setInput] = useState<ListInput>();

  // useEffect(() => {
  //   if (!state.componentState?.story && !state.componentState?.story?.story) {
  //     setInput({
  //       ...input,
  //       story: nrLists === null ? [''] : Array.from(Array(nrLists).keys()).map((elem: number) => ''),
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (state.componentState.story) {
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'story',
          inputName: 'title',
          content: input.title,
        },
      });

      setCookie(`lesson-${state.classroomID}`, {
        ...cookies[`lesson-${state.classroomID}`],
        story: { ...cookies[`lesson-${state.classroomID}`].story, title: input.title },
      });
    }
  }, [input.title]);

  useEffect(() => {
    // if (state.componentState.story) {
    dispatch({
      type: 'UPDATE_COMPONENT_STATE',
      payload: {
        componentName: 'story',
        inputName: 'story',
        content: input.story,
      },
    });

    setCookie(`lesson-${state.classroomID}`, {
      ...cookies[`lesson-${state.classroomID}`],
      story: { ...cookies[`lesson-${state.classroomID}`].story, story: input.story },
    });
    // }
  }, [input.story]);

  const handleInputChange = (e: { target: { id: string; value: string } }) => {
    /**
     *
     * Updated inputchange so that the correct index
     * in the story string array is modified...
     * if there is a single list...
     * or if there are multiple...
     *
     * */
    const storyArrayID = parseInt(e.target.id.match(/[0-9]/)[0]);

    console.log('changing multi list: ', storyArrayID);

    setInput({
      ...input,
      ['story']: input.story.map((item: string, index: number) => (index === storyArrayID ? e.target.value : item)),
    });
  };

  const bullet = '\u2022';

  const handleInput = (e: any) => {
    let previousLength = 0;
    e.preventDefault();
    const newLength = e.target.value.length;
    const characterCode = e.target.value.substr(-1).charCodeAt(0);
    if (newLength > previousLength) {
      if (characterCode === 10) {
        e.target.value = `${e.target.value}${bullet} `;
      } else if (newLength === 1) {
        e.target.value = `${bullet} ${e.target.value}`;
      }
    }

    previousLength = newLength;
    // console.log(previousLength, 'prev')
  };

  return (
    <div className="w-full h-full rounded-xl">
      <h3 className={`w-full text-xl ${theme.banner} border-b-4 border-sea-green`}>List </h3>

      {/**
       *
       * SUPPORT FOR MULTIPLE LISTS
       * EITHER RETURN A SINGLE LIST...
       * OR
       * RETURN MULTIPLE LISTS FROM A MAP
       *
       * */}

      {nrLists === null ? (
        <div className="relative h-full flex flex-col mb-5 mt-2">
          <textarea
            id="list_0"
            className={`w-full h-64 py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
            name="list"
            placeholder={`${bullet} ${state.data.lesson.warmUp.inputs.textExample}`}
            defaultValue={`${input.story}`}
            onChange={handleInputChange}
            onInput={handleInput}
          />
        </div>
      ) : (
        Array.from(Array(nrLists).keys()).map((elem: number, key: number) => {
          return (
            <textarea
              key={`list_${key}`}
              id={`list_${key}`}
              className={`w-full h-64 py-2 px-4 text-gray-800 rounded-xl ${theme.elem.textInput}`}
              name="list"
              placeholder={`${bullet} ${state.data.lesson.warmUp.inputs.textExample}`}
              defaultValue={``}
              onChange={handleInputChange}
              onInput={handleInput}
            />
          );
        }, [])
      )}
    </div>
  );
};

export default ListForm;
