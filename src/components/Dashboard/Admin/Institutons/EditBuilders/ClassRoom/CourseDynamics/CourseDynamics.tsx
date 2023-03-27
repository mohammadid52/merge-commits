import {
  Tabs3,
  useTabs
} from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/Tabs';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {useQuery} from 'customHooks/urlParam';
import {useEffect} from 'react';
import {useLocation} from 'react-router';
import CoursePartner from './CoursePartner';
import SubjectProficiency from './SubjectProficiency';

const CourseDynamics = ({roomData}: any) => {
  const {userLanguage} = useGlobalContext();
  const {RoomDetailsDict} = useDictionary();
  const location = useLocation();
  const params = useQuery(location.search);
  const subStep = params.get('sub-step');

  const tabs = [
    {
      name: RoomDetailsDict[userLanguage].SUBJECT_PROFICIENCY,
      current: true
    },
    {
      name: RoomDetailsDict[userLanguage].COURSE_PARTNERS,
      current: false
    }
  ];

  const {curTab, setCurTab} = useTabs(tabs);

  useEffect(() => {
    if (subStep) {
      setCurTab(subStep);
    }
  }, [subStep]);

  const currentTabComp = (currentTab: string) => {
    switch (currentTab) {
      case RoomDetailsDict[userLanguage].SUBJECT_PROFICIENCY:
        return <SubjectProficiency roomData={roomData} />;
      case RoomDetailsDict[userLanguage].COURSE_PARTNERS:
        return <CoursePartner roomData={roomData} />;
      default:
        return <SubjectProficiency roomData={roomData} />;
    }
  };

  return (
    <div className="bg-white shadow-5 overflow-hidden">
      <div className="p-4">
        <Tabs3 tabs={tabs} curTab={curTab} setCurTab={setCurTab} />
        {currentTabComp(curTab)}
      </div>
    </div>
  );
};

export default CourseDynamics;
