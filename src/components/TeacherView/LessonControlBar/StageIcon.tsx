import React, { useContext, ReactNode, useState } from 'react';
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
import { LessonControlContext } from '../../../contexts/LessonControlContext';

interface StageIconProps {
    stage: string,
    type: string,
    active: boolean,
    open: boolean,
    disabled: boolean,
    breakdown: boolean,
    menuOpen: boolean
    handleOpenMenu: (stage: string) => void
}

const StageIcon = (props: StageIconProps) => {
    const { stage, type, active, breakdown, open, menuOpen, handleOpenMenu, disabled } = props;
    const { state, dispatch } = useContext(LessonControlContext);
    const match = useRouteMatch();
    const history = useHistory();

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

    const handleView = () => {
        if (stage === '') {
            handleOpenMenu(null)
            return history.push(`${match.url}`)
        }
        handleOpenMenu(null)
        return history.push(`${match.url}/${stage}`)
    }

    const handleStateChange = (type: string) => {
        dispatch({type: type, payload: stage})
        handleOpenMenu(null)
    }

    const iconColor = !open && !disabled ? '#A0AEC0' :'#EDF2F7';
    
    const coinColor = disabled ? 'bg-red-600' : open ? 'bg-green-500' : 'bg-gray-400'

    if ( type === 'breakdown' ) {
        return (
            <div className={`relative h-12 w-12 flex flex-col justify-center items-center rounded-full z-20 shadow-elem-light`} onClick={() => {handleOpenMenu(stage)}}>
                <IconContext.Provider value={{ color: iconColor, size: '1.5rem' }}>
                    <div className={`${ coinColor } h-10 w-10 flex justify-center items-center rounded-full z-30`}>
                        { iconSwitch(type) }
                    </div>
                </IconContext.Provider>
                {
                    menuOpen ? 
                    <div className={`absolute flex flex-col items-center transform translate-y-20`}>
                        <div className={`arrow-up`}></div>
                        <div className={`flex w-32 h-20 bg-gray-200 p-1 rounded-lg shadow-elem-light`}>
                            <div className={`flex flex-wrap justify-around w-full h-full bg-gray-400 rounded-lg`}>
                                <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg mx-1 mt-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={handleView}>
                                    View
                                </div>
                                <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg mr-1 mt-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={() => handleStateChange('OPEN_LESSON')}>
                                    Open
                                </div>
                                <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={() => handleStateChange('CLOSE_LESSON')}>
                                    Close
                                </div>
                                <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg my-1 mr-1 shadow-elem-light active:shadow-none active:shadow-none cursor-pointer`} onClick={() => handleStateChange('DISABLE_LESSON')}>
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
            <div className={`bg-gray-200 h-16 w-16 rounded-full flex items-center justify-center shadow-elem-light`} onClick={() => {handleOpenMenu(stage)}}>
                 <IconContext.Provider value={{ color: iconColor, size: '2rem' }}>
                    <div className={`h-14 w-14 rounded-full flex flex-col justify-center items-center ${ coinColor } z-30`}>
                        { iconSwitch(type) }
                    </div>
                </IconContext.Provider>
            </div>
            {
                menuOpen ? 
                <div className={`absolute flex flex-col items-center transform translate-y-20 z-100`}>
                    <div className={`arrow-up`}></div>
                    <div className={`flex w-32 h-20 bg-gray-200 p-1 rounded-lg shadow-elem-light`}>
                        <div className={`flex flex-wrap justify-around w-full h-full bg-gray-400 rounded-lg`}>
                            <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg mx-1 mt-1 shadow-elem-light active:shadow-none cursor-pointer active:shadow-none cursor-pointer`} onClick={handleView}>
                                View
                            </div>
                            <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg mr-1 mt-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={() => handleStateChange('OPEN_LESSON')}>
                                Open
                            </div>
                            <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={() => handleStateChange('CLOSE_LESSON')}>
                                Close
                            </div>
                            <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg my-1 mr-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={() => handleStateChange('DISABLE_LESSON')}>
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