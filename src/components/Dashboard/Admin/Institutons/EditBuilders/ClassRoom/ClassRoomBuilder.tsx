import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {useEffect, useState} from 'react';
import {useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';

import {getInstitution, getRoom} from 'customGraphql/customQueries';
import {useQuery} from 'customHooks/urlParam';

import {getLocalStorageData} from '@utilities/localStorage';
import StepComponent, {IStepElementInterface} from 'atoms/StepComponent';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {listStaff, listCurricula} from 'graphql/queries';
import PageLayout from 'layout/PageLayout';
import ModalPopUp from 'molecules/ModalPopUp';
import {getFilterORArray} from 'utilities/strings';
import EditClass from '../EditClass';
import ClassRoomForm, {fetchSingleCoTeacher} from './ClassRoomForm';
import CourseDynamics from './CourseDynamics/CourseDynamics';
import CourseSchedule from './CourseSchedule';

interface ClassRoomBuilderProps {
  instId: string;
}

const ClassRoomBuilder = (props: ClassRoomBuilderProps) => {
  const {instId} = props;
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const {roomId}: any = useParams();
  const params = useQuery(location.search);
  const step = params.get('step');

  const {userLanguage} = useGlobalContext();

  const [activeStep, setActiveStep] = useState('overview');
  const [roomData, setRoomData] = useState<any>({});

  const [curricularList, setCurricularList] = useState<any[]>([]);
  const [_, setPrevName] = useState('');
  const [selectedCurrID, setSelectedCurrID] = useState('');
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });

  const {LessonEditDict, RoomEDITdict} = useDictionary();

  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonEditDict[userLanguage]['MESSAGES']['UNSAVE']
  });

  const onModalSave = () => {
    toggleModal();
    history.goBack();
  };

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show
    });
  };

  const getInstituteInfo = async (instId: string) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(getInstitution, {
          id: instId
        })
      );
      setRoomData((prevData: any) => ({
        ...prevData,
        institute: {
          ...prevData.institute,
          name: list.data.getInstitution?.name
        }
      }));
      const serviceProviders = list.data.getInstitution?.serviceProviders?.items;
      return serviceProviders;
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unabletofetch'],
        isError: true
      });
    }
  };

  const getTeachersList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(listStaff, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')}
        })
      );
      const listStaffs = list.data.listStaff.items;
      if (listStaffs?.length === 0) {
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['addstaffirst'],
          isError: true
        });
      }
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unableteacher'],
        isError: true
      });
    }
  };

  const getCurricularList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(listCurricula, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')}
        })
      );
      const sortedList = list.data.listCurricula?.items.sort((a: any, b: any) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
      const curricularList = sortedList.map((item: any) => ({
        id: item.id,
        name: `${item.name ? item.name : ''}`,
        value: `${item.name ? item.name : ''}`
      }));
      setCurricularList(curricularList);
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unablecurricular'],
        isError: true
      });
    }
  };

  const filterCurricularData = (currId: string) => {
    const currentList = [...curricularList];
    const selectedCurr = currentList.find((item) => item.id === currId);
    setRoomData({
      ...roomData,
      curricular: {
        id: selectedCurr?.id,
        name: selectedCurr?.name,
        value: selectedCurr?.value
      }
    });
  };

  const fetchRoomDetails = async () => {
    const isRoomEditPage = match.url.search('room-edit') > -1;
    if (isRoomEditPage) {
      if (roomId) {
        try {
          const result: any = await API.graphql(graphqlOperation(getRoom, {id: roomId}));

          let savedData = result.data.getRoom;
          if (!savedData) {
            savedData = await fetchSingleCoTeacher(roomId);
            savedData = {
              ...savedData,
              coTeachers: savedData?.room?.coTeachers || [],
              curricula: {
                ...savedData.room.curricula
              },
              name: savedData.room.name,
              institution: savedData.room.institution,
              activeSyllabus: savedData?.room?.activeSyllabus,
              status: savedData?.room?.status,
              conferenceCallLink: savedData?.room?.conferenceCallLink,
              location: savedData?.room?.location,
              blockedStudents: savedData?.room?.blockedStudents
            };
          }

          const curricularId = savedData.curricula.items[0]?.curriculumID;

          const coTeachers = savedData.coTeachers?.items || [];
          setRoomData({
            ...savedData,
            institute: {
              id: savedData.institution?.id,
              name: savedData.institution?.name,
              value: savedData.institution?.name
            },
            advisorOptions: [
              ...coTeachers?.map((teacher: any) => ({
                id: teacher.teacherID,
                name: `${teacher.teacher.firstName} ${teacher.teacher.lastName}`,
                authId: teacher.teacherAuthID,
                email: teacher.teacherEmail
              })),
              savedData.teacher
                ? {
                    id: savedData.teacher.id,
                    name: `${savedData.teacher.firstName} ${savedData.teacher.lastName}`,
                    authId: savedData.teacher.authId,
                    email: savedData.teacher.email
                  }
                : null
            ].filter(Boolean)
          });
          setPrevName(savedData.name);
          setSelectedCurrID(curricularId);
        } catch (e) {
          console.error(e);
          setMessages({
            show: true,
            message: RoomEDITdict[userLanguage]['messages']['errfetch'],
            isError: true
          });
        }
      } else {
        history.push('/dashboard/manage-institutions');
      }
    } else {
      setRoomData({
        ...roomData,
        institute: {
          id: instId,
          name: '',
          value: ''
        }
      });
    }
  };

  const fetchOtherList = async () => {
    const items: any = await getInstituteInfo(roomData.institute?.id);
    const serviceProviders = items.map((item: any) => item.providerID);
    const allInstiId = [...serviceProviders, roomData.institute?.id];
    getTeachersList(allInstiId);
    getCurricularList(allInstiId);
  };

  useEffect(() => {
    if (step) {
      setActiveStep(step);
    }
  }, [step]);

  useEffect(() => {
    if (roomData?.institute?.id) {
      fetchOtherList();
    }
  }, [roomData?.institute?.id]);

  useEffect(() => {
    if (curricularList && curricularList?.length && selectedCurrID) {
      filterCurricularData(selectedCurrID);
    }
  }, [curricularList]);

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const handleTabSwitch = (step: string) => {
    const redirectionUrl = `${match.url}?step=${step}`;
    history.push(redirectionUrl);
  };

  const {classID} = roomData || getLocalStorageData('room_info');

  const steps: IStepElementInterface[] = [
    {
      title: RoomEDITdict[userLanguage].CLASS_DETAILS_TAB_HEADING,
      description: RoomEDITdict[userLanguage].CLASS_DETAILS_TAB_DESCRIPTION,
      stepValue: 'overview'
    },
    {
      title: RoomEDITdict[userLanguage].CLASS_STUDENT_TAB_HEADING,
      description: RoomEDITdict[userLanguage].CLASS_STUDENT_TAB_DESCRIPTION,
      stepValue: 'students',
      disabled: !roomId
    },
    {
      title: RoomEDITdict[userLanguage].CLASS_UNIT_PLANNER_TAB_HEADING,
      description: RoomEDITdict[userLanguage].CLASS_UNIT_PLANNER_TAB_DESCRIPTION,
      stepValue: 'unit-planner',
      disabled: !roomId
    },
    {
      title: RoomEDITdict[userLanguage].CLASS_DYNAMICS_TAB_HEADING,
      description: RoomEDITdict[userLanguage].CLASS_DYNAMICS_TAB_DESCRIPTION,
      stepValue: 'class-dynamics',
      disabled: !roomId
    }
  ];

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return <ClassRoomForm instId={instId} />;
      case 'students':
        return <EditClass instId={instId} classId={classID} roomData={roomData} />;
      case 'unit-planner':
        return <CourseSchedule roomData={roomData} />;
      case 'class-dynamics':
        return <CourseDynamics roomData={roomData} />;
      default:
        return <ClassRoomForm instId={instId} />;
    }
  };

  return (
    <PageLayout title={roomId ? RoomEDITdict[userLanguage]['TITLE'] : 'Add Classroom'}>
      <div className="w-full m-auto">
        <StepComponent
          steps={steps}
          activeStep={activeStep}
          handleTabSwitch={handleTabSwitch}
        />
        <div className="grid grid-cols-1 divide-x-0 divide-light">
          {/* <div className="border-0 lg:border-t-none border-light"> */}
          {currentStepComp(activeStep)}
          {/* </div> */}
        </div>
      </div>
      {messages.show ? (
        <div className="py-2 m-auto text-center">
          <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
            {messages?.message ? messages.message : ''}
          </p>
        </div>
      ) : null}

      <ModalPopUp
        open={warnModal.show}
        closeAction={toggleModal}
        saveAction={onModalSave}
        saveLabel="Yes"
        message={warnModal.message}
      />
    </PageLayout>
  );
};

export default ClassRoomBuilder;
