import React, { useState, useContext, useEffect, SyntheticEvent } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';

export interface TruthInput {
  id: string,
  label: string,
  isLie: boolean,
  text: string
}

export type TruthInputState = Array<TruthInput>

const TruthGameForm = () => {

  const { state, theme, dispatch } = useContext(LessonContext);
  const gameInputs = state.data.lesson.warmUp.inputs.truthGameInputs;
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
  const [input, setInput] = useState({
    truthGameArray:
      state.componentState.truthGame && state.componentState.truthGame.truthGameArray
        ? state.componentState.truthGame.truthGameArray
        : [],
    });

    useEffect(() => {
      if ( cookies[`lesson-${state.classroomID}`]?.truthGame ) {
        setInput(() => {
          return {
            truthGameArray: cookies[`lesson-${state.classroomID}`].truthGame.truthGameArray,
          };
        });
      }
    }, []);

    useEffect(() => {
      if ( gameInputs && state.componentState.truthGame) {
  
       dispatch({
         type: 'UPDATE_COMPONENT_STATE',
         payload: {
             componentName: 'truthGame',
             inputName: 'truthGameArray',
             content: input.truthGameArray
         }
     }) 

        setCookie(`lesson-${state.classroomID}`, { ...cookies[`lesson-${state.classroomID}`], truthGameArray: { ...cookies[`lesson-${state.classroomID}`].truthGame.truthGameArray, }});
      }

      console.log(input.truthGameArray, 'input.truthGameArray')

    }, [input.truthGameArray]);

    const handleInputChange = (e: { target: { id: string; value: string } }) => {
      let value = e.target.value;
      let targetId = e.target.id

      setTest(() => {
        return input.truthGameArray.map((item: any) => {
          if (targetId === item.id) {
            return {
              ...item,
              text: value
            }
          } else {
            return {
              ...item
            }
          }
          
        })})
    };


  const [test, setTest] = useState(input.truthGameArray)
  console.log(input.truthGameArray, 'input what is here')



    const handleRadioSelect = (passedKey: any) => {
      let newArray = input.truthGameArray;
    
      input.truthGameArray.map((item: {id: string, label: string, text: string}, key: any) => {
        if(key === passedKey) {
          return { 
          ...item,
          isLie: true
        }
      } else {
        return {
          ...item, 
          isLie: false
        }
      }

        
      })
      console.log(input.truthGameArray, 'wtf')
      setInput(() => { return newArray }
      )
    };

  console.log(test, 'test')

  useEffect(() => {
    console.log(test, 'test input')
    {console.log(input, 'input')}
      
  }, [input])

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
        {input ? input.truthGameArray.map((item: {id: string, label: string, text: string, isLie: boolean}, key: number) => {
          return (
          <div id={item.id} key={key} className="flex flex-col p-4 items-center justify-between">
            <div id={item.id} className="flex items-center justify-start py-4">
              <label id={item.id} className="h-8 w-full cursor-pointer font-light text-gray-400 text-sm flex flex-row-reverse justify-between items-center px-2">
                <button key={key} id={item.id} name='lie' onClick={() => handleRadioSelect(key)} className={`${item.isLie ? 'text-2xl' : ''} w-auto mx-4`} > {item.isLie ? '🤥'  : '⚪️'}</button>
                {item.label}
              </label>
            </div>
{console.log(input.truthGameArray, 'inside the main map input.truthArray')}
{console.log(item, 'inside main the item')}
            <input
              id={item.id}
              className='w-full h-10 px-4 py-2 rounded-lg text-gray-700 bg-gray-300'
              name='list'
              type='text'
              // placeholder={`${state.data.lesson.warmUp.inputs.textExample}`}
              defaultValue={item.text}
              onChange={handleInputChange}
            />
            
        </div> )
        }) : null }
      </div>
    </div>
  );
};

export default TruthGameForm;
