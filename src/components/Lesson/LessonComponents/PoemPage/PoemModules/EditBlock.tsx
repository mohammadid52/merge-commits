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
    const { state, dispatch } = useContext(LessonContext);
    const [ cookies, setCookie ] = useCookies(['poem']);
    const [ editInput, setEditInput ] = useState<{title: string, text: string}>({
        title: '',
        text: editMode.input,
    })

    useEffect(() => {
        if ( cookies.poem.editMode ) {
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
        console.log(state.componentState)
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
        <div className="bg-dark-blue w-full h-168 flex flex-col justify-between rounded-sm shadow-2 px-8 py-6">
            <h3 className="text-xl text-gray-200 font-open font-bold mb-3 border-b border-gray-700">
                Final Edits
            </h3>
            <div className="w-full h-140 flex flex-col justify-center">
                <label className="w-7/10 text-gray-200 text-lg font-open font-bold mb-2" htmlFor="title">
                    Your poem's title
                </label>
                <input id="title" name="title" className="bg-gray-300 w-7/10 h-12 mb-4 rounded-lg px-4 shadow-2" type="text" 
                value={editInput.title} onChange={handleChange} 
                placeholder="Choose a title"/>
                <textarea id="text" className="bg-gray-300 w-full h-112 p-8 text-2xl text-gray-800 rounded-sm shadow-2" 
                value={editInput.text} onChange={handleChange}/>
            </div>
        </div>
    )
}

export default EditBlock;