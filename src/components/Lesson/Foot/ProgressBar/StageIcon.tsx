import React, { useContext, ReactNode } from 'react';
import { LessonContext } from '../../../../contexts/LessonContext';
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
    disabled: boolean,
}

const StageIcon = (props: StageIconProps) => {
    const { stage, type, active, disabled, open, } = props;
    const { state, dispatch } = useContext(LessonContext);
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
            case 'survey':
                return <FaCheck />
            case 'profile':
                return <FaCheck />
            default:
                return <FaPencilRuler />
        }
    }
    
    const handleLink = () => {
        if (active) {
            let pageNumber = null;
            state.pages.map((page: { stage: string; }, key: any) => {
                if (page.stage === stage) {
                    pageNumber = key
                }
            })

            dispatch({type: 'SET_PAGE', payload: pageNumber})
            
            history.push(`${match.url}${stage !== "" ? `/${stage}` : ""}`)
        }
    }

    const iconColor = open || active ? '#EDF2F7' : '#A0AEC0';

    if ( disabled ) return null;

    if ( type === 'breakdown' ) {
        return (
            <div className="bg-gray-200 h-10 w-10 flex justify-center items-center rounded-full z-20" onClick={handleLink}>
                <IconContext.Provider value={{ color: iconColor, size: '1rem' }}>
                    <div className={`${ active ? 'bg-green-600'  : 'bg-gray-400'} h-8 w-8 flex justify-center items-center rounded-full z-30`}>
                        { iconSwitch(type) }
                    </div>
                </IconContext.Provider>
            </div>
        )
    }

    return (
        <div className={`flex-grow-0 w-auto flex flex-row justify-around items-center z-20`}>
            <div className={`bg-gray-200 h-12 w-12 rounded-full flex items-center justify-center ${ active ? 'cursor-pointer' : 'cursor-default'}`} onClick={handleLink}>
                 <IconContext.Provider value={{ color: iconColor, size: '1.5rem' }}>
                    <div className={`h-10 w-10 rounded-full flex flex-col justify-center items-center ${ active ? 'bg-green-600'  : 'bg-gray-400'} z-30`}>
                        { iconSwitch(type) }
                    </div>
                </IconContext.Provider>
            </div>
        </div>
    )
}

export default StageIcon;