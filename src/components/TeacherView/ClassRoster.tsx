import React, { useContext, useEffect } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { studentObject } from '../../state/LessonControlState'
import ProgressSwitch from '../General/LessonProgressSwitch';
import ToolTip from '../General/ToolTip/ToolTip';

interface classRosterProps {
    handleUpdateClassroom: () => Promise<void>
}

const ClassRoster = (props: classRosterProps) => {
    const { handleUpdateClassroom } = props;
    const { state, dispatch } = useContext(LessonControlContext);

    // console.log(state.roster)

    const handleSelect = async (e: any) => {
        const { id } = e.target
        const selected = state.roster.filter((item: any) => {
            return item.id === id
        });

        // console.log('selected', id, selected[0]);
        dispatch({ type: 'SET_STUDENT_VIEWING', payload: selected[0] })
    } 

    const initials = (lastName: string) => {
        let lastInitial = lastName.charAt(0).toUpperCase()
        return  lastInitial+'.';
    }

    useEffect(() => {
        // console.log(state.studentViewing) 
    
        if (state.studentViewing.studentInfo) {
            handleUpdateClassroom()
        }

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
                        <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-yellow-400"></span>
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
                    <div className="flex justify-center items-center">
                        <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-gray-400"></span>
                    </div>
                )
        }
    }

    return (
        <div className={`w-full h-full bg-gray-500 shadow-inner-dark rounded-lg pt-4 overflow-y-scroll overflow-x-auto`}>
            <div className={`w-full flex justify-center font-bold py-2 pl-4 pr-1 `}>
                <div className={`w-.5/10 mx-2 text-center`}>
                    
                </div>
                <div className={`w-4.8/10 mx-2`}>
                    Name
                </div>
                <div className={`w-4.5/10 mx-2`}>
                    Page
                </div>
                
            </div>
            <div className={`w-full flex flex-col items-center`}>
                {
                    state.roster && state.roster.length > 0 ? 
                    state.roster.map((item: any, key: number) => (
                        
                        <div key={key} id={`${item.id}`} className={`w-full flex py-2 pl-4 pr-1 hover:underline cursor-pointer ${ state.studentViewing.studentInfo && state.studentViewing.studentInfo.id === item.id ? 'bg-indigo-500' : '' }`} onClick={handleSelect}>
                            
                            <div id={`${item.id}`} className={`w-.5/10 text-center mx-2 text-xs flex`}>
                                {studentStatus(item.status)}
                            </div>
                            {/* <ToolTip position='bottom-right'  
                                        style='w-.7/10 px-2 z-100'
                                        id={`${item.id}`}
                                        header=''
                                        width='w-auto z-100'
                                        content= {item.student.email}
                                        fontSize= 'text-xs'/> */}
                            <div id={`${item.id}`} className={`w-4.8/10 mx-2 flex items-center`}>
                                {/* <ToolTip header='' position='hidden-bottom' display='none'
                                /> */}
                                {item.student.preferredName ? item.student.preferredName : item.student.firstName } {item.student.lastName}
                            </div>
                            <div id={`${item.id}`} className={`w-4.5/10 mx-2 flex justify-center items-center`}>
                                <ProgressSwitch label={item.lessonProgress} id={item.id}/>
                            </div>
                            
                            {/* <div id={`${item.id}`} className="w-1.3/10 flex justify-center items-center cursor-pointer whitespace-no-wrap text-right text-sm leading-5 font-medium">
                                <button id={`${item.id}`} key={key} className="text-xs bg-indigo-500 w-9/10 shadow-elem-semi-dark rounded-xl text-gray-200 hover:text-white focus:border-none" onClick={handleSelect}>
                                    { state.studentViewing.studentInfo && state.studentViewing.studentInfo.id === item.id ? 'Quit' : 'View' }
                                </button>
                            </div> */}
                        </div>
                    )) : null
                }  
            </div>
        </div>
    )
}

export default ClassRoster;