import React, { useContext } from 'react';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import { AiOutlineClockCircle, AiOutlineUser } from 'react-icons/ai';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import { LessonCardProps } from '../../Classroom';
import Start from '../../Start';

const BottomBar = (props: LessonCardProps) => {
  const { theme } = useContext(GlobalContext);
  const { isTeacher, activeRoomInfo, lessonProps, accessible, lessonType } = props;

  return (
    <div
      className={`h-8 ${theme.dashboard.bg} flex justify-between text-sm ${
        lessonType === 'survey' ? 'rounded-b' : 'rounded-br'
      }`}>
      {/* FILLER */}
      {lessonType === 'survey' && (
        <div className={`flex justify-center items-center my-2 w-3.3/10 text-gray-300`} />
      )}

      {/* TIME */}
      <div className={`flex justify-center items-center my-2 w-3.3/10 text-gray-300`}>
        <div className="w-auto text-gray-300">
          <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
            <AiOutlineClockCircle />
          </IconContext.Provider>
        </div>
        <div className={`w-auto mx-4 text-xs text-gray-300`}>45 min.</div>
      </div>

      {/* TEACHER */}
      <div className={`flex justify-center items-center my-2 w-3.3/10`}>
        <div className="w-auto text-gray-300">
          {lessonType !== 'survey' && (
            <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
              <AiOutlineUser />
            </IconContext.Provider>
          )}
          {lessonType === 'survey' && (
            <p className='overflow-ellipsis overflow-hidden ... text-xs text-left'>
              Status:
              {accessible ? (
                <span className='ml-2 text-xs font-semibold text-green-400'>Open</span>
              ) : (
                <span className='ml-2 text-xs font-semibold text-gray-400'>Closed</span>
              )}
            </p>
          )}
        </div>
        {/*
        * SHOW TEACHER NAME
        */}
        <div className={`w-auto mx-4 text-xs text-gray-200`}>
          {
            lessonType !== 'survey' && typeof activeRoomInfo !== 'undefined'
              ? (
                `${activeRoomInfo?.teacher?.firstName} ${activeRoomInfo?.teacher?.lastName}`
              ) : null
          }
        </div>
      </div>

      {/* START */}
      <div className="flex w-3.3/10">
        <Start
          isTeacher={isTeacher}
          lessonKey={lessonProps ? lessonProps.id : null}
          open={lessonProps && lessonProps.status === 'Active' ? true : false}
          accessible={accessible}
          type={lessonType}
        />
      </div>
    </div>
  );
};

export default BottomBar;
