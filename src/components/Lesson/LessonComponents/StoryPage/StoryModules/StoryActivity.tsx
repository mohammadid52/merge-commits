import React, { useState, useContext, useEffect, useRef } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import InstructionsBlock from './InstructionBlock';
import StoryForm from './StoryForm';
import Banner from './Banner';
import Modules from './Modules';
import InstructionsPopup from '../../../Popup/InstructionsPopup';

export interface storyBreakdownProps {
    story: string,
    title?: string,
    additional?: [{
        name: string,
        text: string | [],
    }?]
}

const Story = () => {
    const { state, dispatch } = useContext(LessonContext);
    const inputs = state.data.warmUp.inputs;
    const video = state.data.warmUp.instructions.link
    const [ openPopup, setOpenPopup ] = useState(false)
    
    const setInitialBreakdownProps = () => {
        let tempObj:storyBreakdownProps = {
            story: ''
        };

        if (inputs.title) {
            tempObj.title = '';
        }

        if (inputs.additionalInputs.length > 0) {
            tempObj.additional = [];
            inputs.additionalInputs.forEach((input: { name: string; }) => {
                let newInput = {
                    name: input.name,
                    text: '',
                }

                tempObj.additional.push(newInput);
            })
        }

        return tempObj
    }

    const [ breakdownProps, setBreakdownProps ] = useState(setInitialBreakdownProps())
    
    useEffect(() => {
        dispatch({
            type: 'SET_DISPLAY_PROPS',
            payload: {
                name: 'story',
                content: breakdownProps,
            },
        })
    }, [breakdownProps])


    return (
       <>
            <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/>
            <div className="w-full h-200 flex flex-col items-center">
                <Banner />
                <div className="w-full h-full flex flex-row">
                    <div className="w-4/10 h-full flex flex-col items-center mr-2">
                        <InstructionsBlock />
                        { inputs.additionalInputs.length > 0 ?
                            <Modules 
                                breakdownProps={breakdownProps}
                                setBreakdownProps={setBreakdownProps}
                                inputs={inputs.additionalInputs}
                            />
                            :
                            null
                        }
                    </div>
                    <div className="w-6/10 h-full flex flex-col items-center ml-2">
                        <StoryForm 
                            breakdownProps={breakdownProps}
                            setBreakdownProps={setBreakdownProps}
                        />
                    </div>
                </div>
            </div>
       </>
    )
}

export default Story;