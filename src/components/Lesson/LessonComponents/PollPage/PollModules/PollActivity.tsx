import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../Popup/InstructionsPopup';
import PollForm from './PollForm';
import { string } from 'prop-types';

export interface PollInput {
    id: string,
    question: string,
    options: {
        id: string,
        option: string,
        isChoice: boolean
    }
}

export type PollInputState = Array<PollInput>

export const tempPollInputs = [
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

const Poll = () => {
    const { state, dispatch } = useContext(LessonContext);
    const [ cookies, setCookie ] = useCookies([`lesson-${state.classroomID}`]);
    const inputs = state.data.lesson.warmUp.inputs;
    const video = state.data.lesson.warmUp.instructions.link
    const [ openPopup, setOpenPopup ] = useState(false)

    useEffect(() => {
        if ( !cookies[`lesson-${state.classroomID}`].poll && !state.componentState.poll ) {
             
            let tempObj : {
               pollArray: Array<{id: string, question: string, options: any | []}>
               pollOptions: Array<{id: string, question: string, answer: string} | []>
               additional?: Array<{name: string, text: string | []}>
           }

           tempObj = {
               pollArray: [],
               pollOptions: []
           };
// need to change here (tempPollInputs) when database is updated

           let tempArr = tempPollInputs.map((item: {id: string, question: string, options: any}, ) => {  
            let storageObj = {
                    id: item.id,
                    question: item.question,
                    options: item.options
                }
                return storageObj
                
           } ) 

           tempObj.pollArray = tempArr

            let tempOptions:Array<{id: string, question: string, answer: string} | []>= [];
                tempPollInputs.map((input: { id: string, question: string, options: any }) => {
                    let newInput = {
                        id: input.id,
                        question: input.question,
                        answer: '',
                    }

                    tempOptions.push(newInput);
                })

                tempObj.pollOptions = tempOptions;
           
             

            if (inputs.additionalInputs.length > 0) {
                let additional:Array<{name: string, text: string | []}>= [];
                inputs.additionalInputs.forEach((input: { name: string; }) => {
                    let newInput = {
                        name: input.name,
                        text: '',
                    }

                    additional.push(newInput);
                })

                tempObj.additional = additional;
            }

            dispatch({
                type: 'SET_INITIAL_COMPONENT_STATE',
                payload: {
                    name: 'poll',
                    content: tempObj
                }
            })

            setCookie(`lesson-${state.classroomID}`, { ...cookies[`lesson-${state.classroomID}`], poll: tempObj })
        }
        
        if ( cookies[`lesson-${state.classroomID}`].poll ) {
            dispatch({
                type: 'SET_INITIAL_COMPONENT_STATE',
                payload: {
                    name: 'poll',
                    content: cookies[`lesson-${state.classroomID}`].poll
                }
            })
        }

    }, []);


    return (
       <>
            <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/>
            <div className="w-full h-full flex flex-col justify-between items-center">
                <Banner />
                <div className="w-full h-8.8/10 flex flex-col items-center md:flex-row md:justify-between">
                    <div className="md:w-4/10 h-full flex flex-col justify-between items-center">
                        <InstructionsBlock />
                        { inputs.additionalInputs.length > 0 ?
                            <Modules 
                                // breakdownProps={breakdownProps}
                                // setBreakdownProps={setBreakdownProps}
                                inputs={inputs.additionalInputs}
                            />
                            :
                            null
                        }
                    </div>
                    <div className="md:w-5.9/10 h-full flex flex-col items-center">
                        <PollForm />
                    </div>
                </div>
            </div>
       </>
    )
}

export default Poll;