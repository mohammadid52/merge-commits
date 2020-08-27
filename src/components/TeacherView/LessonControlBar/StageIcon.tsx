import React, { useContext, ReactNode, useState } from 'react';
import { LessonContext } from '../../../contexts/LessonContext';
import { useHistory, useRouteMatch } from "react-router-dom";
import { IconContext } from "react-icons";
import {
    FaHourglassStart,
    FaPencilRuler,
    FaTrophy,
    FaScroll,
    FaMusic,
    FaPenFancy,
    FaQuestion,
    FaMap,
    FaCheck,
} from 'react-icons/fa';

interface StageIconProps {
    stage: string,
    type: string,
    active: boolean,
    open: boolean,
    breakdown: boolean,
}

const StageIcon = (props: StageIconProps) => {
    const { stage, type, active, breakdown, open } = props;
    const [ menuOpen, setMenuOpen ] = useState(false);
    // const { state, dispatch } = useContext(LessonContext);
    // const match = useRouteMatch();
    // const history = useHistory();

    const iconSwitch = (type: string): ReactNode => {
        switch(type) {
            case 'intro':
                return <FaHourglassStart />
            case 'map-game':
                return <FaMap />
            case 'story':
                return <FaScroll />
            case 'lyrics':
                return <FaMusic />
            case 'poem':
                return <FaPenFancy />
            case 'breakdown':
                return <FaQuestion />
            case 'outro':
                return <FaTrophy />
            case 'sel':
                return <FaCheck />
            case 'profile':
                return <FaCheck />
            default:
                return <FaPencilRuler />
        }
    }
    
    const handleOpen = () => {
        setMenuOpen(!menuOpen)
    }

    const iconColor = open ? '#EDF2F7' : '#A0AEC0';

    if ( type === 'breakdown' ) {
        return (
            <div className="relative bg-gray-200 h-12 w-12 flex flex-col justify-center items-center rounded-full z-20 shadow-elem-light" onClick={handleOpen}>
                <IconContext.Provider value={{ color: iconColor, size: '1.5rem' }}>
                    <div className={`${ active ? 'bg-green-600'  : 'bg-gray-400'} h-10 w-10 flex justify-center items-center rounded-full z-30`}>
                        { iconSwitch(type) }
                    </div>
                </IconContext.Provider>
                {
                    menuOpen ? 
                    <div className={`absolute flex flex-col items-center transform translate-y-24`}>
                        <div className={`arrow-up`}></div>
                        <div className={`w-20 h-32 bg-gray-200 p-1 rounded-lg`}>
                            <div className={`w-full h-full bg-gray-400 p-2 rounded-lg`}>
                                <div className={`w-full h-1/4 my-1 text-gray-600`}>
                                    Open
                                </div>
                                <div className={`w-full h-1/4 my-1 text-gray-600`}>
                                    Close
                                </div>
                                <div className={`w-full h-1/4 my-1 text-gray-600`}>
                                    Disable
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        )
    }

    return (
        <div className={`relative ${ breakdown ? 'flex-grow' : 'flex-grow-0'} w-auto flex flex-col justify-around items-center z-20`}>
            <div className={`bg-gray-200 h-16 w-16 rounded-full flex items-center justify-center shadow-elem-light ${ active ? 'cursor-pointer' : 'cursor-default'}`} onClick={handleOpen}>
                 <IconContext.Provider value={{ color: iconColor, size: '2rem' }}>
                    <div className={`h-14 w-14 rounded-full flex flex-col justify-center items-center ${ active ? 'bg-green-600'  : 'bg-gray-400'} z-30`}>
                        { iconSwitch(type) }
                    </div>
                </IconContext.Provider>
            </div>
            {
                menuOpen ? 
                <div className={`absolute flex flex-col items-center transform translate-y-24`}>
                    <div className={`arrow-up`}></div>
                    <div className={`w-20 h-32 bg-gray-200 p-1 rounded-lg`}>
                        <div className={`w-full h-full bg-gray-400 p-2 rounded-lg`}>
                            <div className={`w-full h-1/4 my-1 text-gray-600`}>
                                Open
                            </div>
                            <div className={`w-full h-1/4 my-1 text-gray-600`}>
                                Close
                            </div>
                            <div className={`w-full h-1/4 my-1 text-gray-600`}>
                                Disable
                            </div>
                        </div>
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default StageIcon;