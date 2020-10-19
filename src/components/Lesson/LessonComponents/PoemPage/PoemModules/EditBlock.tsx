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
    const [ cookies, setCookie ] = useCookies(['poem']);
    const [ editInput, setEditInput ] = useState<{title: string, text: string}>({
        title: '',
        text: editMode.input,
    })

    useEffect(() => {
        if ( cookies.poem && cookies.poem.editMode ) {
            setEditInput(() => {
                return {
                    title: cookies.poem.title,
                    text: cookies.poem.editInput,
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

            setCookie('poem', {...cookies.poem, editInput: editInput.text})
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

            setCookie('poem', {...cookies.poem, title: editInput.title})
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
  
            <h3 className={`w-full h-1/10 text-xl ${theme.banner} ${theme.underline}`}>
                Final Edits
            </h3>
            <div className='w-full flex flex-col'>
                <label className={`w-full h-1/10 text-xl ${theme.banner}`} htmlFor="title">
                    Your poem's title
                </label>
                <input id="title" name="title" className={` rounded-xl mb-2 ${theme.elem.textInput}`} type="text" 
                value={editInput.title} onChange={handleChange} 
                placeholder="Choose a title"/>
                <textarea id="text" className={` rounded-xl mb-2 ${theme.elem.textInput}`} 
                value={editInput.text} onChange={handleChange}/>
            </div>
        </div>
    )
}

export default EditBlock;