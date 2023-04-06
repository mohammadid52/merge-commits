import {Tabs, TabsProps} from 'antd';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import CoursePartner from './CoursePartner';
import SubjectProficiency from './SubjectProficiency';

const CourseDynamics = ({roomData}: any) => {
  const {userLanguage} = useGlobalContext();
  const {RoomDetailsDict} = useDictionary();

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: RoomDetailsDict[userLanguage].SUBJECT_PROFICIENCY,
      children: <SubjectProficiency roomData={roomData} />
    },
    {
      key: '2',
      label: RoomDetailsDict[userLanguage].COURSE_PARTNERS,
      children: <CoursePartner roomData={roomData} />
    }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <div className="p-4">
        <Tabs animated defaultActiveKey="1" items={items} />
      </div>
    </div>
  );
};

export default CourseDynamics;
