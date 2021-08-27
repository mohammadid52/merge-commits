import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';
import CourseSchedule from './CourseSchedule';
import ClassRoomForm from './ClassRoomForm';
import TabComponent from './TabComponent';

export interface IClassRoomDetailsProps {
  roomData: any;
}

const ClassRoomDetails = ({roomData}: IClassRoomDetailsProps) => {
  const [activeTab, setActiveTab] = useState('course-details');
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);

  const {RoomDetailsDict} = useDictionary(clientKey);

  const currentTabComp = (currentTab: string) => {
    switch (currentTab) {
      case 'course-details':
        return <ClassRoomForm />;
      case 'course-frequency':
        return <CourseSchedule roomData={roomData} />;
    }
  };

  return (
    <div className="bg-white shadow-5 overflow-hidden">
      <div className="p-4">
        <TabComponent
          tabs={[
            {
              name: RoomDetailsDict[userLanguage].COURSE_DETAILS,
              section: 'course-details',
            },
            {
              name: RoomDetailsDict[userLanguage].COURSE_FREQUENCY,
              section: 'course-frequency',
            },
          ]}
          activeTab={activeTab}
          handleTabSwitch={(tab: string) => setActiveTab(tab)}
        />
        {currentTabComp(activeTab)}
      </div>
    </div>
  );
};

export default ClassRoomDetails;
