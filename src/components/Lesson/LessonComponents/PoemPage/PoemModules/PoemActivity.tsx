import React, { useState, useContext } from 'react';
import WritingBlock from './WritingBlock';
import InstructionBlock from './InstructionBlock';
import ToolBar from './ToolBar';
import Banner from './Banner';
import EditBlock from './EditBlock';
import InstructionsPopup from '../../../Popup/InstructionsPopup';
import { LessonContext } from '../../../../../contexts/LessonContext';

const PoemActivity = () => {
    const { state } = useContext(LessonContext);
    const [ editMode, setEditMode ] = useState({
        open: false,
        input: '',
    });
    const { video, link, text } = state.data.activity.instructions
    const [ openPopup, setOpenPopup ] = useState(false);

    return (
        <>
            <InstructionsPopup video={video} open={openPopup} setOpen={setOpenPopup}/>
            <div className="w-full h-200 flex flex-col items-center">
                <Banner />
                <div className="w-full h-168 flex flex-row">
                    <div className="w-7/12 h-168 flex flex-col w-full h-screen mr-2">
                        {   !editMode.open ?
                            <WritingBlock editMode={editMode} setEditMode={setEditMode}/>
                            :
                            <EditBlock editMode={editMode}/>
                        }
                    </div>
                    <div className="w-5/12 h-168 flex flex-col ml-2">
                        <InstructionBlock editMode={editMode.open} />
                        <ToolBar editMode={editMode} setEditMode={setEditMode} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default PoemActivity;