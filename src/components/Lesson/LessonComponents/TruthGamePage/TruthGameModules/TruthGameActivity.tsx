import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../Popup/InstructionsPopup';
import TruthGameForm from './TruthGameForm';
import { string } from 'prop-types';

export interface TruthInput {
    id: string,
    label: string,
    isLie: boolean,
    text: string
}

export type TruthInputState = Array<TruthInput>

const tempData = [
    {
      id: 'deepest-fear',
      label: 'Deepest fear'
    },
    {
      id: 'most-anxious',
      label: 'Most anxious'
    },
    {
      id: 'happiest-moment',
      label: 'Happiest moment'
    }
  ]

const TruthGame = () => {
    const { state, dispatch } = useContext(LessonContext);
    const [ cookies, setCookie ] = useCookies(['story']);
    const inputs = state.data.lesson.warmUp.inputs;
    const video = state.data.lesson.warmUp.instructions.link
    const [ openPopup, setOpenPopup ] = useState(false)

    console.log(inputs, 'inputs')
    useEffect(() => {
        if ( !cookies.story && !state.componentState.truthGame ) {
           let tempObj: {
               truthGameArray: TruthInputState
               additional?: Array<{name: string, text: string | []}>
           }

           let tempArr = inputs.truthGameInputs.map((item: {id: string, label: string}, ) => {
                let storageObj = {
                    id: item.id, 
                    label: item.label,
                    isLie: false,
                    text: ''
                }
                return storageObj
           })

           tempObj.truthGameArray = tempArr

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
                    name: 'truthGame',
                    content: tempArr
                }
            })

            setCookie('truthGame', tempArr)
        }
        
        if ( cookies.story ) {
            dispatch({
                type: 'SET_INITIAL_COMPONENT_STATE',
                payload: {
                    name: 'truthGame',
                    content: cookies.story
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
                        <TruthGameForm props={tempData}/>
                    </div>
                </div>
            </div>
       </>
    )
}

export default TruthGame;