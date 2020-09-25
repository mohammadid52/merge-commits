import React, { useContext, ReactNode, useState, ReactElement } from 'react';
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
    iconID: string | number;
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
    const { iconID, stage, type, active, breakdown, open, menuOpen, handleOpenMenu, disabled } = props;
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

    const iconLabel = (centerFix: 'center' | 'noCenter'): ReactElement => {
        return (
          <p
            className={`absolute transform translate-y-8 text-center z-50 font-light text-blue-100
            ${centerFix === 'center' && 'left-1/2 -translate-x-1/2'} 
            ${centerFix === 'noCenter' && '-translate-x-1/2'} 
            ${state.currentPage === iconID ? 'text-opacity-75' : ''}
            ${state.currentPage !== iconID ? 'text-opacity-20' : ''}
            `}>
            {
                /* Capitalize the first letter */
                props.type.charAt(0).toUpperCase()+props.type.slice(1)
            }
          </p>
        );
      };

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
                    {iconLabel('noCenter')}
                </IconContext.Provider>
                {
                    menuOpen ? 
                    <div className={`absolute flex flex-col items-center transform translate-y-16`}>
                        <div className={`arrow-up`}></div>
                        <div className={`flex w-48 h-16 bg-gray-200 p-1 rounded-lg shadow-elem-light`}>
                            <div className={`flex w-full h-full bg-gray-400 rounded-lg`}>
                                <div className={`flex justify-center items-center w-3/10 h-8/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={handleView}>
                                    View
                                </div>
                                <div className={`flex justify-center items-center w-3/10 h-8/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={() => handleStateChange( !open ? 'OPEN_LESSON' : 'CLOSE_LESSON' )}>
                                    { !open ? 'Open' : 'Close' }
                                </div>
                                {/* <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={() => handleStateChange('CLOSE_LESSON')}>
                                    Close
                                </div> */}
                                <div className={`flex justify-center items-center w-3/10 h-8/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none active:shadow-none cursor-pointer`} onClick={() => handleStateChange('DISABLE_LESSON')}>
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
                    {iconLabel('noCenter')}
                </IconContext.Provider>
            </div>
            {
                menuOpen ? 
                <div className={`absolute flex flex-col items-center transform translate-y-16 z-100`}>
                    <div className={`arrow-up`}></div>
                    <div className={`flex w-48 h-16 bg-gray-200 p-1 rounded-lg shadow-elem-light`}>
                            <div className={`flex w-full h-full bg-gray-400 rounded-lg`}>
                            <div className={`flex justify-center items-center w-3/10 h-8/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={handleView}>
                                View
                            </div>
                            <div className={`flex justify-center items-center w-3/10 h-8/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={() => handleStateChange( !open ? 'OPEN_LESSON' : 'CLOSE_LESSON' )}>
                                { !open ? 'Open' : 'Close' }
                            </div>
                            {/* <div className={`flex justify-center items-center w-4/10 h-4/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none cursor-pointer`} onClick={() => handleStateChange('CLOSE_LESSON')}>
                                Close
                            </div> */}
                            <div className={`flex justify-center items-center w-3/10 h-8/10 bg-gray-200 text-gray-600 text-xs rounded-lg m-1 shadow-elem-light active:shadow-none active:shadow-none cursor-pointer`} onClick={() => handleStateChange('DISABLE_LESSON')}>
                                { !disabled ? 'Disable' : 'Enable' }
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