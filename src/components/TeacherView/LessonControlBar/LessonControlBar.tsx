import React, { useContext, useState } from 'react';
import StageIcon from './StageIcon';
import LessonControl from '../LessonControl';
import { LessonControlContext } from '../../../contexts/LessonControlContext';

interface LessonControlBarProps {
    setComponentView: React.Dispatch<React.SetStateAction<string>>
}

const LessonControlBar = (props: LessonControlBarProps) => {
    const { setComponentView } = props
    const { state } = useContext(LessonControlContext);
    const [ menuOpen, setMenuOpen ] = useState<null | string>(null);

    const handleOpenMenu = (stage: string) => {
        if ( menuOpen === stage ) {
            return setMenuOpen(null)
        } return setMenuOpen(stage)
    }

    return (
        <div className="hidden relative w-full h-1/10 md:flex flex-col items-center justify-center content-center px-4 z-0">
            <div className="w-full flex flex-row items-center justify-between">
                { 
                    state.pages.map((page: { stage: string; type: string; breakdown: boolean; open: boolean, disabled: boolean}, key: React.ReactText) => (
                        <StageIcon iconID={key} key={key} open={page.open} stage={page.stage} type={page.type} disabled={page.disabled} active={state.pages[key].active} breakdown={page.breakdown ? page.breakdown : null} menuOpen={ menuOpen === page.stage ? true : false } handleOpenMenu={handleOpenMenu} />
                    ))
                }
            </div>
        </div>
    )
}

export default LessonControlBar;