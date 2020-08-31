import React, { useState, useEffect, useContext } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
import { useCookies } from 'react-cookie';
import { BsQuestion } from 'react-icons/bs';

// interface EditBlockProps {
//     editMode: {
//         open: boolean;
//         input: string;
//     }
// }

const DoFirst = () => {
    const { state, dispatch } = useContext(LessonContext);
    const  doFirstComponent  = state.data.lesson.doFirst.questions.items;
    const [input, setInput] = useState([]);
    console.log(doFirstComponent, 'do first')
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

    const handleInputChange = (e: { target: { id: string; value: string; }; }) => {
        setInput({
            ...input,
            [e.target.id]: e.target.value
        })
    }

    return (
        <div className="bg-dark-blue w-full h-full rounded-lg shadow-2 ext-gray-200 px-4 md:px-8 py-6">
                <h3 className="w-full text-4xl text-gray-200 font-open font-bold border-b border-white mr-4 mb-4">
                    Do First
                </h3>
            <div className="w-full h-8/10 flex flex-col justify-evenly text-gray-200">
                {doFirstComponent.map((item: {question: any}, key: number) => (
                    
                    <>
                    {console.log(item.question)}
                    <p className="text-xl my-8">{item.question.question}</p>
                    <textarea className={`${item.question.type === 'input' ? 'h-2/10 p-2' : 'h-full p-8'} bg-gray-300 w-full text-sm md:text-2xl text-gray-800 rounded-lg shadow-2`} 
                    value={input} 
                    // onChange={handleInputChange}
                />
                    
                    </>
                ) )}
                
            </div>
        </div>
    )
}

export default DoFirst;