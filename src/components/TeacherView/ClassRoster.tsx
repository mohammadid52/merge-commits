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

    /**
     * JASPER's GLORIOUS SORTING FUNCTION :D
     */
    const sortedRoster = state.roster.sort((a: any, b: any) => {
        if (a.student.role > b.student.role) {
            if (a.student.role !== 'ST') {
                return -1;
            } else {
                return 1;
            }
        }
        if (a.student.role < b.student.role) {
            if (b.student.role !== 'ST') {
                return 1;
            } else {
                return -1;
            }
        }
    })

    useEffect(() => {
        console.log(' sorted : ', sortedRoster);
    }, [])

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
        return lastInitial + '.';
    }

    useEffect(() => {
        console.log(state.studentViewing)

        // if (state.studentViewing.studentInfo) {
        //     handleUpdateClassroom()
        // }

    }, [state.studentViewing])



    const studentStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <div className="flex justify-center items-center">
                        <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-green-400 border border-white"></span>
                    </div>
                )
            case 'IDLE':
                return (
                    <div className="flex justify-center items-center ">
                        <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-yellow-400 border border-dark-gray"></span>
                    </div>
                )
            case 'OFFLINE':
                return (
                    <div className="flex justify-center items-center ">
                        <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-red-400 border border-dark-gray"></span>
                    </div>
                )
            default:
                return (
                    <div className="flex justify-center items-center">
                        <span className="inline-flex h-4 w-4 rounded-full text-white shadow-solid bg-gray-400 border border-dark-gray"></span>
                    </div>
                )
        }
    }

    return (
        <div className={`w-full h-full bg-dark-gray bg-opacity-20 border border-dark-gray rounded-lg overflow-y-scroll overflow-x-auto`}>
            <div className={`w-full flex justify-center font-medium py-3 pl-4 pr-1 bg-dark-gray bg-opacity-40`}>
                <div className={`w-.5/10 mx-2 text-center`}>

                </div>
                <div className={`w-4.3/10 mx-2`}>
                    Name
                </div>
                <div className={`w-1.5/10 mx-2`}>
                    Role
                </div>
                <div className={`w-3.5/10 mx-2`}>
                    Page
                </div>

            </div>
            <div className={`w-full flex flex-col items-center bg-dark-gray bg-opacity-20`}>
                {
                    state.roster && state.roster.length > 0 ?
                        sortedRoster.map((item: any, key: number) => (

                            <div key={key} id={`${item.id}`} className={`w-full flex py-2 pl-4 pr-1 hover:underline cursor-pointer 
                                    ${(key % 2 === 0) ? 'bg-white bg-opacity-20' : null} 
                                    ${state.studentViewing.studentInfo && state.studentViewing.studentInfo.id === item.id ? 'bg-blueberry bg-opacity-60' : ''}

                                    ${(typeof state.displayData.studentInfo === 'undefined')
                                                ? null
                                                : (state.displayData.studentInfo.firstName === item.student.firstName && state.displayData.studentInfo.lastName === item.student.lastName)
                                                    ? 'bg-yellow-500 bg-opacity-60'
                                                    : null}`}

                                onClick={handleSelect}>

                                <div id={`${item.id}`} className={`w-.5/10 text-center mx-2 text-xs flex`}>
                                    {studentStatus(item.status)}
                                </div>

                                <div id={`${item.id}`} className={`w-4.3/10 mx-2 flex items-center`}>
                                    {item.student.preferredName ? item.student.preferredName : item.student.firstName} {item.student.lastName}
                                </div>

                                <div id={`${item.id}`} className={`w-1.5/10 mx-2 ${item.student.role !== 'ST' ? 'text-center text-white bg-dark-gray rounded-lg' : 'font-semibold'} text-center `}>
                                    {item.student.role === 'ST' ? 'Student' : item.student.role}
                                </div>

                                <div id={`${item.id}`} className={`w-3.5/10 mx-2 flex justify-center items-center overflow-hidden`}>
                                    <ProgressSwitch label={item.currentLocation ? item.currentLocation : item.lessonProgress} id={item.id} />
                                </div>

                            </div>
                        )) : null
                }
            </div>
        </div>
    )
}

export default ClassRoster;