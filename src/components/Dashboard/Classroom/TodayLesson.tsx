import React, {Fragment, useContext, useEffect, useState} from 'react';
import {LessonProps} from './Classroom';
import StandardLessonCard from './LessonCards/StandardLessonCard';
import {GlobalContext} from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import {getLocalStorageData} from '../../../utilities/localStorage';
import ClassroomLoader from './ClassroomLoader';

const groupBy = (item: any, key: string) =>
  item.reduce(
    (result: any, item: any) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {}
  );

const Today: React.FC<LessonProps> = ({
  activeRoom,
  activeRoomInfo,
  isTeacher,
  lessonLoading,
  lessons,
  syllabus,
}: LessonProps) => {
  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useContext(GlobalContext);
  const state = gContext.state;
  const clientKey = gContext.clientKey;
  const userLanguage = gContext.userLanguage;

  const {classRoomDict} = useDictionary(clientKey);
  const [accessible, setAccessible] = useState<boolean>(true);
  const [lessonsBySession, setLessonsBySession] = useState<any>([]);

  const getRoomData = getLocalStorageData('room_info');

  useEffect(() => {
    setAccessible(true);
  }, [lessons]);

  useEffect(() => {
    if (lessonLoading && lessonsBySession.length) {
      setLessonsBySession([]);
    }
  }, [lessonLoading]);

  useEffect(() => {
    if (lessons?.length) {
      const temp: any = [];
      const groupedData = groupBy(lessons, 'session');
      for (const [key, value] of Object.entries(groupedData)) {
        const associatedLessons: any = value;
        temp.push({
          sessionHeading: associatedLessons[0].sessionHeading,
          lessons: value,
        });
      }
      setLessonsBySession(temp);
    }
  }, [lessons]);

  const emptyStyles = 'flex justify-center items-center w-full h-48';

  return (
    <>
      {classRoomDict && lessonLoading ? (
        Array(3)
          .fill(' ')
          .map((_: any, index: number) => (
            <Fragment key={index}>
              <ClassroomLoader />
            </Fragment>
          ))
      ) : lessonsBySession?.length ? (
        lessonsBySession.map((session: any, index: number) => (
          <Fragment key={index}>
            <div className="relative mb-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t-0 border-gray-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span
                  className="px-2 text-sm text-gray-500 w-auto"
                  style={{
                    backgroundColor: '#f0f2f5',
                  }}>
                  {session.sessionHeading}
                </span>
              </div>
            </div>
            {session.lessons.map((lesson: any, key: number) => {
              return (
                <div id={`todayLesson_${key}_wrapper`} key={`todayLesson_${key}_wrapper`}>
                  <StandardLessonCard
                    roomID={getRoomData.id}
                    isTeacher={isTeacher}
                    keyProps={`todayLesson_${key}`}
                    activeRoomInfo={activeRoomInfo}
                    lessonProps={lesson}
                    syllabusProps={syllabus}
                    accessible={accessible}
                    lessonType={lesson.type}
                  />
                </div>
              );
            })}
          </Fragment>
        ))
      ) : activeRoom !== '' && !lessonLoading && lessons?.length === 0 ? (
        <div className={`${emptyStyles}`}>
          <p className="text-center text-lg text-gray-500">
            {classRoomDict[userLanguage].MESSAGES.NO_LESSONS}
          </p>
        </div>
      ) : null}
    </>
  );
};

export default Today;
