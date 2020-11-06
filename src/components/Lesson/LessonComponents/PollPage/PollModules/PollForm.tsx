import React, { useState, useContext, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import ToolTip from '../../../../General/ToolTip/ToolTip';


const PollForm = () => {
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


/////// below are all temporary
  const tempData = [
    {
      id: 'classes-school',
      label: 'Would you rather have classes on Saturdays or school during the summer',
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
      label: 'Would you rather clean the house everyday or sleep in the backyard?',
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
      label: 'Would you rather only eat your favorite food for the rest of your life or lose your sense of taste but can eat whatever you want?',
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


  const [data, setData] = useState<any>(tempData);
  const [test, setTest] = useState<any>([]);

  const tryTest = 
    setTest(data.map((item: {id: string, label: string, options: any}, key: any) => { 
      return item.options
     }))
  

     console.log(test, 'test')


  const handleRadioSelect = (passedKey: any) => {

    // setTest(tryTest.map((option: any, optionKey: number) => {

    // }))
    setData(tempData.map((item: {id: string, label: string, options: any}, key: any) => {
      if(key === passedKey ) {

        item.options.map((option: any, key: any) =>{
        
          if(key === passedKey)

          // console.log(option, 'option')
          {return {
            ...item,
            ...option,
            choice: true 
          }} else {
            return {...item, ...option}
          }
        })
      }
      
     
    }))
    
  };


  return (
    <div className='bg-gradient-to-tl from-dark-blue to-med-dark-blue w-full h-full px-4 md:px-8 py-4 flex flex-col text-dark-blue rounded-lg border-l-4 border-orange-600'>
      <h3
        className={`text-xl text-gray-200 font-open font-light ${theme.underline}`}>
        Poll{' '}
      </h3>
      <div className='relative h-full flex flex-col items-center mb-5 mt-2'>
        {data ? data.map((item: {id: string, label:string, options: any}, key: number) => {
          return (
          <div key={key} className="flex flex-col p-4 items-center justify-between">
            
            <div id={item ? item.id : null} className="flex flex-col items-center justify-start py-4 font-light text-gray-400">
              <label id={item ? item.id : null} className="w-full font-light text-gray-400 text-base flex justify-between items-center m-2 px-2">
                {item ? item.label : null}
              </label>
              <div className="flex">

                {
                
                item ? item.options.map((option: any, optionKey: number) => {

                  return (
                    
                    <label key={optionKey} id={option.id} className="flex text-sm cursor-pointer h-8">
                      <button key={optionKey} id={option.id} name='lie' onClick={() => handleRadioSelect(optionKey)} className={`${option.choice ? 'text-xl' : ''} w-auto px-4`}> {option.choice ? '❌'  : '⚪️'}</button>
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
