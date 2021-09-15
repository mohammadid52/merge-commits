import React from 'react';
import {AiOutlineClockCircle, AiOutlineUser} from 'react-icons/ai';
import {MinutesToHHMM} from '../../../../../utilities/time';
import {LessonCardProps} from '../../Classroom';
import Start from '../../Start';

const BottomBar = (props: LessonCardProps) => {
  const {
    isTeacher,
    preview = false,
    activeRoomInfo,
    roomID,
    lessonProps,
    accessible,
    lessonType,
  } = props;

  return (
    <div>
      <div
        className={`bg-transparent border-t-0 border-gray-200 flex justify-between text-base p-2 px-3 ${
          lessonType === 'survey' ? 'rounded-b' : 'rounded-br'
        }`}>
        {/* TIME */}
        <div className={`flex justify-center items-center sm:w-3/10 w-2/5 text-gray-500`}>
          <div className="w-auto text-gray-500">
            <AiOutlineClockCircle className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div
            className={`w-auto mx-2 sm:mx-4 text-sm whitespace-pre 2xl:text-base text-gray-500`}>
            {MinutesToHHMM(lessonProps.lesson?.totalEstTime)}
          </div>
        </div>

        {/* TEACHER */}
        <div className={`flex justify-center items-center sm:w-5/10 w-3/5 mr-2`}>
          <div className="w-auto text-gray-500">
            {lessonType !== 'survey' && (
              <AiOutlineUser className="w-4 h-4 sm:w-6 sm:h-6" />
            )}
            {lessonType === 'survey' && (
              <p className="overflow-ellipsis overflow-hidden text-base text-left">
                Status:
                {accessible ? (
                  <span className="ml-2 text-base font-semibold text-green-400">
                    Open
                  </span>
                ) : (
                  <span className="ml-2 text-base font-semibold text-red-600">
                    Closed
                  </span>
                )}
              </p>
            )}
          </div>
          {/*
           * SHOW TEACHER NAME
           */}
          <div className={`w-auto mx-2 sm:mx-4 text-sm sm:text-base text-gray-500`}>
            {lessonType !== 'survey' && typeof activeRoomInfo !== 'undefined'
              ? `${activeRoomInfo?.teacher?.firstName} ${activeRoomInfo?.teacher?.lastName}`
              : null}
          </div>
        </div>
        {/* FILLER */}
        {lessonType === 'survey' && (
          <div
            className={`flex justify-center items-center my-2 sm:w-3/10 w-3.3/10 text-gray-300`}
          />
        )}

        {/* START */}
        <div className="flex w-3.3/10 hidden sm:block">
          <Start
            preview={preview}
            roomID={roomID}
            isTeacher={isTeacher}
            lessonKey={lessonProps ? lessonProps.lessonID : null}
            isActive={activeRoomInfo?.activeLessons?.includes(lessonProps?.lessonID)}
            open={lessonProps && lessonProps.status === 'Active' ? true : false}
            isCompleted={
              activeRoomInfo?.completedLessons?.findIndex(
                (item: {lessonID?: string | null; time?: string | null}) =>
                  item.lessonID === lessonProps.lessonID
              ) > -1
            }
            accessible={accessible}
            type={lessonProps.lesson.type}
            activeRoomInfo={activeRoomInfo}
          />
        </div>
      </div>
      <div className="w-full block sm:hidden">
        <Start
          preview={preview}
          roomID={roomID}
          isTeacher={isTeacher}
          lessonKey={lessonProps ? lessonProps.lessonID : null}
          isActive={activeRoomInfo?.activeLessons?.includes(lessonProps?.lessonID)}
          open={lessonProps && lessonProps.status === 'Active' ? true : false}
          isCompleted={
            activeRoomInfo?.completedLessons?.findIndex(
              (item: {lessonID?: string | null; time?: string | null}) =>
                item.lessonID === lessonProps.lessonID
            ) > -1
          }
          accessible={accessible}
          type={lessonProps.lesson.type}
          activeRoomInfo={activeRoomInfo}
        />
      </div>
    </div>
  );
};

export default BottomBar;
