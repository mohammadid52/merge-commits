import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';

interface TodayUpcomingTabs {
  isTeacher?: boolean;
  lessonGroupCount: { today: string; upcoming: string; completed: string };
  visibleLessonGroup: string;
  setVisibleLessonGroup: React.Dispatch<React.SetStateAction<string>>;
}

const TodayUpcomingTabs = (props: TodayUpcomingTabs) => {
  const { isTeacher, lessonGroupCount, visibleLessonGroup, setVisibleLessonGroup } = props;
  const { state, theme } = useContext(GlobalContext);

  useEffect(() => {
    setVisibleLessonGroup('today');
  }, []);

  const handleTabClick = (e: React.MouseEvent) => {
    const { id } = e.target as HTMLElement;

    if (id !== visibleLessonGroup) {
      if (id !== 'lessonGroupTabs') {
        setVisibleLessonGroup(id);
      }
    }
  };

  return (
    <div id={`lessonGroupTabs`} className={`flex flex-row`} onClick={handleTabClick}>
      <h2
        id={`today`}
        className={`w-auto cursor-pointer ${theme.dashboard.sectionTitle} ${
          visibleLessonGroup === 'today'
            ? 'text-black'
            : 'text-gray-400 hover:text-gray-800 transition duration-500 ease-in-out'
        }`}>
        {!isTeacher ? "Today's Lesson" : 'Teach Lessons'}
      </h2>

      {!isTeacher ? (
        <h2
          id={`upcoming`}
          className={`w-auto ml-4 cursor-pointer ${theme.dashboard.sectionTitle} ${
            visibleLessonGroup === 'upcoming'
              ? 'text-black'
              : 'text-gray-400 hover:text-gray-800 transition duration-500 ease-in-out'
          }`}>
          Upcoming ({lessonGroupCount.upcoming})
        </h2>
      ) : null}

      <h2
        id={`completed`}
        className={`w-auto ml-4 cursor-pointer ${theme.dashboard.sectionTitle} ${
          visibleLessonGroup === 'completed'
            ? 'text-black'
            : 'text-gray-400 hover:text-gray-800 transition duration-500 ease-in-out'
        }`}>
        Completed ({lessonGroupCount.completed})
      </h2>
    </div>
  );
};

export default TodayUpcomingTabs;
