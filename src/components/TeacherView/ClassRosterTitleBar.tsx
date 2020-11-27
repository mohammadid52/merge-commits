import React, { useContext } from 'react';
import { LessonControlContext } from '../../contexts/LessonControlContext';
import { IconContext } from "react-icons/lib/esm/iconContext";
import { BsPersonFill } from 'react-icons/bs';
import { FaRegThumbsUp } from 'react-icons/fa';

import ToolTip from '../General/ToolTip/ToolTip';

interface ClassRosterTitleBar {
  handleResetDoneCounter: () => void;
}

const ClassRosterTitleBar: React.FC<ClassRosterTitleBar> = (props: ClassRosterTitleBar) => {
  const { handleResetDoneCounter } = props;
  const { state } = useContext(LessonControlContext);

  return (
    <>
      <h2 className={`w-auto`}>Class Roster</h2>

      <h2 className={`w-3/10 flex justify-between`}>
        <div className="w-4/10 flex justify-around items-center relative">
          <ToolTip position='bottom' header='' content='students in class' display='none' fontSize='text-xs' />
          <div className="w-auto">
            <IconContext.Provider value={{ size: '2rem', style: { width: 'auto' } }}>
              <BsPersonFill />
            </IconContext.Provider>
          </div>
          <div className="w-auto">
            {state.roster.length}
          </div>
        </div>

        {/* <div className="w-4/10 flex justify-around items-center">
          <div className={`w-auto relative`} onClick={handleResetDoneCounter}>
            <ToolTip position='bottom'
              cursor
              header=''
              width='w-24'
              content={<div className="flex flex-col"><div>students who are ready</div> <p className="font-bold"> (click to reset)</p></div>}
              display='none' fontSize='text-xs' />
            {state.done.length === state.roster.length ?
              <IconContext.Provider value={{ size: '2rem', style: { width: 'auto' }, color: '#009e00' }}>
                <FaRegThumbsUp style={{ pointerEvents: 'none' }} />
              </IconContext.Provider>
              : state.done.length !== state.roster.length ?
                <IconContext.Provider value={{ size: '2rem', style: { width: 'auto' }, color: 'yellow' }}>
                  <FaRegThumbsUp style={{ pointerEvents: 'none' }} />
                </IconContext.Provider>
                :
                <IconContext.Provider value={{ size: '2rem', style: { width: 'auto' }, color: 'yellow' }}>
                  <FaRegThumbsUp style={{ pointerEvents: 'none' }} />
                </IconContext.Provider>
            }
          </div>
          <div className="w-auto">
            {state.done.length}
          </div>
        </div> */}


      </h2>
    </>
  )
}

export default ClassRosterTitleBar;