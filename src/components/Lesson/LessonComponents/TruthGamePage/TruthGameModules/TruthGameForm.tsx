import React, { useState, useContext, useEffect, SyntheticEvent } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';


const ListForm = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  // const [cookies, setCookie] = useCookies(['story']);
  const [input, setInput] = useState({
    title:
      state.componentState.story && state.componentState.story.title
        ? state.componentState.story.title
        : '',
    story:
      state.componentState.story && state.componentState.story.story
        ? state.componentState.story.story
        : '',
  });

  

  // useEffect(() => {
  //   if (cookies.story) {
  //     setInput(() => {
  //       return {
  //         title: cookies.story.title,
  //         story: cookies.story.story,
  //       };
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

      // setCookie('story', { ...cookies.story, title: input.title });
    }
  }, [input.title]);

  useEffect(() => {
    if (state.componentState.story) {
      dispatch({
        type: 'UPDATE_COMPONENT_STATE',
        payload: {
          componentName: 'story',
          inputName: 'story',
          content: input.story,
        },
      });

      // setCookie('story', { ...cookies.story, story: input.story });
    }
  }, [input.story]);

  const handleInputChange = (e: { target: { id: string; value: string } }) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  };

  const [radio, setRadio] = useState(false)

  const tempData = [
    {
      id: 'deepest-fear',
      label: 'Deepest fear',
      lie: false,
      input: '',
    },
    {
      id: 'most-anxious',
      label: 'Most anxious',
      lie: false,
      input: '',
    },
    {
      id: 'happiest-moment',
      label: 'Happiest moment',
      lie: false,
      input: '',
    }
  ]
  const [data, setData] = useState<any>(tempData);

  const handleRadioSelect = (passedKey: any) => {
    setData(tempData.map((item: {id: string, label: string, lie: boolean, input: string}, key: any) => {
      if(key === passedKey)
      {return {
        ...item,
        lie: true
      }} else {
        return {...item}
      }
    }))
    
  };

  useEffect(() => {
    console.log(tempData)
  }, [input])

  console.log(data, 'data')
  console.log(tempData, 'tempData')

  return (
    <div className='bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full h-full px-4 md:px-8 py-4 flex flex-col text-dark-blue rounded-lg border-l-4 border-orange-600'>
      <h3
        className={`text-xl text-gray-200 font-open font-light ${theme.underline}`}>
        Two Truths and a Lie
      </h3>
      
      <div className='relative h-full flex flex-col items-center mb-5 mt-2'>
        <div className="text-gray-200">
          {state ? state.data.lesson.warmUp.inputs.textExample : null}
          </div>
        {data.map((item: any, key: number) => {
          return (
          <div id={item.id} key={key} className="flex flex-col p-4 items-center justify-between">
            <div id={item.id} className="flex items-center justify-start py-4">
              
              <label id={item.id} className="w-auto cursor-pointer font-light text-gray-400 text-sm flex-none items-center px-2">
          <button key={key} id={item.id} name='lie' onClick={() => handleRadioSelect(key)} value={item.lie} className={`${item.lie ? 'text-2xl' : ''} w-auto mx-4`} > {item.lie ? '🤥'  : '⚪️'}</button>
              
                {item.label}
              </label>
            </div>
            <input
              id={item.id}
              className='w-full h-10 px-4 py-2 rounded-lg text-gray-700 bg-gray-300'
              name='list'
              type='text'
              // placeholder={`${state.data.lesson.warmUp.inputs.textExample}`}
              defaultValue={`${input.story}`}
              onChange={handleInputChange}
            />
        </div> )
        })}
      </div>
    </div>
  );
};

export default ListForm;
