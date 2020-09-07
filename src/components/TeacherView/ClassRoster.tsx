import React, { useContext, useEffect } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { studentObject } from '../../state/LessonControlState'

const ClassRoster = () => {
    const { state, dispatch } = useContext(LessonControlContext);

    // console.log(state.roster)

    const handleSelect = (e: any) => {
        const { id } = e.target
        const selected = state.roster.filter((item: any) => {
            return item.id === id
        });

        console.log('selected student', id, selected[0]);

        dispatch({ type: 'SET_STUDENT_VIEWING', payload: selected[0] })
    
    } 

    useEffect(() => {
        console.log(state.studentViewing)
    }, [state.studentViewing])

    const studentStatus = (status: string) => {
        switch(status) {
            case 'ACTIVE':
                return (
                    <div className="flex justify-center items-center">
                        <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-green-400"></span>
                    </div>
                )
            case 'IDLE':
                return (
                    <div className="flex justify-center items-center ">
                        <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-gray-400"></span>
                    </div>
                )
            case 'OFFLINE':
                return (
                    <div className="flex justify-center items-center ">
                        <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-red-400"></span>
                    </div>
                )
            default:
                return (
                    <div className="flex justify-center items-center ">
                        <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-gray-400"></span>
                    </div>
                )

                // case 'ONLINE':
                //     return (
                //         <span className="w-auto px-2 inline-flex text-base leading-5 font-semibold uppercase rounded-full bg-green-100 text-green-800">
                //             ONLINE
                //         </span>
                //     )
                // case 'IDLE':
                //     return (
                //         <span className="w-auto px-2 inline-flex text-base leading-5 font-semibold uppercase rounded-full bg-yellow-100 text-yellow-700">
                //             IDLE
                //         </span>
                //     )
                // case 'OFFLINE':
                //     return (
                //         <span className="w-auto px-2 inline-flex text-base leading-5 font-semibold uppercase rounded-full bg-red-100 text-red-800">
                //             OFFLINE
                //         </span>
                //     )
                // default:
                //     return (
                //         <span className="w-auto px-2 inline-flex text-base leading-5 font-semibold uppercase rounded-full bg-gray-100 text-gray-600">
                //             N/A
                //         </span>
                //     )
        }
    }

    return (
        <div className={`w-full h-full bg-gray-500 shadow-inner-dark rounded-lg pt-4 px-4 overflow-scroll`}>
            <div className={`w-full flex justify-center font-bold`}>
                <div className={`w-1.5/10 mx-2 text-center`}>
                    Status
                </div>
                <div className={`w-4/10 mx-2`}>
                    Name
                </div>
                <div className={`w-3/10 mx-2`}>
                    Page
                </div>
                <div className={`w-1/10 mx-2`}>
                    
                </div>
            </div>
            <div className={`w-full h-full flex flex-col items-center`}>
                {
                    state.roster && state.roster.length > 0 ? 
                    state.roster.map((item: any, key: number) => (
                        <div key={key} className={`w-full flex my-2`}>
                            <div className={`w-1.5/10 text-center mx-2 text-xs flex`}>
                                {studentStatus(item.status)}
                            </div>
                            <div className={`w-4/10 mx-2`}>
                                {item.student.lastName}, {item.student.preferredName ? item.student.preferredName : item.student.firstName }
                            </div>
                            <div className={`w-2/10 mx-2`}>
                                {item.lessonProgress}
                            </div>
                            <div id={`${item.id}`} className="w-2/10 flex justify-center items-center cursor-pointer whitespace-no-wrap text-right text-sm leading-5 font-medium">
                                <button id={`${item.id}`} key={key} className="bg-indigo-500 w-9/10 shadow-elem-semi-dark rounded-xl text-gray-200 hover:text-white" onClick={handleSelect}>
                                    { state.studentViewing.studentInfo && state.studentViewing.studentInfo.id === item.id ? 'Quit' : 'View' }
                                </button>
                            </div>
                        </div>
                    )) : null
                }  
            </div>
        </div>
    )
}

export default ClassRoster;