import React, { useState, useContext, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';
import { MdSettingsBackupRestore } from 'react-icons/md';

export interface PollInput {
  id: string,
  quesiton: string,
  options: {
      id: string,
      option: string,
      isChoice: boolean
  }
}

export type PollInputState = Array<PollInput>


const tempData = [
  {
    id: 'classes-school',
    question: 'Would you rather have classes on Saturdays or school during the summer',
    options: [
      {
        id: 'classes',
        option: 'classes on Saturdays',
      },
      {
        id: 'school',
        option: 'school during the summer',
      }
    ]
  },
  {
    id: 'clean-or-sleep',
    question: 'Would you rather clean the house everyday or sleep in the backyard?',
    options: [
      {
        id: 'clean',
        option: 'clean the house everyday',
      },
      {
        id: 'sleep',
        option: 'sleep in the backyard',
      }
    ]
  },
  {
    id: 'food-taste',
    question: 'Would you rather only eat your favorite food for the rest of your life or lose your sense of taste but can eat whatever you want?',
    options: [
      {
        id: 'fav-food',
        option: 'eat your favorite food for the rest of your life',
        
      },
      {
        id: 'lose-sense',
        option: 'lose your sense of taste but can eat whatever you want',
      }
    ]
  },
]

const PollForm = () => {
  const { state, theme, dispatch } = useContext(LessonContext);
  const [cookies, setCookie] = useCookies([`lesson-${state.classroomID}`]);
  const pollInputs = state.data.lesson.warmUp.inputs.pollInputs;
  // const [input, setInput] = useState({
  //   pollOptions:
  //     state.componentState.poll && state.componentState.poll.pollOptions
  //       ? state.componentState.poll.pollOptions
  //       : [],
  //   story:
  //     state.componentState.poll && state.componentState.poll.pollArray
  //       ? state.componentState.poll.pollArray
  //       : [],
  // });

  const [input, setInput] = useState(state.componentState.poll && state.componentState.poll.pollOptions
    ? state.componentState.poll.pollOptions
    : []);

    useEffect(() => {
      if ( cookies[`lesson-${state.classroomID}`]?.poll ) {
        setInput(() => {
          return (cookies[`lesson-${state.classroomID}`].poll.pollOptions);
        });
      }
    }, []);


    useEffect(() => {
      if ( state.componentState.poll ) {
  
       dispatch({
         type: 'UPDATE_COMPONENT_STATE',
         payload: {
             componentName: 'poll',
             inputName: 'pollOptions',
             content: input
         }
     }) 

        setCookie(`lesson-${state.classroomID}`, { ...cookies[`lesson-${state.classroomID}`], poll: {...cookies[`lesson-${state.classroomID}`].poll } });
      }

    }, [input]);


  // const handleInputChange = (e: { target: { id: string; value: string } }) => {
  //   setInput({
  //     ...input,
  //     [e.target.id]: e.target.value,
  //   });
  // };


/////// below are all temporary


  

  const [data, setData] = useState<any>([]);
  // console.log(options, 'test')

  // const handleRadioSelect = (passedKey: any, passedId: string, passedAns: string) => {

  //   setData(() => {
  //     return tempData.map((item: {id: string, question: string, options: any}, key: any) => {

  //     if(item.id === passedKey) {
  //       console.log(item.id, 'item.id')
  //       console.log(passedKey, 'item.id')
  //       console.log(passedId, 'passedID')
  //       return {
  //         // ...item,
  //         ...item.options.map((options: {id: string, option: string}, key: number) => {
  //           if(options.id === passedId ) {
  //             setInput(() => {
  //               return {...input,
  //               answer: passedAns}

  //             })
  //             return {
                
  //               ...options,
  //               isChoice: true 
  //             }} 
  //           //   else {
  //           //     return {...options}
  //           // } 
  //         }
  //         )}
  //     }
        
  //     else {
  //       return {...item}
        
  //     } 
      
  //   }) })
    
  // };

  const handleRadioSelect = (passedKey: any, passedId: string, passedAns: string) => {

    setInput(() => {
      return input ? input.map((item: {id: string, question: string, answer: any}, key: any) => {

      if(item.id === passedKey) {
        console.log(item.id, 'item.id')
        console.log(passedKey, 'item.id')
        console.log(passedId, 'passedID')
          return {
            ...item,
          // id: item.id,
          // question: item.question,
          answer: passedAns
        }        
      }
        
      else {
        return {...item}
        
      } 
      
    }) : null }) 
    
  };



console.log(cookies[`lesson-${state.classroomID}`], 'cookies')
  console.log(data, 'data')
  console.log(input, 'input')

  return (
    <div className='bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full h-full px-4 md:px-8 py-4 flex flex-col text-dark-blue rounded-lg border-l-4 border-orange-600'>
      <h3
        className={`text-xl text-gray-200 font-open font-light ${theme.underline}`}>
        Poll{' '}
      </h3>
      <div className='relative h-full flex flex-col items-center mb-5 mt-2'>
        {tempData ? tempData.map((item: {id: string, question:string, options: any}, key: number) => {
          return (
          <div key={key} className="flex flex-col p-4 items-center justify-between">
            
            <div id={item ? item.id : null} className="flex flex-col items-center justify-start py-4 font-light text-gray-400">
              <label id={item ? item.id : null} className="w-full font-light text-gray-400 text-base flex justify-between items-center m-2 px-2">
                {item ? item.question : null}
              </label>
              <div className="flex">

                {
                item ? item.options.map((option: {id: string, option: string, isChoice: boolean}, optionKey: number) => {

                  return (
                    <label key={optionKey} id={option.id} className="flex items-center text-sm cursor-pointer h-8">
                      {console.log(input, 'input in loop')}
                      <button key={optionKey} id={option.id} name='choice' onClick={() => handleRadioSelect(item.id, option.id, option.option)} className={`${option.option ? 'text-xl' : ''} w-auto px-4`}> {option.isChoice ? '❌'  : '⚪️'}</button>
                        {option.option}
                    </label>
                  )

                }) : null}

                

              </div>
            </div>
            
        </div> 
        )
        }) : null }
      </div>
    </div>
  );
};

export default PollForm;
