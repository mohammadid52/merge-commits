import React, { useState, useContext, useEffect, SyntheticEvent } from 'react';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';

export interface TruthInput {
  id: string,
  label: string,
  isLie: boolean,
  text: string
}

  interface props {   
    fullscreen: boolean
    dataProps?: {
        truthGameArray: Array<TruthInput>,
        [key: string]: any
    }
  }

const TruthGameForm = (props: props) => {
  const { fullscreen, dataProps } = props;
  const { state, theme, dispatch } = useContext(LessonControlContext);
  const gameInputs = state.data.lesson.warmUp.inputs.truthGameInputs;
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
  const [input, setInput] = useState({
    truthGameArray: []
    });

    // useEffect(() => {
    //   if ( cookies[`lesson-${state.classroomID}`]?.truthGame ) {
    //     setInput(() => {
    //       return {
    //         truthGameArray: cookies[`lesson-${state.classroomID}`].truthGame.truthGameArray,
    //       };
    //     });
    //   }
    // }, []);

    // useEffect(() => {
    //   if ( gameInputs && state.componentState.truthGame) {
  
    //    dispatch({
    //      type: 'UPDATE_COMPONENT_STATE',
    //      payload: {
    //          componentName: 'truthGame',
    //          inputName: 'truthGameArray',
    //          content: input.truthGameArray
    //      }
    //  }) 

    //     setCookie(`lesson-${state.classroomID}`, { ...cookies[`lesson-${state.classroomID}`], truthGameArray: { ...cookies[`lesson-${state.classroomID}`].truthGame.truthGameArray, }});
    //   }

    //   console.log(input.truthGameArray, 'input.truthGameArray')

    // }, [input.truthGameArray]);



  useEffect(() => {
        
    setInput({
        truthGameArray: dataProps && dataProps.truthGameArray ? dataProps.truthGameArray : [],
    })

}, [dataProps])

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
        {gameInputs.map((item: {id: string, label: string, text: string, isLie: boolean}, key: number) => {
          return (
          <div id={item.id} key={key} className="flex flex-col p-4 items-center justify-between">
            <div id={item.id} className="flex items-center justify-start py-4">
              <label id={item.id} className="h-8 w-full cursor-pointer font-light text-gray-400 text-sm flex flex-row-reverse justify-between items-center px-2">
                <button key={key} id={item.id} name='lie'  className={`${item.isLie ? 'text-2xl' : ''} w-auto mx-4`} > {item.isLie ? '🤥'  : '⚪️'}</button>
                {item.label}
              </label>
            </div>

            <input
              id={item.id}
              className='w-full h-10 px-4 py-2 rounded-lg text-gray-700 bg-gray-300'
              name='list'
              type='text'
              // placeholder={`${state.data.lesson.warmUp.inputs.textExample}`}
              defaultValue={item.text}
              
            />
            
        </div> )
        }) }
      </div>
    </div>
  );
};

export default TruthGameForm;
