import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';

import * as customQueries from 'customGraphql/customQueries';
import {useQuery} from 'customHooks/urlParam';

import {getLocalStorageData} from '@utilities/localStorage';
import StepComponent, {IStepElementInterface} from 'atoms/StepComponent';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {LessonEditDict} from 'dictionary/dictionary.iconoclast';
import * as queries from 'graphql/queries';
import ModalPopUp from 'molecules/ModalPopUp';
import {BsArrowLeft} from 'react-icons/bs';
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

  const {clientKey, state, userLanguage} = useContext(GlobalContext);
  const isSuperAdmin: boolean = state.user.role === 'SUP';
  const [activeStep, setActiveStep] = useState('overview');
  const [roomData, setRoomData] = useState<any>({});

  const [curricularList, setCurricularList] = useState([]);
  const [prevName, setPrevName] = useState('');
  const [selectedCurrID, setSelectedCurrID] = useState('');
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });

  const {CommonlyUsedDict, RoomEDITdict} = useDictionary(clientKey);

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
        graphqlOperation(customQueries.getInstitution, {
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
        graphqlOperation(queries.listStaff, {
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
      } else {
        const sortedList = listStaffs.sort((a: any, b: any) =>
          a.staffMember?.firstName?.toLowerCase() >
          b.staffMember?.firstName?.toLowerCase()
            ? 1
            : -1
        );
        const filterByRole = sortedList.filter(
          (teacher: any) =>
            teacher.staffMember?.role === 'TR' || teacher.staffMember?.role === 'FLW'
        );
        const staffList = filterByRole.map((item: any) => ({
          id: item.staffMember?.id,
          name: `${item.staffMember?.firstName || ''} ${
            item.staffMember?.lastName || ''
          }`,
          value: `${item.staffMember?.firstName || ''} ${
            item.staffMember?.lastName || ''
          }`,
          email: item.staffMember?.email ? item.staffMember?.email : '',
          authId: item.staffMember?.authId ? item.staffMember?.authId : '',
          image: item.staffMember?.image
        }));

        // Removed duplicates from staff list.
        const uniqIDs: string[] = [];
        const filteredArray = staffList.filter((member: {id: string}) => {
          const duplicate = uniqIDs.includes(member.id);
          uniqIDs.push(member.id);
          return !duplicate;
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
        graphqlOperation(queries.listCurricula, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')}
        })
      );
      const sortedList = list.data.listCurricula?.items.sort((a: any, b: any) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
      const curricularList = sortedList.map((item: any, i: any) => ({
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
          const result: any = await API.graphql(
            graphqlOperation(customQueries.getRoom, {id: roomId})
          );

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
    if (curricularList.length && selectedCurrID) {
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
      disabled: !roomId,
      tooltipText: RoomEDITdict[userLanguage].TAB_DISABLED_TOOLTIP_TEXT
    },
    {
      title: RoomEDITdict[userLanguage].CLASS_UNIT_PLANNER_TAB_HEADING,
      description: RoomEDITdict[userLanguage].CLASS_UNIT_PLANNER_TAB_DESCRIPTION,
      stepValue: 'unit-planner',
      disabled: !roomId,
      tooltipText: RoomEDITdict[userLanguage].TAB_DISABLED_TOOLTIP_TEXT
    },
    {
      title: RoomEDITdict[userLanguage].CLASS_DYNAMICS_TAB_HEADING,
      description: RoomEDITdict[userLanguage].CLASS_DYNAMICS_TAB_DESCRIPTION,
      stepValue: 'class-dynamics',
      disabled: !roomId,
      tooltipText: RoomEDITdict[userLanguage].TAB_DISABLED_TOOLTIP_TEXT
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
    }
  };

  return (
    <div className="">
      {/* Section Header */}
      {/* <BreadCrums
        unsavedChanges={unsavedChanges}
        toggleModal={toggleModal}
        items={breadCrumsList}
      /> */}
      {/* <div className="flex justify-between">
        <SectionTitle
          title={RoomEDITdict[userLanguage]['TITLE']}
          subtitle={RoomEDITdict[userLanguage]['SUBTITLE']}
        />
        {params.get('from') ? (
          <div className="flex justify-end py-4 mb-4 w-5/10">
            <Buttons
              label="Go Back"
              btnClass="mr-4"
              onClick={goBack}
              Icon={IoArrowUndoCircleOutline}
            />
          </div>
        ) : null}
      </div> */}
      <div className="px-8 py-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900 w-auto capitalize">
          {roomId ? RoomEDITdict[userLanguage]['TITLE'] : 'Add Classroom'}
        </h3>
        <div
          className="flex items-center mt-1 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() =>
            history.push(
              isSuperAdmin
                ? `/dashboard/manage-institutions/class-rooms`
                : `/dashboard/manage-institutions/institution/${state.user.associateInstitute[0].institution.id}/class-rooms`
            )
          }>
          <span className="w-auto mr-2">
            <BsArrowLeft />
          </span>
          <div className="text-sm">{CommonlyUsedDict[userLanguage]['BACK_TO_LIST']}</div>
        </div>
      </div>

      {/* Body section */}
      <div className="">
        <div className="w-full m-auto">
          <StepComponent
            dataCy="classroom-builder"
            steps={steps}
            activeStep={activeStep}
            handleTabSwitch={handleTabSwitch}
          />
          <div className="grid grid-cols-1 divide-x-0 divide-gray-400 px-8 mt-8 lg:mt-0">
            <div className="border-0 lg:border-t-none border-gray-200">
              {currentStepComp(activeStep)}
            </div>
          </div>
        </div>
        {messages.show ? (
          <div className="py-2 m-auto text-center">
            <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
              {messages.message && messages.message}
            </p>
          </div>
        ) : null}
        {warnModal.show && (
          <ModalPopUp
            closeAction={toggleModal}
            saveAction={onModalSave}
            saveLabel="Yes"
            message={warnModal.message}
          />
        )}
      </div>
    </div>
  );
};

export default ClassRoomBuilder;
