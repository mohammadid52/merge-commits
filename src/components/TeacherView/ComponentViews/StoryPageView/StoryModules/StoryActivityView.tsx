import React, { useState, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import InstructionsBlock from './InstructionBlock';
import StoryForm from './StoryForm';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../../Lesson/Popup/InstructionsPopup';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';

export interface StoryState {
    story: string,
    title?: string,
    additional?: {
        name: string,
        text: string | [],
    }[]
}

interface props {
    student: number | null,
    fullscreen: boolean
}

const Story = (props: props) => {
    const { student, fullscreen } = props;
    const { state, dispatch } = useContext(LessonControlContext);
    const [ cookies, setCookie ] = useCookies(['story']);
    const inputs = state.data.lesson.warmUp.inputs;
    const video = state.data.lesson.warmUp.instructions.link
    const [ openPopup, setOpenPopup ] = useState(false)

    
    

    useEffect(() => {
        // if ( !cookies.story && !state.componentState.story ) {
        //    let tempObj: StoryState = {
        //         story: '',
        //     }
        //     if ( inputs.title ) {
        //         tempObj.title = '';
        //     }

        //     if (inputs.additionalInputs.length > 0) {
        //         let additional:Array<{name: string, text: string | []}>= [];
        //         inputs.additionalInputs.forEach((input: { name: string; }) => {
        //             let newInput = {
        //                 name: input.name,
        //                 text: '',
        //             }

        //             additional.push(newInput);
        //         })

        //         tempObj.additional = additional;
        //     }

        //     dispatch({
        //         type: 'SET_INITIAL_COMPONENT_STATE',
        //         payload: {
        //             name: 'story',
        //             content: tempObj
        //         }
        //     })

        //     setCookie('story', tempObj)
        // }
        
        // if ( cookies.story ) {
        //     dispatch({
        //         type: 'SET_INITIAL_COMPONENT_STATE',
        //         payload: {
        //             name: 'story',
        //             content: cookies.story
        //         }
        //     })
        // }

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
                        <StoryForm />
                    </div>
                </div>
            </div>
       </>
    )
}

export default Story;