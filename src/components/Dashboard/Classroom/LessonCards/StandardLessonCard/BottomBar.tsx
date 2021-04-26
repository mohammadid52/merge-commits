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
      className={`bg-transparent border-t-0 border-gray-200 flex justify-between text-base p-2 px-3 ${
        lessonType === 'survey' ? 'rounded-b' : 'rounded-br'
      }`}>
      {/* TIME */}
      <div className={`flex justify-center items-center my-2 sm:w-3/10 w-3.3/10 text-gray-500`}>
        <div className="w-auto text-gray-500">
          <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
            <AiOutlineClockCircle />
          </IconContext.Provider>
        </div>
        <div className={`w-auto mx-4 text-base text-gray-500`}>45 min.</div>
      </div>

      {/* TEACHER */}
      <div className={`flex justify-center items-center my-2 sm:w-5/10 w-3.3/10 mr-2`}>
        <div className="w-auto text-gray-500">
          {lessonType !== 'survey' && (
            <IconContext.Provider value={{ size: '1.5rem', style: { width: 'auto' } }}>
              <AiOutlineUser />
            </IconContext.Provider>
          )}
          {lessonType === 'survey' && (
            <p className="overflow-ellipsis overflow-hidden text-base text-left">
              Status:
              {accessible ? (
                <span className="ml-2 text-base font-semibold text-green-400">Open</span>
              ) : (
                <span className="ml-2 text-base font-semibold text-red-600">Closed</span>
              )}
            </p>
          )}
        </div>
        {/*
         * SHOW TEACHER NAME
         */}
        <div className={`w-auto mx-4 text-base text-gray-500`}>
          {lessonType !== 'survey' && typeof activeRoomInfo !== 'undefined'
            ? `${activeRoomInfo?.teacher?.firstName} ${activeRoomInfo?.teacher?.lastName}`
            : null}
        </div>
      </div>
      {/* FILLER */}
      {lessonType === 'survey' && (
        <div className={`flex justify-center items-center my-2 sm:w-3/10 w-3.3/10 text-gray-300`} />
      )}

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
