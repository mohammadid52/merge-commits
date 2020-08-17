import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';

// interface EditBlockProps {
//     editMode: {
//         open: boolean;
//         input: string;
//     }
// }

const DoFirst = () => {
//     const { editMode } = props;
//     const { state, dispatch } = useContext(LessonContext);
//     const [ cookies, setCookie ] = useCookies(['poem']);
//     const [ editInput, setEditInput ] = useState<{title: string, text: string}>({
//         title: '',
//         text: editMode.input,
//     })

//     useEffect(() => {
//         if ( cookies.poem && cookies.poem.editMode ) {
//             setEditInput(() => {
//                 return {
//                     title: cookies.poem.title,
//                     text: cookies.poem.editInput,
//                 }
//             })
//         }
//     }, [])

//     useEffect(() => {
//         if ( state.componentState.poem && state.componentState.poem.editMode === true ) {
//             dispatch({
//                 type: 'UPDATE_COMPONENT_STATE',
//                 payload: {
//                     componentName: 'poem',
//                     inputName: 'editInput',
//                     content: editInput.text
//                 }
//             })

//             setCookie('poem', {...cookies.poem, editInput: editInput.text})
//         } 
//     }, [editInput.text])

//     useEffect(() => {
//         if ( state.componentState.poem && state.componentState.poem.editMode === true ) {
//             dispatch({
//                 type: 'UPDATE_COMPONENT_STATE',
//                 payload: {
//                     componentName: 'poem',
//                     inputName: 'title',
//                     content: editInput.title
//                 }
//             })

//             setCookie('poem', {...cookies.poem, title: editInput.title})
//         } 
//     }, [editInput.title])

//     const handleChange = (e: { target: { id: string; value: string; }; }) => {
//         const {id, value} = e.target
//         setEditInput(editInput => {
//             return {
//                 ...editInput,
//                 [id]: value,
//             }
//         })
//     }

    return (
        <div className="bg-dark-blue w-full h-full flex flex-col justify-between rounded-lg shadow-2 ext-gray-200 px-4 md:px-8 py-6">
                <h3 className="text-xl text-gray-200 font-open font-bold border-b border-white mr-4">
                    Do First
                </h3>
            <div className="w-full h-2/10 flex flex-col justify-center text-gray-200">
                <p className="mb-2">Where are you from?</p>
                <input id="title" className="md:w-88 text-sm md:text-xl px-4 py-2 mb-4 rounded-lg shadow-2 text-gray-700 bg-gray-300" name="title" type="text" placeholder="La Llorona" 
                // value={input.title} onChange={handleInputChange}
                />
            </div>
            <div className="w-full h-8/10 flex flex-col justify-center text-gray-200">
                <p className="mb-2">Write 3-5 facts about what that means to you and and your family.</p>
                <textarea id="text" className="bg-gray-300 w-full h-full p-8 text-sm md:text-2xl text-gray-800 rounded-lg shadow-2" 
                // value={editInput.text} onChange={handleChange}
                />
            </div>
        </div>
    )
}

export default DoFirst;