import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';

interface EditBlockProps {
    editMode: {
        open: boolean;
        input: string;
    }
}

const EditBlock = (props: EditBlockProps) => {
    const { editMode } = props;
    const { state, theme, dispatch } = useContext(LessonContext);
    const [ cookies, setCookie ] = useCookies([`lesson-${state.classroomID}`]);
    const [ editInput, setEditInput ] = useState<{title: string, text: string}>({
        title: '',
        text: editMode.input,
    })

    useEffect(() => {
        if ( cookies[`lesson-${state.classroomID}`].poem && cookies[`lesson-${state.classroomID}`].poem.editMode ) {
            setEditInput(() => {
                return {
                    title: cookies[`lesson-${state.classroomID}`].poem.title,
                    text: cookies[`lesson-${state.classroomID}`].poem.editInput,
                }
            })
        }
    }, [])

    useEffect(() => {
        if ( state.componentState.poem && state.componentState.poem.editMode === true ) {
            dispatch({
                type: 'UPDATE_COMPONENT_STATE',
                payload: {
                    componentName: 'poem',
                    inputName: 'editInput',
                    content: editInput.text
                }
            })

            setCookie(`lesson-${state.classroomID}`, {
                ...cookies[`lesson-${state.classroomID}`],
                poem: {
                    ...cookies[`lesson-${state.classroomID}`].poem,
                    editInput: editInput.text
                }
            })
        } 
    }, [editInput.text])

    useEffect(() => {
        if ( state.componentState.poem && state.componentState.poem.editMode === true ) {
            dispatch({
                type: 'UPDATE_COMPONENT_STATE',
                payload: {
                    componentName: 'poem',
                    inputName: 'title',
                    content: editInput.title
                }
            })

            setCookie(`lesson-${state.classroomID}`, {
                ...cookies[`lesson-${state.classroomID}`],
                poem: {
                    ...cookies[`lesson-${state.classroomID}`].poem,
                    title: editInput.title
                }
            })
        } 
    }, [editInput.title])

    const handleChange = (e: { target: { id: string; value: string; }; }) => {
        const {id, value} = e.target
        setEditInput(editInput => {
            return {
                ...editInput,
                [id]: value,
            }
        })
    }

    return (
        <div className={theme.section}>
  
            <h3 className={`w-full text-xl ${theme.banner} ${theme.underline}`}>
                Final Edits
            </h3>
            <div className='w-full flex flex-col'>
                <label className={`w-full text-xl ${theme.banner}`} htmlFor="title">
                    Your poem's title
                </label>
                <input id="title" name="title" className={` rounded-xl mb-2 ${theme.elem.textInput}`} type="text" 
                value={editInput.title} onChange={handleChange} 
                placeholder="Choose a title"/>
                <textarea id="text" className={`h-64 rounded-xl mb-2 ${theme.elem.textInput}`} 
                value={editInput.text} onChange={handleChange}/>
            </div>
        </div>
    )
}

export default EditBlock;