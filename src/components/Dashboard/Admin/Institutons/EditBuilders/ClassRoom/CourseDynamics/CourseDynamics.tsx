import { useGlobalContext } from "contexts/GlobalContext";
import useDictionary from "customHooks/dictionary";
import { useQuery } from "customHooks/urlParam";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import TabComponent from "../TabComponent";
import CoursePartner from "./CoursePartner";
import SubjectProficiency from "./SubjectProficiency";

const CourseDynamics = ({ roomData }: any) => {
  const { userLanguage } = useGlobalContext();
  const { RoomDetailsDict } = useDictionary();
  const location = useLocation();
  const params = useQuery(location.search);
  const subStep = params.get("sub-step");

  const tabs = [
    {
      name: RoomDetailsDict[userLanguage].SUBJECT_PROFICIENCY,
      section: "subject-proficiency",
    },
    {
      name: RoomDetailsDict[userLanguage].COURSE_PARTNERS,
      section: "course-partners",
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].section);

  useEffect(() => {
    if (subStep) {
      setActiveTab(subStep);
    }
  }, [subStep]);

  const currentTabComp = (currentTab: string) => {
    switch (currentTab) {
      case "subject-proficiency":
        return <SubjectProficiency roomData={roomData} />;
      case "course-partners":
        return <CoursePartner roomData={roomData} />;
      default:
        return <SubjectProficiency roomData={roomData} />;
    }
  };

  return (
    <div className="bg-white shadow-5 overflow-hidden">
      <div className="p-4">
        <TabComponent
          tabs={tabs}
          activeTab={activeTab}
          handleTabSwitch={(tab: string) => setActiveTab(tab)}
        />
        {currentTabComp(activeTab)}
      </div>
    </div>
  );
};

export default CourseDynamics;
