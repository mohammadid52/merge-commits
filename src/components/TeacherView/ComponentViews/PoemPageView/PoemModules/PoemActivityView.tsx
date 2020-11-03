import React, { useState, useContext, useEffect } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
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
    const { state, theme, dispatch } = useContext(LessonControlContext);
    const [cookies, setCookie] = useCookies(['poem']);
    const [editMode, setEditMode] = useState({
        open: false,
        input: ''
    })
    const { video, link, text } = state.data.lesson.activity.instructions
    const [openPopup, setOpenPopup] = useState(false);


    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.lessonProgress === 'activity' : false;


    useEffect(() => {
        if (displayStudentData && state.studentViewing.studentInfo.activityData) {
            if (state.studentViewing.studentInfo.activityData.editMode) {
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
            {/* <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/> */}
            < div className={theme.section} >
                <Banner fullscreen={fullscreen} />
                <InstructionBlock editMode={editMode.open} fullscreen={fullscreen} />
                <div className='flex flex-col justify-between items-center'>
                    {!editMode.open ? (
                        <WritingBlock editMode={editMode} setEditMode={setEditMode} fullscreen={fullscreen} />
                    ) : (
                            <EditBlock editMode={editMode} fullscreen={fullscreen} />
                        )}

                    {/* <ToolBar editMode={editMode} setEditMode={setEditMode} /> */}
                </div>
            </div >
        </>
    )
}

export default PoemActivity;