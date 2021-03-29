import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import useDictionary from '../../../customHooks/dictionary';
import SubSectionTab from '../../Atoms/SubSectionTab';

interface TodayUpcomingTabs {
  isTeacher?: boolean;
  lessonGroupCount: { today: number; upcoming: number; completed: number };
  visibleLessonGroup: string;
  setVisibleLessonGroup: React.Dispatch<React.SetStateAction<string>>;
}

const TodayUpcomingTabs = (props: TodayUpcomingTabs) => {
  const { isTeacher, lessonGroupCount, visibleLessonGroup, setVisibleLessonGroup } = props;
  const { state, theme, clientKey, userLanguage } = useContext(GlobalContext);
  const { classRoomDict } = useDictionary(clientKey);

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
      <SubSectionTab
        id={`today`}
        selectedCondition={visibleLessonGroup === 'today'}
        label={
          !isTeacher
            ? classRoomDict[userLanguage]['LESSON_TABS']['TAB_ONE']
            : classRoomDict[userLanguage]['LESSON_TABS']['TAB_TWO']
        }
        counter={lessonGroupCount.today}
      />

      {!isTeacher ? (
        <SubSectionTab
          id={`upcoming`}
          selectedCondition={visibleLessonGroup === 'upcoming'}
          label={`Upcoming`}
          counter={lessonGroupCount.upcoming}
        />
      ) : null}

      <SubSectionTab
        id={`completed`}
        selectedCondition={visibleLessonGroup === 'completed'}
        label={`Completed`}
        counter={lessonGroupCount.completed}
      />
    </div>
  );
};

export default TodayUpcomingTabs;
