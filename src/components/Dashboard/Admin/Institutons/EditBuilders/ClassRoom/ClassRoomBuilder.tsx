import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';
import API, {graphqlOperation} from '@aws-amplify/api';

import * as customQueries from '../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../customGraphql/customMutations';
import {useQuery} from '../../../../../../customHooks/urlParam';

import * as queries from '../../../../../../graphql/queries';
import * as mutation from '../../../../../../graphql/mutations';
import {getFilterORArray} from '../../../../../../utilities/strings';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';
import {LessonEditDict} from '../../../../../../dictionary/dictionary.iconoclast';
import ModalPopUp from '../../../../../Molecules/ModalPopUp';
import {goBackBreadCrumb} from '../../../../../../utilities/functions';
import StepComponent, {IStepElementInterface} from '../../../../../Atoms/StepComponent';
import CourseDynamics from './CourseDynamics/CourseDynamics';
import ClassRoomForm from './ClassRoomForm';
import CourseSchedule from './CourseSchedule';
import {BsArrowLeft} from 'react-icons/bs';

interface ClassRoomBuilderProps {
  instId: string;
  toggleUpdateState: () => void;
}

const ClassRoomBuilder = (props: ClassRoomBuilderProps) => {
  const {instId, toggleUpdateState} = props;
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const {roomId}: any = useParams();
  const params = useQuery(location.search);
  const step = params.get('step');

  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const [activeStep, setActiveStep] = useState('overview');
  const [roomData, setRoomData] = useState<any>({});
  const [teachersList, setTeachersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const [curricularList, setCurricularList] = useState([]);
  const [prevName, setPrevName] = useState('');
  const [selectedCurrID, setSelectedCurrID] = useState('');
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false,
  });
  const [originalTeacher, setOriginalTeacher] = useState([]);
  const [selectedCoTeachers, setSelectedCoTeachers] = useState<
    {email?: string; authId: string; value?: string; id?: string; name?: string}[]
  >([]);

  const {BreadcrumsTitles, CommonlyUsedDict, RoomEDITdict} = useDictionary(clientKey);

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false,
    },
    {
      title: roomData?.institute?.name || BreadcrumsTitles[userLanguage]['LOADING'],
      goBack: true,
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['CLASSROOMS'],
      url: `/dashboard/manage-institutions/institution/${roomData?.institute?.id}/class-rooms`,
      last: false,
    },
    match.url.search('room-edit') > -1
      ? {
          title: roomData.name || BreadcrumsTitles[userLanguage]['LOADING'],
          url: `/dashboard/room-edit?id=${roomId}`,
          last: true,
        }
      : {
          title: BreadcrumsTitles[userLanguage]['CLASSROOM_CREATION'],
          url: `${match.url}`,
          last: true,
        },
  ];

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonEditDict[userLanguage]['MESSAGES']['UNSAVE'],
  });

  const onModalSave = () => {
    toggleModal();
    history.goBack();
  };

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show,
    });
  };

  const goBack = () => {
    if (unsavedChanges) {
      toggleModal();
    } else {
      goBackBreadCrumb(breadCrumsList, history);
    }
  };

  const getInstituteInfo = async (instId: string) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.getInstitution, {
          id: instId,
        })
      );
      setRoomData((prevData: any) => ({
        ...prevData,
        institute: {
          ...prevData.institute,
          name: list.data.getInstitution?.name,
        },
      }));
      const serviceProviders = list.data.getInstitution?.serviceProviders?.items;
      return serviceProviders;
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unabletofetch'],
        isError: true,
      });
    }
  };

  const getTeachersList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listStaffs, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')},
        })
      );
      const listStaffs = list.data.listStaffs.items;
      if (listStaffs?.length === 0) {
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['addstaffirst'],
          isError: true,
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
          image: item.staffMember?.image,
        }));

        // Removed duplicates from staff list.
        const uniqIDs: string[] = [];
        const filteredArray = staffList.filter((member: {id: string}) => {
          const duplicate = uniqIDs.includes(member.id);
          uniqIDs.push(member.id);
          return !duplicate;
        });
        setTeachersList(filteredArray);
      }
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unableteacher'],
        isError: true,
      });
    }
  };

  const getClassLists = async (allInstiId: string[]) => {
    const instId = roomData?.institute?.id;
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listClasss, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')},
        })
      );
      const listClass = list.data.listClasss?.items;
      if (listClass.length === 0) {
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['addclassfirst'],
          isError: true,
        });
      } else {
        const sortedList = listClass.sort((a: any, b: any) =>
          a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
        );
        const filteredClassList = sortedList.filter((classItem: any) => {
          return (
            classItem?.institution.isServiceProvider === false ||
            (classItem?.institution.isServiceProvider === true &&
              classItem.institution.id === instId)
          );
        });
        const classList = filteredClassList.map((item: any, i: any) => ({
          id: item.id,
          name: `${item.name ? item.name : ''}`,
          value: `${item.name ? item.name : ''}`,
        }));
        setClassList(classList);
      }
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unableclass'],
        isError: true,
      });
    }
  };

  const getCurricularList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listCurriculums, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')},
        })
      );
      const sortedList = list.data.listCurriculums?.items.sort((a: any, b: any) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
      const curricularList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.name ? item.name : ''}`,
        value: `${item.name ? item.name : ''}`,
      }));
      setCurricularList(curricularList);
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unablecurricular'],
        isError: true,
      });
    }
  };

  const checkUniqRoomName = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listRooms, {
          filter: {
            institutionID: {eq: roomData?.institute?.id},
            name: {eq: roomData.name},
          },
        })
      );
      return list.data.listRooms.items.length === 0 ? true : false;
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['errorprocess'],
        isError: true,
      });
    }
  };

  const validateForm = async () => {
    if (roomData.name.trim() === '') {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['classroomrequired'],
        isError: true,
      });
      return false;
    } else if (roomData?.institute?.id === '') {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['selectinstitute'],
        isError: true,
      });
      return false;
    } else if (roomData.teacher.id === '') {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['selectteacher'],
        isError: true,
      });
      return false;
    } else if (roomData.classRoom.id === '') {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['selectclass'],
        isError: true,
      });
      return false;
    } else if (roomData.maxPersons == '') {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['mxstudent'],
        isError: true,
      });
      return false;
    }
    // else if (roomData.maxPersons > '256') {
    //   setMessages({
    //     show: true,
    //     message: RoomEDITdict[userLanguage]['messages']['oneclass'],
    //     isError: true,
    //   });
    //   return false;
    // }
    else if (roomData.name.trim() !== '' && prevName !== roomData.name) {
      const isUniq = await checkUniqRoomName();
      if (!isUniq) {
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['alreadyexist'],
          isError: true,
        });
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const saveRoomCurricular = async (id: string, roomId: string, currId: string) => {
    if (roomId && id) {
      try {
        const curricularInput = {
          id: id,
          roomID: roomId,
          curriculumID: currId,
        };

        const addCurricular: any = await API.graphql(
          graphqlOperation(mutation.updateRoomCurriculum, {input: curricularInput})
        );
        setLoading(false);
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['classupdate'],
          isError: false,
        });
      } catch {
        setLoading(false);
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['errupdating'],
          isError: true,
        });
      }
    } else {
      setLoading(false);
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['errprocess'],
        isError: true,
      });
    }
  };

  const saveRoomDetails = async () => {
    setLoading(true);
    const isValid = await validateForm();
    if (isValid) {
      try {
        const input = {
          id: roomData.id,
          institutionID: roomData?.institute?.id,
          classID: roomData.classRoom.id,
          teacherAuthID: teachersList.find((item: any) => item.id === roomData.teacher.id)
            .authId,
          teacherEmail: teachersList.find((item: any) => item.id === roomData.teacher.id)
            .email,
          name: roomData.name,
          maxPersons: roomData.maxPersons,
        };
        const newRoom: any = await API.graphql(
          graphqlOperation(mutation.updateRoom, {input: input})
        );

        const curriculaId = newRoom.data.updateRoom.curricula.items[0].id;
        await saveRoomTeachers(roomData.id);
        await saveRoomCurricular(curriculaId, roomData.id, roomData.curricular.id);
        setUnsavedChanges(false);
        history.push(
          `/dashboard/manage-institutions/institution/${roomData?.institute?.id}/class-rooms`
        );
      } catch {
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['errupdatingclass'],
          isError: true,
        });
      }
    }
  };

  const saveRoomTeachers = async (roomID: string) => {
    const updatedTeachers = selectedCoTeachers;
    const originalTeachers = originalTeacher;

    const deletedItems: any[] = [];
    const newItems: any[] = [];

    originalTeachers.forEach((d) => {
      if (updatedTeachers.map((d) => d.id).indexOf(d.id) === -1) {
        deletedItems.push(d.rowId);
      }
    });

    updatedTeachers.forEach((d) => {
      if (originalTeachers.map((d) => d.id).indexOf(d.id) === -1) {
        const input = {
          roomID,
          teacherID: d.id,
          teacherEmail: d.email,
          teacherAuthID: d.authId,
        };
        newItems.push(input);
      }
    });

    if (newItems.length > 0) {
      await Promise.all(
        newItems.map(async (teacher) => {
          await API.graphql(
            graphqlOperation(customMutations.createRoomCoTeachers, {input: teacher})
          );
        })
      );
    }

    if (deletedItems.length > 0) {
      await Promise.all(
        deletedItems.map(async (id) => {
          const input = {
            id: id,
          };
          await API.graphql(
            graphqlOperation(mutation.deleteRoomCoTeachers, {input: input})
          );
        })
      );
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
        value: selectedCurr?.value,
      },
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
          const savedData = result.data.getRoom;
          const curricularId = savedData.curricula.items[0].curriculumID;

          const coTeachers = savedData.coTeachers?.items;
          setOriginalTeacher(
            coTeachers?.map((d: any) => {
              return {
                rowId: d.id,
                id: d.teacherID,
              };
            })
          );
          setSelectedCoTeachers(
            coTeachers?.map((d: any) => {
              return {
                id: d.teacherID,
                authId: d.teacherAuthID,
                email: d.teacherEmail,
                name: `${d.teacher.firstName} ${d.teacher.lastName}`,
                value: `${d.teacher.firstName} ${d.teacher.lastName}`,
                rowId: d.id,
              };
            })
          );
          setRoomData({
            ...savedData,
            institute: {
              id: savedData.institution?.id,
              name: savedData.institution?.name,
              value: savedData.institution?.name,
            },
            advisorOptions: [
              ...coTeachers.map((teacher: any) => ({
                id: teacher.teacherID,
                name: `${teacher.teacher.firstName} ${teacher.teacher.lastName}`,
                authId: teacher.teacherAuthID,
                email: teacher.teacherEmail,
              })),
              savedData.teacher
                ? {
                    id: savedData.teacher.id,
                    name: `${savedData.teacher.firstName} ${savedData.teacher.lastName}`,
                    authId: savedData.teacher.authId,
                    email: savedData.teacher.email,
                  }
                : null,
            ].filter(Boolean),
          });
          setPrevName(savedData.name);
          setSelectedCurrID(curricularId);
        } catch {
          setMessages({
            show: true,
            message: RoomEDITdict[userLanguage]['messages']['errfetch'],
            isError: true,
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
          value: '',
        },
      });
    }
  };

  const fetchOtherList = async () => {
    const items: any = await getInstituteInfo(instId);
    const serviceProviders = items.map((item: any) => item.providerID);
    const allInstiId = [...serviceProviders, instId];
    getTeachersList(allInstiId);
    getClassLists(allInstiId);
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
  }, []);

  const handleTabSwitch = (step: string) => {
    const redirectionUrl = `${match.url}?id=${instId}&step=${step}`;
    history.push(redirectionUrl);
  };

  const {teacher} = roomData;

  const steps: IStepElementInterface[] = [
    {
      title: RoomEDITdict[userLanguage].CLASS_DETAILS_TAB_HEADING,
      description: RoomEDITdict[userLanguage].CLASS_DETAILS_TAB_DESCRIPTION,
      stepValue: 'overview',
    },
    {
      title: RoomEDITdict[userLanguage].CLASS_UNIT_PLANNER_TAB_HEADING,
      description: RoomEDITdict[userLanguage].CLASS_UNIT_PLANNER_TAB_DESCRIPTION,
      stepValue: 'unit-planner',
      disabled: !roomData?.id,
    },
    {
      title: RoomEDITdict[userLanguage].CLASS_DYNAMICS_TAB_HEADING,
      description: RoomEDITdict[userLanguage].CLASS_DYNAMICS_TAB_DESCRIPTION,
      stepValue: 'class-dynamics',
      disabled: !roomData?.id,
    },
  ];

  const currentStepComp = (currentStep: string) => {
    switch (currentStep) {
      case 'overview':
        return <ClassRoomForm instId={instId}/>;
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
            history.push(`/dashboard/manage-institutions/institution/${instId}/class-rooms`)
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
            steps={steps}
            activeStep={activeStep}
            handleTabSwitch={handleTabSwitch}
          />
          <div className="grid grid-cols-1 divide-x-0 divide-gray-400 px-8">
            <div className="border-0 border-t-none border-gray-200">
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
