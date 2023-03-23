import Placeholder from '@components/Atoms/Placeholder';
import {LessonCardProps} from '@interfaces/ClassroomInterface';
import {getImageFromS3Static} from '@utilities/services';
import {AiOutlineClockCircle} from 'react-icons/ai';
import {MinutesToHHMM} from 'utilities/time';

import Start from '../../Start';

const BottomBar = (props: LessonCardProps) => {
  const {
    isTeacher,
    preview = false,
    activeRoomInfo,
    roomID,
    lessonProps,
    syllabusProps,
    accessible,

    lessonProgress = 0,
    isCompleted
  } = props;

  const startButtonProps = {
    preview: preview,
    roomID: roomID || '',
    isTeacher: Boolean(isTeacher),
    lessonKey: lessonProps ? lessonProps.lessonID : null,
    isActive: activeRoomInfo?.activeLessons?.includes(lessonProps?.lessonID),
    open: lessonProps && lessonProps?.status?.toLowerCase() === 'active' ? true : false,
    isCompleted: Boolean(isCompleted),
    accessible: Boolean(accessible),
    type: lessonProps.lesson.type,
    activeRoomInfo: activeRoomInfo,
    lessonProps: lessonProps?.lesson,
    syllabusProps: syllabusProps,
    isUsed: lessonProps?.lesson?.isUsed,
    lessonProgress
  };

  return (
    <div>
      <div
        style={{borderTop: '1px solid rgba(237, 242, 247,1)'}}
        className={`bg-transparent py-2 relative flex justify-around items-center px-4 `}>
        {/* TIME */}
        <div className={`flex justify-center items-center sm:w-3/10 w-2/5 text-gray-500`}>
          <div className="w-auto text-gray-500">
            <AiOutlineClockCircle className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div
            className={`w-auto mx-1 sm:mx-2 text-sm whitespace-pre 2xl:text-base text-gray-500`}>
            {MinutesToHHMM(lessonProps.lesson?.totalEstTime)}
          </div>
        </div>

        {/* TEACHER */}
        <div className={`flex justify-center items-center md:w-5/10 w-auto md:mr-2`}>
          <div className="w-auto text-gray-500">
            <Placeholder
              size="h-6 w-6 sm:h-8 sm:w-8"
              firstName={activeRoomInfo?.teacher?.firstName}
              lastName={activeRoomInfo?.teacher?.lastName}
              image={getImageFromS3Static(activeRoomInfo?.teacher?.image)}
            />
          </div>

          {/*
           * SHOW TEACHER NAME
           */}
          {typeof activeRoomInfo !== 'undefined' ? (
            <div
              className={`w-auto mx-1 sm:mx-2 text-sm whitespace-pre 2xl:text-base text-gray-500`}>
              {activeRoomInfo?.teacher?.firstName} {activeRoomInfo?.teacher?.lastName}
            </div>
          ) : null}
        </div>

        {/* START */}
        <div className="w-4/10 hidden sm:block">
          <Start {...startButtonProps} />
        </div>
      </div>
      <div className="w-full p-4 block sm:hidden">
        <Start {...startButtonProps} />
      </div>
    </div>
  );
};

export default BottomBar;
