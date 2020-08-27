import React, { useContext } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';

interface props {
    setSelectedStudent: React.Dispatch<React.SetStateAction<number>>
}

const ClassRoster = (props: props) => {
    const { setSelectedStudent } = props
    const { state } = useContext(LessonControlContext);

    console.log(state.roster)

    const handleSelect = (e: any) => {
        const { id } = e.target
        setSelectedStudent(parseInt(id));
    } 

    const studentStatus = (status: string) => {
        switch(status) {
            case 'ONLINE':
                return (
                    <span className="w-auto px-2 inline-flex text-base leading-5 font-semibold uppercase rounded-full bg-green-100 text-green-800">
                        ONLINE
                    </span>
                )
            case 'IDLE':
                return (
                    <span className="w-auto px-2 inline-flex text-base leading-5 font-semibold uppercase rounded-full bg-yellow-100 text-yellow-700">
                        IDLE
                    </span>
                )
            case 'OFFLINE':
                return (
                    <span className="w-auto px-2 inline-flex text-base leading-5 font-semibold uppercase rounded-full bg-red-100 text-red-800">
                        OFFLINE
                    </span>
                )
            default:
                return (
                    <span className="w-auto px-2 inline-flex text-base leading-5 font-semibold uppercase rounded-full bg-gray-100 text-gray-600">
                        N/A
                    </span>
                )
        }
    }

    return (
        <div className={`w-full h-full bg-gray-500 shadow-inner-dark rounded-lg pt-4 px-4 overflow-scroll`}>
            <div className={`w-full flex justify-center font-bold`}>
                <div className={`w-2/10 mx-2`}>
                    Status
                </div>
                <div className={`w-4/10 mx-2`}>
                    Name
                </div>
                <div className={`w-2/10 mx-2`}>
                    Current Page
                </div>
                <div className={`w-2/10 mx-2`}>
                    
                </div>
            </div>
            <div className={`w-full h-full flex flex-col items-center`}>
                {
                    state.roster.length > 0 ? 
                    state.roster.map((item: any, key: number) => (
                        <div key={key} className={`w-full flex my-2`}>
                            <div className={`w-2/10 mx-2 text-xs`}>
                                {studentStatus(item.status)}
                            </div>
                            <div className={`w-4/10 mx-2`}>
                                {item.info.lastName}, {item.info.firstName}
                            </div>
                            <div className={`w-2/10 mx-2`}>
                                {item.progress}
                            </div>
                            <div id={`${key}`} className="w-2/10 flex justify-center items-center cursor-pointer whitespace-no-wrap text-right text-sm leading-5 font-medium" onClick={handleSelect} >
                                <div id={`${key}`} key={key} className="text-indigo-600 hover:text-indigo-900">View</div>
                            </div>
                        </div>
                    )) : null
                }  
            </div>
        </div>
    )
}

export default ClassRoster;