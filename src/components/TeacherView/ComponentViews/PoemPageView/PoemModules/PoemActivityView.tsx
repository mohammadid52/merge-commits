import React, { useContext, useEffect, useState } from 'react';
// import { useCookies } from 'react-cookie';
import WritingBlock from './WritingBlock';
import InstructionBlock from './InstructionBlock';
import EditBlock from './EditBlock';
import { LessonControlContext } from '../../../../../contexts/LessonControlContext';
import Banner from '../../../../Lesson/LessonComponents/Banner';

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
    // const [ cookies, setCookie ] = useCookies(['poem']);
    const [ editMode, setEditMode ] = useState({
        open: false,
        input: ''
    })
    const { video, link, text } = state.data.lesson.activity.instructions
    const [ openPopup, setOpenPopup ] = useState(false);
    
    let displayStudentData = state.studentViewing.live ? state.studentViewing.studentInfo.currentLocation ? state.studentViewing.studentInfo.currentLocation === 'activity' : state.studentViewing.studentInfo.lessonProgress === 'activity' : false;

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
    }, [state.studentViewing])

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

    const title = state.data.lesson.activity.title;

    return (
        <>
            {/* <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/> */}
            < div className={theme.section} >
                <Banner isTeacher={true} title={title} iconName={`FaPenFancy`}/>
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