import React, { useContext, ReactNode, useState, ReactElement } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { IconContext } from "react-icons/lib/esm/iconContext";
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
import FooterLabels from '../../General/LabelSwitch';

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

    const iconLabel = (): ReactElement => {
        return (
          <div
            className={`absolute w-20 transform translate-y-8 mt-3 text-center font-light text-dark text-sm`}>
            {
                <FooterLabels label=
                {props.type.charAt(0).toUpperCase()+props.type.slice(1)} />
                /* Capitalize the first letter */
                
            }
          </div>
        );
      };

    const handleView = () => {
        if (stage === '') {
            handleOpenMenu(null)
            return history.push(`${match.url}`)
        }
        handleOpenMenu(null)
        dispatch({ type: 'QUIT_STUDENT_VIEWING' })
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
            <div className={`relative h-12 w-12 flex flex-col justify-center items-center rounded-full shadow-elem-light`} onClick={() => {handleOpenMenu(stage)}}>
                <IconContext.Provider value={{ color: iconColor, size: '1.5rem' }}>
                    <div className={`${ coinColor } h-10 w-10 flex justify-center items-center rounded-full `}>
                        { iconSwitch(type) }
                    </div>
                    {iconLabel()}
                </IconContext.Provider>
                {
                    menuOpen ? 
                    <div className={`absolute flex flex-col items-center transform translate-y-8 z-100`}>
                        <div className={`arrow-up`}></div>
                        <div className={`flex w-48 h-16 bg-gray-200 p-1 rounded-lg shadow-elem-light z-100`}>
                            <div className={`flex w-full h-full bg-gray-400 rounded-lg z-100`}>
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

    return (
        <div className={`relative ${ breakdown ? 'flex-grow' : 'flex-grow-0'} w-auto flex flex-col justify-around items-center`}>
            <div className={`bg-gray-200 h-16 w-16 rounded-full flex items-center justify-center shadow-elem-light`} onClick={() => {handleOpenMenu(stage)}}>
                 <IconContext.Provider value={{ color: iconColor, size: '2rem' }}>
                    <div className={`h-14 w-14 rounded-full flex flex-col justify-center items-center ${ coinColor }`}>
                        { iconSwitch(type) }
                    </div>
                    <div className="w-20 mt-1 absolute">
                    {iconLabel()}
                    </div>
                </IconContext.Provider>
            </div>
            {
                menuOpen ? 
                <div className={`absolute flex flex-col items-center transform translate-y-12 z-100`}>
                    <div className={`arrow-up`}></div>
                    <div className={`flex w-48 h-16 bg-gray-200 p-1 rounded-lg shadow-elem-light z-100`}>
                            <div className={`flex w-full h-full bg-gray-400 rounded-lg z-100`}>
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