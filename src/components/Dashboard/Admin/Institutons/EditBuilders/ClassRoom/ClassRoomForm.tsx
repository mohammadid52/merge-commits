import {ClassroomType, RoomStatus, TeachingStyle} from 'API';
import {API, graphqlOperation} from 'aws-amplify';
import {useEffect, useState} from 'react';
import {useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';

import {
  _updateRoom,
  createRoom,
  createClass,
  createRoomCoTeachers
} from 'customGraphql/customMutations';
import {
  getCurriculumUniversalSyllabusSequence,
  getRoom,
  GetInstitutionDetails,
  getRoomCoTeachers,
  getUnitsOnly
} from 'customGraphql/customQueries';
import {
  updateRoomCurriculum,
  createRoomCurriculum,
  updateRoom,
  deleteRoomCoTeachers
} from 'graphql/mutations';
import {listStaff, listCurricula} from 'graphql/queries';

import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import Selector from 'atoms/Form/Selector';
import ModalPopUp from 'molecules/ModalPopUp';

import CheckBox from '@components/Atoms/Form/CheckBox';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useNotifications} from '@contexts/NotificationContext';
import useAuth from '@customHooks/useAuth';

import {useQuery} from '@customHooks/urlParam';
import {methods, statusList, typeList} from '@utilities/staticData';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {checkUniqRoomName, listInstitutions, logError} from 'graphql-functions/functions';
import PageLayout from 'layout/PageLayout';
import moment from 'moment';
import {getFilterORArray} from 'utilities/strings';
import Loader from '@components/Atoms/Loader';
import {Empty} from 'antd';

export const fetchSingleCoTeacher = async (roomId: string) => {
  const result: any = await API.graphql(
    graphqlOperation(getRoomCoTeachers, {id: roomId})
  );
  return result.data.getRoomCoTeachers;
};
interface ClassRoomFormProps {
  instId: string;
}

const ClassRoomForm = ({instId}: ClassRoomFormProps) => {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const {roomId}: any = useParams();
  const {userLanguage, checkIfAdmin} = useGlobalContext();

  const [units, setUnits] = useState<any[]>([]);

  const [unitsLoading, setUnitsLoading] = useState(false);

  const [previousActiveUnitId, setPreviousActiveUnitId] = useState<any | null>(null);

  const fetchUnits = async (curriculaId: string) => {
    try {
      let getCurriculum: any = await API.graphql(
        graphqlOperation(getUnitsOnly, {
          id: curriculaId
        })
      );
      let response = await getCurriculum?.data?.getCurriculum;

      const seq = response?.universalSyllabusSeq || [];

      let syllabi = response?.universalSyllabus?.items || [];
      let units = syllabi
        .filter((d: {unit: any}) => d.unit !== null)
        .map((item: any) => {
          return {
            id: item?.unit?.id,
            label: item?.unit?.name,
            value: item?.unit?.id,
            index: seq.indexOf(item?.unit?.id)
          };
        })
        .sort((a: any, b: any) => (a.index > b.index ? 1 : -1));

      setUnits(units);
      if (units && units.length > 0) {
        const activeUnit = units.find(
          (unit: any) => unit.id === roomData?.activeSyllabus
        );
        if (activeUnit) {
          setRoomData({
            ...roomData,
            activeUnit: {id: activeUnit.id, label: activeUnit.label}
          });
        } else {
          setRoomData({
            ...roomData,
            activeUnit: {id: '', label: ''}
          });
        }
      }

      setUnitsLoading(false);
    } catch (err) {
      console.error('fetch units (syllabus) error', err);
    }
  };

  const initialData = {
    id: '',
    name: '',
    type: ClassroomType.ONLINE,
    institute: {id: instId, label: '', value: ''},
    teacher: {id: '', label: '', value: ''},
    coTeachers: [{}],
    classRoom: {id: '', label: '', value: ''},
    curricular: {id: '', label: '', value: ''},
    maxPersons: '',
    status: RoomStatus.ACTIVE,
    conferenceCallLink: '',
    location: '',
    isZoiq: false,
    teachingStyle: TeachingStyle.PERFORMER,
    activeUnit: {
      id: '',
      label: ''
    },
    activeSyllabus: '',
    classID: '',
    createdAt: new Date()
  };
  const [roomData, setRoomData] = useState(initialData);
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [curricularList, setCurricularList] = useState<any[]>([]);

  const [allCurricular, setAllCurricular] = useState<any[]>([]);

  const [prevName, setPrevName] = useState('');
  const [selectedCurrID, setSelectedCurrID] = useState('');
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });
  const [originalTeacher, setOriginalTeacher] = useState<any[]>([]);
  const [coTeachersList, setCoTeachersList] = useState<any[]>(teachersList);
  const [selectedCoTeachers, setSelectedCoTeachers] = useState<
    {
      email?: string;
      authId: string;
      value?: string;
      id?: string;
      name?: string;
    }[]
  >([]);
  const [allInstitutions, setAllInstitutions] = useState<any[]>([]);

  const {RoomBuilderdict, RoomEDITdict, LessonEditDict} = useDictionary();

  const params = useQuery(location.search);

  const [_, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonEditDict[userLanguage]['MESSAGES']['UNSAVE'],
    onSaveAction: () => {}
  });

  useEffect(() => {
    async function fetch() {
      const response = await listInstitutions(authId, email);

      setAllInstitutions(response);
    }

    fetch();
  }, []);

  useEffect(() => {
    if (roomData?.curricular?.id) {
      fetchUnits(roomData?.curricular?.id);
    }
  }, [roomData?.curricular?.id]);

  const toggleModal = () => {
    setWarnModal({
      ...warnModal,
      show: !warnModal.show
    });
  };

  const selectTeacher = (val: string, option: any) => {
    setRoomData({
      ...roomData,
      teacher: {
        id: option.id,
        label: val,
        value: val
      }
    });

    const filteredDefaultTeacher: object[] = teachersList.filter(
      (coTeacher: any) => coTeacher.id !== option.id
    );
    setUnsavedChanges(true);
    setCoTeachersList(filteredDefaultTeacher);
    setSelectedCoTeachers((list: any) => list.filter((d: any) => d.id !== option.id));
  };

  const selectClassroomType = (_: string, name: ClassroomType, _2: string) => {
    setRoomData({...roomData, type: name});
  };

  const selectCoTeacher = (_: string[], option: any[]) => {
    setSelectedCoTeachers(option);
  };

  const editInputField = (e: any) => {
    setRoomData({
      ...roomData,
      [e.target.name]: e.target.value
    });
    setUnsavedChanges(true);
    removeErrorMsg();
  };

  const selectCurriculum = (val: string, option: any) => {
    setRoomData({
      ...roomData,
      curricular: {
        id: option.id,
        label: val,
        value: val
      }
    });

    setUnsavedChanges(true);

    removeErrorMsg();
  };

  const beforeUptatingStatus = (val: RoomStatus) => {
    if (val === RoomStatus.INACTIVE) {
      setWarnModal({
        show: true,
        message:
          'By setting this class to inactive, students will no longer see this course when they log in. Do you wish to continue?',
        onSaveAction: () => {
          selectStatus(val);
        }
      });
    } else {
      selectStatus(val);
    }
  };

  const selectStatus = (val: RoomStatus) => {
    setRoomData({
      ...roomData,
      status: val,
      curricular: {...initialData.curricular}
    });
    setUnsavedChanges(true);

    onStatusUpdate(allCurricular, val);
    removeErrorMsg();
    setWarnModal({show: false, message: '', onSaveAction: () => {}});
  };

  const removeErrorMsg = () => {
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      });
    }
  };

  const getInstituteInfo = async (instId: string) => {
    try {
      if (instId) {
        const list: any = await API.graphql(
          graphqlOperation(GetInstitutionDetails, {
            id: instId
          })
        );
        setRoomData((prevData) => ({
          ...prevData,
          institute: {
            ...prevData.institute,
            name: list.data.getInstitution?.name
          }
        }));
        const serviceProviders = list.data.getInstitution?.serviceProviders?.items;
        return serviceProviders;
      }
    } catch (err) {
      console.error(err, 'err inside catch');
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
        console.error('No staff found');

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
        setTeachersList(filteredArray);
        setCoTeachersList(filteredArray.filter((item: any) => item.id !== teacher.id));
      }
    } catch (err) {
      console.error(err, 'err inside catch');
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unableteacher'],
        isError: true
      });
    }
  };

  const onStatusUpdate = (curricularList: any[], status: RoomStatus) => {
    const copy = [...curricularList];
    const filtered: any[] = copy.filter(
      (d: {status: RoomStatus}) =>
        d?.status?.toLocaleLowerCase() === status?.toLocaleLowerCase()
    );

    const selectorList = filtered.map((item: any) => ({
      id: item.id,
      name: `${item.name ? item.name : ''}`,
      value: `${item.name ? item.name : ''}`
    }));

    setCurricularList([...selectorList]);
  };

  const [loadingCurricular, setLoadingCurricular] = useState(false);

  const getCurricularList = async (allInstiId: string[]) => {
    try {
      setLoadingCurricular(true);
      const list: any = await API.graphql(
        graphqlOperation(listCurricula, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')}
        })
      );

      const items = list.data.listCurricula?.items || [];

      const sortedList = items.sort((a: any, b: any) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
      setAllCurricular([...sortedList]);

      onStatusUpdate(sortedList, (roomData?.status || RoomStatus.ACTIVE) as RoomStatus);
    } catch (err) {
      logError(err, {authId, email}, 'ClassRoomForm.tsx @getCurricularList');
      console.error(err, 'err inside catch');
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unablecurricular'],
        isError: true
      });
    } finally {
      setLoadingCurricular(false);
    }
  };

  const validateForm = async () => {
    if (roomData.name.trim() === '') {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['classroomrequired'],
        isError: true
      });
      return false;
    } else if (roomData.institute.id === '') {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['selectinstitute'],
        isError: true
      });
      return false;
    } else if (!roomData.curricular.id && roomData.status === RoomStatus.ACTIVE) {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['selectCurriculum'],
        isError: true
      });
      return false;
    } else if (roomData.teacher.id === '' && roomData.status !== RoomStatus.INACTIVE) {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['selectteacher'],
        isError: true
      });
      return false;
    } else if (roomData.name.trim() !== '' && prevName !== roomData.name) {
      const isUniq = await checkUniqRoomName(
        roomData.institute.id,
        roomData.name,
        authId
      );
      if (!isUniq) {
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['alreadyexist'],
          isError: true
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
          curriculumID: currId
        };

        await API.graphql(
          graphqlOperation(updateRoomCurriculum, {
            input: curricularInput
          })
        );
        setLoading(false);
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['classupdate'],
          isError: false
        });
      } catch (err) {
        console.error(err, 'err inside catch');
        setLoading(false);
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['errupdating'],
          isError: true
        });
      }
    } else {
      setLoading(false);
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['errprocess'],
        isError: true
      });
    }
  };

  const createRoomCurricular = async (roomId: string, currId: string) => {
    if (roomId) {
      try {
        const curricularInput = {
          roomID: roomId,
          curriculumID: currId
        };

        await API.graphql(
          graphqlOperation(createRoomCurriculum, {
            input: curricularInput
          })
        );
        setMessages({
          show: true,
          message:
            RoomBuilderdict[userLanguage]['messages']['success']['classroomdetail'],
          isError: false
        });
        setRoomData(initialData);
        setLoading(false);
      } catch (err) {
        console.error(err, 'err inside catch');
        setMessages({
          show: true,
          message: RoomBuilderdict[userLanguage]['messages']['error']['classroomadd'],
          isError: true
        });
        setLoading(false);
      }
    } else {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['error']['classroomadd'],
        isError: true
      });
      setLoading(false);
    }
  };
  const getFirstSyllabus = async (curriculumID: string) => {
    if (curriculumID) {
      const syllabusCSequenceFetch: any = await API.graphql(
        graphqlOperation(getCurriculumUniversalSyllabusSequence, {
          id: `${curriculumID}`
        })
      );

      const syllabusSequenceArray =
        syllabusCSequenceFetch.data.getCurriculum?.universalSyllabusSeq;

      const firstSyllabusID = syllabusSequenceArray?.length
        ? syllabusSequenceArray[0]
        : '';
      return firstSyllabusID;
    }
  };

  const {setNotification} = useNotifications();

  const saveRoomDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
      setLoading(true);
      try {
        if (roomData.id) {
          const input = {
            id: roomData.id,
            activeSyllabus: roomData?.activeUnit?.id,
            institutionID: roomData.institute.id,
            classID: roomData.classRoom.id,
            teacherAuthID: teachersList.find(
              (item: any) => item.id === roomData.teacher.id
            ).authId,
            teacherEmail: teachersList.find(
              (item: any) => item.id === roomData.teacher.id
            ).email,
            name: roomData.name,
            maxPersons: roomData.maxPersons,
            type: roomData.type || ClassroomType.ONLINE,
            status: roomData.status || 'ACTIVE',
            location: roomData.location,
            isZoiq: roomData.isZoiq,
            conferenceCallLink: roomData.conferenceCallLink,
            teachingStyle: roomData.teachingStyle
          };
          const newRoom: any = await API.graphql(
            graphqlOperation(_updateRoom, {input: input})
          );
          const curriculaId = newRoom.data.updateRoom.curricula.items[0]?.id;
          await saveRoomTeachers(roomData.id);
          if (curriculaId) {
            await saveRoomCurricular(curriculaId, roomData.id, roomData.curricular.id);
          } else {
            await createRoomCurricular(roomId, roomData.curricular.id);
          }

          if (previousActiveUnitId !== roomData.activeUnit.id) {
            // do nothing
          } else {
            setUnsavedChanges(false);
            setNotification({
              show: true,
              type: 'success',
              title: 'class updated successfully'
            });
          }
        } else {
          const input: any = {
            isZoiq: roomData.isZoiq,
            institutionID: roomData.institute.id,
            activeSyllabus: roomData.curricular.id
              ? await getFirstSyllabus(roomData.curricular.id)
              : '',
            classID: roomData.classRoom.id,
            teacherAuthID: teachersList.find(
              (item: any) => item.id === roomData.teacher.id
            ).authId,
            teacherEmail: teachersList.find(
              (item: any) => item.id === roomData.teacher.id
            ).email,
            name: roomData.name,
            maxPersons: 0,
            teachingStyle: roomData.teachingStyle,
            status: (roomData.status as RoomStatus) || ('ACTIVE' as RoomStatus)
          };

          const newRoom: any = await API.graphql(
            graphqlOperation(createRoom, {input: input})
          );
          const roomId = newRoom.data.createRoom.id;
          const classInput = {
            name: roomData.name,
            institutionID: roomData.institute.id,
            roomId
          };
          const newClass: any = await API.graphql(
            graphqlOperation(createClass, {input: classInput})
          );
          await API.graphql(
            graphqlOperation(updateRoom, {
              input: {
                id: roomId,
                classID: newClass.data.createClass.id
              }
            })
          );
          if (roomData.curricular.id) {
            await createRoomCurricular(roomId, roomData.curricular.id);
            await saveRoomTeachers(roomId);
          } else {
            setNotification({
              show: true,
              type: 'success',
              title: RoomBuilderdict[userLanguage]['messages']['success']['newclassroom']
            });

            setRoomData(initialData);
            setSelectedCoTeachers([]);
            setLoading(false);
          }
          history.push(
            `/dashboard/manage-institutions/institution/${instId}/room-edit/${roomId}?step=students`
          );
        }
      } catch (err) {
        console.error(err, 'err inside catch');
        setLoading(false);

        setNotification({
          show: true,
          type: 'error',
          title: RoomBuilderdict[userLanguage]['messages']['errupdatingclass']
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
          teacherAuthID: d.authId
        };
        newItems.push(input);
      }
    });

    if (newItems.length > 0) {
      await Promise.all(
        newItems.map(async (teacher) => {
          await API.graphql(
            graphqlOperation(createRoomCoTeachers, {
              input: teacher
            })
          );
        })
      );
    }

    if (deletedItems.length > 0) {
      await Promise.all(
        deletedItems.map(async (id) => {
          const input = {
            id: id
          };
          await API.graphql(graphqlOperation(deleteRoomCoTeachers, {input: input}));
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
        label: selectedCurr?.label,
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
              teachingStyle: savedData?.method || TeachingStyle.PERFORMER,
              curricula: {
                ...savedData?.room?.curricula
              },
              name: savedData?.room?.name,
              institution: savedData?.room?.institution,
              activeSyllabus: savedData?.room?.activeSyllabus,
              status: savedData?.room?.status,
              conferenceCallLink: savedData?.room?.conferenceCallLink,
              location: savedData?.room?.location
            };
          }

          if (savedData) {
            const curricularId = savedData?.curricula?.items[0]?.curriculumID;

            const coTeachers = savedData?.coTeachers?.items;
            setOriginalTeacher(
              coTeachers?.map((d: any) => {
                return {
                  rowId: d.id,
                  id: d.teacherID
                };
              })
            );
            if (coTeachers) {
              setSelectedCoTeachers(
                coTeachers?.map((d: any) => {
                  return {
                    id: d.teacherID,
                    authId: d.teacherAuthID,
                    email: d.teacherEmail,
                    name: `${d.teacher.firstName} ${d.teacher.lastName}`,
                    value: `${d.teacher.firstName} ${d.teacher.lastName}`,
                    rowId: d.id
                  };
                })
              );
            }

            setPreviousActiveUnitId(savedData?.activeSyllabus);
            setRoomData({
              ...roomData,
              id: savedData.id,
              teachingStyle: savedData?.teachingStyle || TeachingStyle.PERFORMER,
              name: savedData.name,
              classID: savedData.classID,
              activeSyllabus: savedData?.activeSyllabus,
              type: savedData?.type || ClassroomType.ONLINE,
              institute: {
                id: savedData.institution?.id,
                label: savedData.institution?.name,
                value: savedData.institution?.name
              },
              isZoiq: savedData.isZoiq,
              teacher: {
                id: savedData.teacher?.id,
                label: `${savedData.teacher?.firstName || ''} ${
                  savedData.teacher?.lastName || ''
                }`,
                value: `${savedData.teacher?.firstName || ''} ${
                  savedData.teacher?.lastName || ''
                }`
              },
              classRoom: {
                id: savedData.class?.id,
                label: savedData.class?.name,
                value: savedData.class?.name
              },
              // ***** UNCOMMENT THIS ******
              // coTeachers: savedData.coTeachers,
              maxPersons: savedData.maxPersons,
              status: savedData.status,
              location: savedData.location,
              conferenceCallLink: savedData.conferenceCallLink,
              createdAt: savedData.createdAt
            });
            setPrevName(savedData.name);
            setSelectedCurrID(curricularId);
          }
        } catch (err) {
          console.error(err, 'err inside catch');
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
          id: params.get('id') || '',
          label: '',
          value: ''
        }
      });
    }
  };

  const fetchOtherList = async () => {
    const items: any = await getInstituteInfo(roomData.institute?.id);
    const serviceProviders = items?.map((item: any) => item.providerID) || [];
    const allInstiId = [...serviceProviders, roomData.institute?.id];
    getTeachersList(allInstiId);
    getCurricularList(allInstiId);
  };

  useEffect(() => {
    if (roomData.institute.id) {
      fetchOtherList();
    }
  }, [roomData.institute.id]);

  useEffect(() => {
    if (curricularList.length && selectedCurrID) {
      filterCurricularData(selectedCurrID);
    }
  }, [curricularList]);

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId]);

  const {
    name,
    curricular,
    institute,
    teacher,
    status,
    conferenceCallLink,
    type,
    location: roomLocation
  } = roomData;

  const selectInstitute = (institute: any) => {
    setRoomData({
      ...roomData,
      institute: {
        id: institute.id,
        label: institute.name,
        value: institute.name
      }
    });
  };

  const {authId, email} = useAuth();

  const onSelectActiveUnit = (unit: {id: string; name: string}) => {
    setRoomData({
      ...roomData,
      activeUnit: {
        id: unit.id,
        label: unit.name
      }
    });
  };

  const disabled = status === RoomStatus.INACTIVE;
  const INACTIVE_TEXT = 'Classroom inactive';

  return (
    <div className="">
      {/* Body section */}
      <PageLayout
        type="inner"
        title={
          <div className="flex py-2 flex-col">
            <span className="w-auto">{RoomEDITdict[userLanguage].HEADING}</span>
            <span className="text-medium  w-auto font-normal text-sm">
              {moment(roomData.createdAt).format('ll')}
            </span>
          </div>
        }>
        <div className="w-full m-auto">
          <div className="">
            <div className="grid grid-cols-3">
              <div className="px-3 py-4">
                <Selector
                  width={'100%'}
                  showSearch
                  selectedItem={institute.value}
                  placeholder={RoomEDITdict[userLanguage]['INSTITUTION_PLACEHOLDER']}
                  label={RoomEDITdict[userLanguage]['INSTITUTION_LABEL']}
                  list={allInstitutions}
                  isRequired
                  onChange={(_, option: any) => {
                    selectInstitute(option);
                  }}
                />
              </div>
              <div className="px-3 py-4">
                <FormInput
                  value={name}
                  id="name"
                  onChange={editInputField}
                  name="name"
                  label={RoomEDITdict[userLanguage]['NAME_LABEL']}
                  placeHolder={RoomEDITdict[userLanguage]['NAME_PLACEHOLDER']}
                  isRequired
                />
              </div>
              <div className="px-3 py-4">
                <Selector
                  selectedItem={status}
                  width={'100%'}
                  placeholder={RoomEDITdict[userLanguage]['STATUS_PLACEHOLDER']}
                  label={RoomEDITdict[userLanguage]['STATUS_LABEL']}
                  labelTextClass={'text-xs'}
                  list={statusList}
                  isRequired
                  // @ts-ignore
                  onChange={beforeUptatingStatus}
                />
              </div>
              <div className="px-3 py-4">
                <Selector
                  width={'100%'}
                  placeholder={'Classroom type'}
                  label={'Classroom type'}
                  labelTextClass={'text-xs'}
                  list={typeList}
                  disabled={loadingCurricular || disabled}
                  selectedItem={disabled ? INACTIVE_TEXT : type}
                  isRequired
                  // @ts-ignore
                  onChange={selectClassroomType}
                />
              </div>
              <div className="px-3 py-4">
                <Selector
                  selectedItem={disabled ? INACTIVE_TEXT : curricular.value}
                  showSearch
                  placeholder={RoomEDITdict[userLanguage]['CURRICULUM_PLACEHOLDER']}
                  label={RoomEDITdict[userLanguage]['CURRICULUM_LABEL']}
                  disabled={loadingCurricular || disabled}
                  notFoundContent={
                    loadingCurricular ? (
                      <Loader />
                    ) : (
                      <Empty description={`There are no ${status} courses found `} />
                    )
                  }
                  list={curricularList}
                  isRequired
                  onChange={selectCurriculum}
                />
              </div>
              <div className="px-3 py-4">
                <Selector
                  disabled={unitsLoading || disabled}
                  selectedItem={disabled ? INACTIVE_TEXT : roomData.activeUnit.label}
                  showSearch
                  notFoundContent={
                    unitsLoading ? (
                      <Loader />
                    ) : (
                      <Empty description={`There are no units found `} />
                    )
                  }
                  width={'100%'}
                  placeholder={RoomEDITdict[userLanguage]['ACTIVE_UNIT_PLACEHOLDER']}
                  label={RoomEDITdict[userLanguage]['ACTIVE_UNIT_LABEL']}
                  list={units}
                  loading={unitsLoading}
                  onChange={(value, option: any) =>
                    onSelectActiveUnit({id: option.id, name: value})
                  }
                />
              </div>
            </div>
            {/*
             **
             * Hide institution drop down since all the things are tied to the
             * Institute, will add this later if need to add builders separately.
             */}
            <div>
              <div className="grid grid-cols-3">
                <div className="px-3 py-4">
                  <Selector
                    label={RoomEDITdict[userLanguage]['TEACHER_LABEL']}
                    showSearch
                    isRequired
                    selectedItem={teacher.label}
                    list={teachersList}
                    disabled={disabled}
                    placeholder={RoomEDITdict[userLanguage]['TEACHER_PLACEHOLDER']}
                    onChange={selectTeacher}
                  />
                </div>
                <div className="px-3 py-4">
                  <MultipleSelector
                    label={RoomEDITdict[userLanguage]['CO_TEACHER_LABEL']}
                    withAvatar
                    disabledText={INACTIVE_TEXT}
                    disabled={disabled}
                    // @ts-ignore
                    selectedItems={selectedCoTeachers}
                    list={coTeachersList}
                    placeholder={RoomEDITdict[userLanguage]['CO_TEACHER_PLACEHOLDER']}
                    onChange={selectCoTeacher}
                    showSearch
                  />
                </div>
                <div className="px-3 py-4">
                  <Selector
                    placeholder={RoomEDITdict[userLanguage].METHOD}
                    label={RoomEDITdict[userLanguage].METHOD}
                    list={methods}
                    disabled={disabled}
                    selectedItem={disabled ? INACTIVE_TEXT : roomData.teachingStyle}
                    width={'100%'}
                    onChange={(value) =>
                      setRoomData({...roomData, teachingStyle: value as TeachingStyle})
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="px-3 py-4">
                  <FormInput
                    label={RoomEDITdict[userLanguage].CONFERENCE_CALL_LINK_LABEL}
                    name="conferenceCallLink"
                    value={conferenceCallLink}
                    onChange={editInputField}
                    disabled={disabled}
                    placeHolder={
                      disabled
                        ? INACTIVE_TEXT
                        : RoomEDITdict[userLanguage].CONFERENCE_CALL_LINK_PLACEHOLDER
                    }
                  />
                </div>
                <div className="px-3 py-4">
                  <FormInput
                    label={RoomEDITdict[userLanguage].LOCATION_LABEL}
                    name="location"
                    disabled={disabled}
                    value={roomLocation}
                    onChange={editInputField}
                    placeHolder={
                      disabled
                        ? INACTIVE_TEXT
                        : RoomEDITdict[userLanguage].LOCATION_PLACEHOLDER
                    }
                  />
                </div>
              </div>
              {checkIfAdmin() && (
                <CheckBox
                  dataCy="isZoiq"
                  label={'ZOIQ'}
                  className="group:hover:bg-medium "
                  value={roomData.isZoiq}
                  onChange={(e) => setRoomData({...roomData, isZoiq: e.target.checked})}
                  name="isZoiq"
                />
              )}
            </div>
          </div>
        </div>
        {messages.show ? (
          <div className="py-2 m-auto text-center">
            <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
              {messages.message || ''}
            </p>
          </div>
        ) : null}
        <div className="flex my-8 gap-4 justify-center">
          <Buttons
            label={RoomEDITdict[userLanguage]['BUTTON']['CANCEL']}
            onClick={history.goBack}
            transparent
          />
          <Buttons
            disabled={loading}
            label={RoomEDITdict[userLanguage]['BUTTON']['SAVE']}
            onClick={saveRoomDetails}
          />
        </div>

        <AnimatedContainer show={status === RoomStatus.INACTIVE}>
          {status === RoomStatus.INACTIVE && (
            <p className="text-medium  text-sm text-center">
              This classroom is inactive and not available in the classroom
            </p>
          )}
        </AnimatedContainer>

        <ModalPopUp
          open={warnModal.show}
          closeAction={toggleModal}
          saveAction={warnModal.onSaveAction}
          saveLabel="Yes"
          message={warnModal.message}
        />
      </PageLayout>
    </div>
  );
};

export default ClassRoomForm;
