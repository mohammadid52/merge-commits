import SearchInput from '@components/Atoms/Form/SearchInput';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import useAuth from '@customHooks/useAuth';
import useSearch from '@customHooks/useSearch';
import {LessonProps} from '@interfaces/ClassroomInterface';
import {Skeleton} from 'antd';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import useTailwindBreakpoint from 'customHooks/tailwindBreakpoint';
import {isNumber} from 'lodash';
import React, {Fragment, useEffect, useState} from 'react';
import {getLocalStorageData} from 'utilities/localStorage';
import {Empty} from '../Admin/LessonsBuilder/StepActionComponent/LearningEvidence/CourseMeasurementsCard';

import StandardLessonCard from './LessonCards/StandardLessonCard';

const groupBy = (item: any, key: string) =>
  item.reduce(
    (result: any, item: any) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item]
    }),
    {}
  );

const ClassroomsList: React.FC<LessonProps> = ({
  activeRoom,
  activeRoomInfo,
  isTeacher,

  lessonLoading,
  lessons,
  syllabus,
  handleLessonMutationRating,
  getLessonRating
}: LessonProps) => {
  // ~~~~~~~~~~ CONTEXT SPLITTING ~~~~~~~~~~ //
  const gContext = useGlobalContext();
  const state = gContext.state;
  const userLanguage = gContext.userLanguage;

  const {classRoomDict} = useDictionary();
  const [accessible, setAccessible] = useState<boolean>(true);
  const [lessonsBySession, setLessonsBySession] = useState<any>([]);

  const getRoomData = getLocalStorageData('room_info');
  const {onDemand} = useAuth();

  const [filteredList, setFilteredList] = useState([...lessons]);

  const {
    searchInput,
    setSearch,

    removeSearchAction,
    searchAndFilter
  } = useSearch([...lessons], ['lessonTitle']);

  const searchLesson = () => {
    const searched = searchAndFilter(searchInput.value);
    if (Boolean(searched)) {
      setFilteredList(searched);
    } else {
      removeSearchAction(() => setFilteredList([]));
    }
  };

  const finalList = searchInput.isActive ? filteredList : lessons;

  useEffect(() => {
    setAccessible(true);
  }, [finalList]);

  useEffect(() => {
    if (lessonLoading && lessonsBySession.length) {
      setLessonsBySession([]);
    }
  }, [lessonLoading, finalList]);

  const {breakpoint} = useTailwindBreakpoint();

  useEffect(() => {
    if (finalList?.length > 0) {
      const temp: any = [];
      const groupedData = groupBy(finalList, 'session');

      for (const [_, value] of Object.entries(groupedData)) {
        const associatedLessons: any = value;
        if (breakpoint === 'sm') {
          if (associatedLessons[0].lesson.type === 'survey') {
            temp.push({
              sessionHeading: associatedLessons[0].sessionHeading,
              lessons: value
            });
          }
        } else {
          temp.push({
            sessionHeading: associatedLessons[0].sessionHeading,
            lessons: value
          });
        }
      }
      setLessonsBySession(temp);
    }
  }, [finalList, breakpoint]);

  return (
    <>
      {lessonLoading ? (
        Array.from({length: 3}).map((_: any) => (
          <Fragment key={_}>
            <div className="mb-5">
              <Skeleton active paragraph={{rows: 4}} />
            </div>
          </Fragment>
        ))
      ) : lessonsBySession?.length ? (
        <>
          <SectionTitleV3
            fontSize="2xl"
            fontStyle="medium"
            title={`${isTeacher ? `${classRoomDict[userLanguage]['STEP']} 2:` : ''} ${
              classRoomDict[userLanguage]['LESSON_TITLE']
            } for ${state.roomData?.activeSyllabus?.name || 'loading'}`}
            subtitle={
              isTeacher
                ? classRoomDict[userLanguage]['LESSON_SUB_TITLE']
                : onDemand
                ? classRoomDict[userLanguage]['LESSON_SUB_TITLE_ASYNC']
                : 'To enter classroom, select open lesson for this week'
            }
            withButton={
              <SearchInput
                value={searchInput.value}
                onChange={setSearch}
                disabled={lessonLoading}
                onKeyDown={searchLesson}
                closeAction={removeSearchAction}
              />
            }
          />

          <div className="grid grid-cols-1 gap-5">
            {lessonsBySession.map((session: any, index: number) => (
              <Fragment key={`${session.sessionHeading}_${index}_${index}`}>
                {isNumber(session.sessionHeading) && (
                  <div className="relative mb-2">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true">
                      <div className="w-full border-t-0 border-gray-400"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span
                        className="px-2 text-sm text-gray-500 w-auto"
                        style={{
                          backgroundColor: '#f0f2f5'
                        }}>
                        {session.sessionHeading}
                      </span>
                    </div>
                  </div>
                )}
                {session.lessons.filter(Boolean).map((lesson: any, key: number) => {
                  if (lesson?.lesson?.id) {
                    return (
                      <div
                        id={`todayLesson_${lesson.lesson.id}_wrapper`}
                        key={`todayLesson_${lesson.lesson.id}_wrapper`}>
                        <StandardLessonCard
                          roomID={getRoomData?.id}
                          searchTerm={searchInput.value}
                          isTeacher={isTeacher}
                          keyProps={`todayLesson_${key}`}
                          activeRoomInfo={activeRoomInfo}
                          lessonProps={lesson}
                          syllabusProps={syllabus}
                          accessible={accessible}
                          user={state.user}
                          handleLessonMutationRating={handleLessonMutationRating}
                          getLessonRating={getLessonRating}
                        />
                      </div>
                    );
                  } else return <div key={`todayLesson_${lesson.lesson.id}_wrapper`} />;
                })}
              </Fragment>
            ))}
          </div>
        </>
      ) : !Boolean(activeRoomInfo?.activeSyllabus) ? (
        <Empty text="No active unit for this room" />
      ) : activeRoom !== '' && !lessonLoading && lessons?.length === 0 ? (
        <Empty text={classRoomDict[userLanguage].MESSAGES.NO_LESSONS} />
      ) : null}
    </>
  );
};

export default ClassroomsList;
