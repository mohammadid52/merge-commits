import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';

interface TodayUpcomingTabs {
  visibleLessonGroup: string;
  setVisibleLessonGroup: React.Dispatch<React.SetStateAction<string>>;
}

const TodayUpcomingTabs = (props: TodayUpcomingTabs) => {
  const { visibleLessonGroup, setVisibleLessonGroup } = props;
  const { state, theme } = useContext(GlobalContext);

  useEffect(()=>{
    setVisibleLessonGroup('today');
  },[])

  const handleTabClick = (e: React.MouseEvent) => {
    const { id } = e.target as HTMLElement;

    if (id !== visibleLessonGroup) {
      setVisibleLessonGroup(id);
    }
  };

  return (
    <div id={`lessonGroupTabs`} onClick={handleTabClick}>
      <span
        id={`today`}
        className={`w-full cursor-pointer ${theme.dashboard.sectionTitle} ${
          visibleLessonGroup === 'today' ? 'text-black' : 'text-gray-400 hover:text-gray-800 transition duration-500 ease-in-out text-sm font-semibold'
        }`}>
        Today's Lesson
      </span>
      <span
        id={`upcoming`}
        className={`w-full ml-4 cursor-pointer ${theme.dashboard.sectionTitle} ${
          visibleLessonGroup === 'upcoming' ? 'text-black' : 'text-gray-400 hover:text-gray-800 transition duration-500 ease-in-out text-sm font-semibold'
        }`}>
        Upcoming
      </span>
      <span
        id={`completed`}
        className={`w-full ml-4 cursor-pointer ${theme.dashboard.sectionTitle} ${
          visibleLessonGroup === 'completed' ? 'text-black' : 'text-gray-400 hover:text-gray-800 transition duration-500 ease-in-out text-sm font-semibold'
        }`}>
        Completed
      </span>
    </div>
  );
}

export default TodayUpcomingTabs;
