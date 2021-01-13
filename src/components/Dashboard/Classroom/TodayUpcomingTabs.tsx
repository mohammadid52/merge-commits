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
        className={`text-xl w-full ${theme.dashboard.sectionTitle} ${
          visibleLessonGroup === 'today' ? 'text-black' : 'text-gray-400'
        }`}>
        Today's Lesson
      </span>
      <span
        id={`upcoming`}
        className={`text-xl w-full ${theme.dashboard.sectionTitle} ${
          visibleLessonGroup === 'upcoming' ? 'text-black' : 'text-gray-400'
        }`}>
        Upcoming
      </span>
      <span
        id={`completed`}
        className={`text-xl w-full ${theme.dashboard.sectionTitle} ${
          visibleLessonGroup === 'completed' ? 'text-black' : 'text-gray-400'
        }`}>
        Completed
      </span>
    </div>
  );
}

export default TodayUpcomingTabs;
