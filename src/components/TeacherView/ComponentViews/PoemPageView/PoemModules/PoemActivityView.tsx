import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
// import { useCookies } from 'react-cookie';
import WritingBlock from './WritingBlock';
import InstructionBlock from './InstructionBlock';
import ToolBar from './ToolBar';
import Banner from './Banner';
import EditBlock from './EditBlock';
import InstructionsPopup from '../../../../Lesson/Popup/InstructionsPopup';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import { studentObject } from '../../../../../state/LessonControlState';

type storageObject = {
    title: string
    editMode: boolean
    editInput?: string
    lines?: Array<{
        id: number
        text: string
        example: string
        menuOpen: false
    }>
}

interface props {
    fullscreen: boolean
}

const PoemActivity = (props: props) => {
    const { fullscreen } = props;
    const { state, dispatch } = useContext(LessonControlContext);
    // const [ cookies, setCookie ] = useCookies(['poem']);
    const [ editMode, setEditMode ] = useState({
        open: false,
        input: ''
    })
    const { video, link, text } = state.data.lesson.activity.instructions
    const [ openPopup, setOpenPopup ] = useState(false);


    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.lessonProgress === 'activity' : false;
    

    useEffect(() => {
        if ( displayStudentData && state.studentViewing.studentInfo.activityData ) {
            if ( state.studentViewing.studentInfo.activityData.editMode ) {
                setEditMode(() => {
                    return {
                        open: state.studentViewing.studentInfo.activityData.editMode,
                        input: state.studentViewing.studentInfo.activityData.editInput
                    }
                })
            }
        }  
        
    }, [])

    useEffect(() => {
        // if ( state.componentState.poem && editMode.open === true ) {
        //     dispatch({
        //         type: 'UPDATE_COMPONENT_STATE',
        //         payload: {
        //             componentName: 'poem',
        //             inputName: 'editMode',
        //             content: true
        //         }
        //     })

        //     setCookie('poem', {...cookies.poem, editMode: true})
        // }
    }, [editMode.open])

    useEffect(() => {
        // if ( state.componentState.poem ) {
        //     dispatch({
        //         type: 'UPDATE_COMPONENT_STATE',
        //         payload: {
        //             componentName: 'poem',
        //             inputName: 'editInput',
        //             content: editMode.input
        //         }
        //     })

        // }
    }, [editMode.input])

    return (
        <>
            <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/>
            <div className="w-full h-full flex flex-col justify-between items-center">
                <Banner fullscreen={fullscreen}/>
                <div className="w-full h-8.8/10 justify-between flex flex-col md:flex-row">
                    <div className="md:w-6/10 md:h-full flex flex-col">
                        {   !editMode.open ?
                            <WritingBlock editMode={editMode} setEditMode={setEditMode} fullscreen={fullscreen}/>
                            :
                            <EditBlock editMode={editMode} fullscreen={fullscreen}/>
                        }
                    </div>
                    <div className="md:w-3.9/10 justify-between md:h-full flex flex-col">
                        <InstructionBlock editMode={editMode.open} fullscreen={fullscreen}/>
                        <ToolBar editMode={editMode.open} setEditMode={setEditMode} fullscreen={fullscreen}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PoemActivity;