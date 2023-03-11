import React from "react";
import { AiOutlineClockCircle, AiOutlineUser } from "react-icons/ai";
import { MinutesToHHMM } from "utilities/time";
import { LessonCardProps } from "../../Classroom";
import Start from "../../Start";

const BottomBar = (props: LessonCardProps) => {
  const {
    isTeacher,
    preview = false,
    activeRoomInfo,
    roomID,
    lessonProps,
    syllabusProps,
    accessible,
    lessonType,
    lessonProgress = 0,
    isCompleted,
  } = props;

  const startButtonProps = {
    preview: preview,
    roomID: roomID || "",
    isTeacher: Boolean(isTeacher),
    lessonKey: lessonProps ? lessonProps.lessonID : null,
    isActive: activeRoomInfo?.activeLessons?.includes(lessonProps?.lessonID),
    open:
      lessonProps && lessonProps?.status?.toLowerCase() === "active"
        ? true
        : false,
    isCompleted: Boolean(isCompleted),
    accessible: Boolean(accessible),
    type: lessonProps.lesson.type,
    activeRoomInfo: activeRoomInfo,
    lessonProps: lessonProps?.lesson,
    syllabusProps: syllabusProps,
    isUsed: lessonProps?.lesson?.isUsed,
    lessonProgress,
  };

  return (
    <div>
      <div
        className={`bg-transparent relative border-t-0 border-gray-200 flex justify-between text-base p-2 px-3 ${
          lessonType === "survey" ? "rounded-b" : "rounded-br"
        }`}
      >
        {/* TIME */}
        <div
          className={`flex justify-center items-center sm:w-3/10 w-2/5 text-gray-500`}
        >
          <div className="w-auto text-gray-500">
            <AiOutlineClockCircle className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div
            className={`w-auto mx-1 sm:mx-2 text-sm whitespace-pre 2xl:text-base text-gray-500`}
          >
            {MinutesToHHMM(lessonProps.lesson?.totalEstTime)}
          </div>
        </div>

        {/* TEACHER */}
        <div
          className={`flex justify-center items-center md:w-5/10 w-auto md:mr-2`}
        >
          <div className="w-auto text-gray-500">
            <AiOutlineUser className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>

          {/* {isTeacher && (
            <p className="overflow-ellipsis overflow-hidden text-base text-left">
              Status:
              {accessible ? (
                <span className="ml-2 text-base font-semibold text-green-400">Open</span>
              ) : (
                <span className="ml-2 text-base font-semibold text-red-600">Closed</span>
              )}
            </p>
          )} */}
          {/*
           * SHOW TEACHER NAME
           */}
          {typeof activeRoomInfo !== "undefined" ? (
            <div
              className={`w-auto mx-1 sm:mx-2 text-sm whitespace-pre 2xl:text-base text-gray-500`}
            >
              {activeRoomInfo?.teacher?.firstName}{" "}
              {activeRoomInfo?.teacher?.lastName}
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
