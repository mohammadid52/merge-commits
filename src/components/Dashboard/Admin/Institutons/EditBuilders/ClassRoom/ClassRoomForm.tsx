import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import {RoomStatus, TeachingStyle} from 'API';
import React, {useEffect, useState} from 'react';
import {useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';

import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import * as mutation from 'graphql/mutations';
import * as queries from 'graphql/queries';

import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import Selector from 'atoms/Form/Selector';
import SelectorWithAvatar from 'atoms/Form/SelectorWithAvatar';
import PageWrapper from 'atoms/PageWrapper';
import ModalPopUp from 'molecules/ModalPopUp';

import CheckBox from '@components/Atoms/Form/CheckBox';
import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {useNotifications} from '@contexts/NotificationContext';
import useAuth from '@customHooks/useAuth';
import {LessonEditDict} from '@dictionary/dictionary.iconoclast';
import {checkUniqRoomName, logError} from '@graphql/functions';
import {ClassroomType} from 'API';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {getFilterORArray} from 'utilities/strings';
import moment from 'moment';

export const methods = [
  {
    id: 1,
    name: 'Performer',
    value: TeachingStyle.PERFORMER
  },
  {
    id: 2,
    name: 'Academic',
    value: TeachingStyle.ACADEMIC
  }
];

export const fetchSingleCoTeacher = async (roomId: string) => {
  const result: any = await API.graphql(
    graphqlOperation(customQueries.getRoomCoTeachers, {id: roomId})
  );
  return result.data.getRoomCoTeachers;
};
interface ClassRoomFormProps {
  instId: string;
}

export const TypeList = [
  {
    id: 1,
    name: 'ONLINE',
    value: 'ONLINE'
  },
  {
    id: 2,
    name: 'TRADITIONAL',
    value: 'TRADITIONAL'
  }
];
const ClassRoomForm = ({instId}: ClassRoomFormProps) => {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const {roomId}: any = useParams();
  const {userLanguage, checkIfAdmin} = useGlobalContext();

  const StatusList = [
    {
      id: 1,
      name: 'ACTIVE',
      value: 'ACTIVE'
    },
    {
      id: 2,
      name: 'INACTIVE',
      value: 'INACTIVE'
    },
    {
      id: 3,
      name: 'TRAINING',
      value: 'TRAINING'
    }
  ];

  const [units, setUnits] = useState([]);

  const [unitsLoading, setUnitsLoading] = useState(false);

  const [previousActiveUnitId, setPreviousActiveUnitId] = useState(null);

  const fetchUnits = async (curriculaId: string) => {
    try {
      let getCurriculum: any = await API.graphql(
        graphqlOperation(customQueries.getUnitsOnly, {
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
            name: item?.unit?.name,
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
            activeUnit: {id: activeUnit.id, name: activeUnit.name}
          });
        } else {
          setRoomData({
            ...roomData,
            activeUnit: {id: '', name: ''}
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
    institute: {id: instId, name: '', value: ''},
    teacher: {id: '', name: '', value: ''},
    coTeachers: [{}],
    classRoom: {id: '', name: '', value: ''},
    curricular: {id: '', name: '', value: ''},
    maxPersons: '',
    status: '',
    conferenceCallLink: '',
    location: '',
    isZoiq: false,
    teachingStyle: TeachingStyle.PERFORMER,
    activeUnit: {
      id: '',
      name: ''
    },
    activeSyllabus: '',
    classID: '',
    createdAt: new Date()
  };
  const [roomData, setRoomData] = useState(initialData);
  const [teachersList, setTeachersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [curricularList, setCurricularList] = useState([]);

  const [allCurricular, setAllCurricular] = useState([]);

  const [prevName, setPrevName] = useState('');
  const [selectedCurrID, setSelectedCurrID] = useState('');
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });
  const [originalTeacher, setOriginalTeacher] = useState([]);
  const [coTeachersList, setCoTeachersList] = useState(teachersList);
  const [selectedCoTeachers, setSelectedCoTeachers] = useState<
    {email?: string; authId: string; value?: string; id?: string; name?: string}[]
  >([]);
  const [AllInstitutions, setAllInstitutions] = useState([]);
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const {RoomBuilderdict, RoomEDITdict} = useDictionary();

  const params = useQuery();

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonEditDict[userLanguage]['MESSAGES']['UNSAVE'],
    onSaveAction: () => {}
  });

  useEffect(() => {
    listInstitutions(undefined, []);
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

  const listInstitutions = async (nextToken: string, outArray: any[]): Promise<any> => {
    let combined;
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listInstitutions, {
          nextToken: nextToken
        })
      );
      let returnedData = result.data.listInstitutions?.items;
      let NextToken = result.data.listInstitutions?.nextToken;

      combined = [...outArray, ...returnedData];

      if (NextToken) {
        combined = await listInstitutions(NextToken, combined);
      }

      setAllInstitutions(combined);
      return combined;
    } catch (error) {
      console.error(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listInstitutions ~ error',
        error
      );
    }
  };

  const selectTeacher = (val: string, name: string, id: string) => {
    setRoomData({
      ...roomData,
      teacher: {
        id: id,
        name: name,
        value: val
      }
    });

    const filteredDefaultTeacher: object[] = teachersList.filter(
      (coTeacher: any) => coTeacher.id !== id
    );
    setUnsavedChanges(true);
    setCoTeachersList(filteredDefaultTeacher);
    setSelectedCoTeachers((list: any) => list.filter((d: any) => d.id !== id));
  };

  const selectClassroomType = (id: string, name: ClassroomType, value: string) => {
    setRoomData({...roomData, type: name});
  };

  const selectCoTeacher = (id: string, name: string, value: string) => {
    let updatedList;
    const currentCoTeachers = selectedCoTeachers;
    const selectedItem = currentCoTeachers.find((item) => item.id === id);

    if (!selectedItem) {
      const selectedItem = coTeachersList.find((item) => item.id === id);
      updatedList = [...currentCoTeachers, {id, name, value, ...selectedItem}];
    } else {
      updatedList = currentCoTeachers.filter((item) => item.id !== id);
    }
    setUnsavedChanges(true);

    setSelectedCoTeachers(updatedList);
  };

  const editInputField = (e: any) => {
    setRoomData({
      ...roomData,
      [e.target.name]: e.target.value
    });
    setUnsavedChanges(true);
    removeErrorMsg();
  };

  const selectCurriculum = (val: string, name: string, id: string) => {
    setRoomData({
      ...roomData,
      curricular: {
        id: id,
        name: name,
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
          graphqlOperation(customQueries.GetInstitutionDetails, {
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
        graphqlOperation(queries.listStaff, {
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

    const selectorList = filtered.map((item: any, i: any) => ({
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
        graphqlOperation(queries.listCurricula, {
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
    } else if (!roomData.curricular.id && roomData.status !== RoomStatus.INACTIVE) {
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
          graphqlOperation(mutation.updateRoomCurriculum, {input: curricularInput})
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
          graphqlOperation(mutation.createRoomCurriculum, {input: curricularInput})
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
        graphqlOperation(customQueries.getCurriculumUniversalSyllabusSequence, {
          id: `${curriculumID}`
        })
      );

      //@ts-ignore
      const syllabusSequenceArray =
        syllabusCSequenceFetch.data.getCurriculum?.universalSyllabusSeq;
      //@ts-ignore
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
            graphqlOperation(customMutations._updateRoom, {input: input})
          );
          const curriculaId = newRoom.data.updateRoom.curricula.items[0]?.id;
          await saveRoomTeachers(roomData.id);
          if (curriculaId) {
            await saveRoomCurricular(curriculaId, roomData.id, roomData.curricular.id);
          } else {
            await createRoomCurricular(roomId, roomData.curricular.id);
          }

          if (previousActiveUnitId !== roomData.activeUnit.id) {
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
            graphqlOperation(customMutations.createRoom, {input: input})
          );
          const roomId = newRoom.data.createRoom.id;
          const classInput = {
            name: roomData.name,
            institutionID: roomData.institute.id,
            roomId
          };
          const newClass: any = await API.graphql(
            graphqlOperation(customMutations.createClass, {input: classInput})
          );
          await API.graphql(
            graphqlOperation(mutation.updateRoom, {
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
            graphqlOperation(customMutations.createRoomCoTeachers, {input: teacher})
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
                name: savedData.institution?.name,
                value: savedData.institution?.name
              },
              isZoiq: savedData.isZoiq,
              teacher: {
                id: savedData.teacher?.id,
                name: `${savedData.teacher?.firstName || ''} ${
                  savedData.teacher?.lastName || ''
                }`,
                value: `${savedData.teacher?.firstName || ''} ${
                  savedData.teacher?.lastName || ''
                }`
              },
              classRoom: {
                id: savedData.class?.id,
                name: savedData.class?.name,
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
          id: params.get('id'),
          name: '',
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
        name: institute.name,
        value: institute.name
      }
    });
  };

  const {authId, email} = useAuth();

  // const createPersonLessonsData = async (lessonID: string, type: string, len: number) => {
  //   const result: any = await API.graphql(
  //     graphqlOperation(customMutations.createPersonLessonsData, {
  //       input: {
  //         id: uuidV4(),
  //         ratings: 0,
  //         studentAuthID: authId,
  //         roomId: roomId,
  //         studentEmail: email,
  //         lessonID: lessonID,
  //         lessonType: type,

  //         pages: `{
  //             "currentPage":${JSON.stringify(0)},
  //             "totalPages":${JSON.stringify(len - 1)},
  //             "lessonProgress":${JSON.stringify(0)}
  //             }`
  //           .replace(/(\s\s+|[\t\n])/g, ' ')
  //           .trim()
  //       }
  //     })
  //   );
  //   return result?.data?.createPersonLessonsData;
  // };

  // const fetchLessonPersonData = async (lessonID: string) => {
  //   try {
  //     const lessonPersonData: any = await API.graphql(
  //       graphqlOperation(customQueries.lessonsByType, {
  //         filter: {
  //           roomId: {eq: roomId},
  //           studentAuthID: {eq: authId},
  //           studentEmail: {eq: email}
  //         },
  //         limit: 500
  //       })
  //     );

  //     const data = lessonPersonData?.data?.listPersonLessonsData?.items || [];
  //     let _personLessonData = data.find((d: any) => d.lessonID === lessonID);

  //     return _personLessonData;
  //   } catch (e) {
  //     console.error('listLessonPersonData: ', e);
  //   } finally {
  //   }
  // };

  // const _loopFetchStudentData = async (
  //   lessonID: string,
  //   PAGES: UniversalLessonPlan[],
  //   authId: string
  // ): Promise<UniversalLessonStudentDataFromAPI[]> =>
  //   new Promise(async (resolve) => {
  //     try {
  //       // fetch by pages

  //       let result: any = [];

  //       await Promise.all(
  //         PAGES.map(async (page: any, idx: number) => {
  //           let studentData: any = await API.graphql(
  //             graphqlOperation(customQueries.getUniversalLessonStudentData, {
  //               id: `${authId}-${roomId}-${lessonID}-${page.id}`
  //               // filter: {...filterObj.filter, lessonPageID: {eq: page.id}}
  //             })
  //           );

  //           let studentDataObject = studentData.data.getUniversalLessonStudentData;
  //           if (studentDataObject !== null || studentDataObject !== undefined) {
  //             result.push(studentDataObject);
  //           }
  //         })
  //       );

  //       /**
  //        * combination of last fetch results
  //        * && current fetch results
  //        */

  //       resolve(result);
  //     } catch (e) {
  //       console.error('loopFetchStudentData - ', e);
  //       return [];
  //     }
  //   });

  // const getClassStudents = async (classID: string) => {
  //   try {
  //     const classStudents: any = await API.graphql(
  //       graphqlOperation(customQueries.listClassStudents, {
  //         limit: 500,
  //         filter: {classID: {eq: classID}, status: {eq: 'ACTIVE'}}
  //       })
  //     );
  //     const classStudentList = classStudents.data.listClassStudents?.items || [];

  //     // return student.studentAuthID
  //     return classStudentList;
  //   } catch (e) {
  //     console.error('getClassStudents - ', e);
  //   }
  // };

  // const getLessonCurrentPage = async (id: string) => {
  //   try {
  //     const getLessonRatingDetails: any = await API.graphql(
  //       graphqlOperation(customQueries.getPersonLessonsData, {
  //         id
  //       })
  //     );
  //     let pages = getLessonRatingDetails.data.getPersonLessonsData.pages;
  //     const currentPage = JSON.parse(pages).currentPage;
  //     return currentPage;
  //   } catch (error) {
  //     logError(error, {authId, email}, 'Lesson @getLessonCurrentPage');
  //   }
  // };

  // const loopCreateStudentArchiveAndExcerciseData = async (
  //   lessonID: string,
  //   PAGES: UniversalLessonPlan[],
  //   authId: string,
  //   personLessonDataId: string,
  //   lessonName: string
  // ) => {
  //   console.log('fetching for -> ', lessonID);

  //   const studentDataRows: UniversalLessonStudentDataFromAPI[] = await _loopFetchStudentData(
  //     lessonID,
  //     PAGES,
  //     authId
  //   );
  //   const currentPageLocation = await getLessonCurrentPage(personLessonDataId);

  //   const result = studentDataRows.filter(Boolean).map(async (item: any) => {
  //     const input = {
  //       id: uuidV4(),
  //       syllabusLessonID: item.syllabusLessonID,
  //       lessonID: item.lessonID,
  //       lessonPageID: item.lessonPageID,
  //       studentID: item.studentID,
  //       studentAuthID: item.studentAuthID,
  //       studentEmail: item.studentEmail,
  //       roomID: item.roomID,
  //       currentLocation: currentPageLocation.toString(),
  //       lessonProgress: item.lessonProgress,
  //       pageData: item.pageData,
  //       hasExerciseData: item.hasExerciseData,
  //       exerciseData: item.exerciseData,
  //       lessonName
  //     };
  //     let newStudentData: any;
  //     let returnedData: any;

  //     if (item.hasExerciseData) {
  //       console.info('\x1b[33m *Moving lesson data to writing exercise table... \x1b[0m');
  //       newStudentData = await API.graphql(
  //         graphqlOperation(mutation.createUniversalLessonWritingExcercises, {
  //           input
  //         })
  //       );
  //     } else {
  //       delete input.lessonName;
  //       newStudentData = await API.graphql(
  //         graphqlOperation(mutation.createUniversalArchiveData, {
  //           input
  //         })
  //       );
  //       console.info('\x1b[33m *Archiving rest of the pages... \x1b[0m');
  //     }
  //     returnedData = newStudentData.data.createUniversalArchiveData;

  //     return returnedData;
  //   });

  //   return result;
  // };

  // const createStudentArchiveData = async (
  //   lessonID: string,
  //   PAGES: UniversalLessonPlan[],
  //   authId: string,
  //   personLessonDataId: string,
  //   lessonName: string
  // ) => {
  //   try {
  //     const result = await loopCreateStudentArchiveAndExcerciseData(
  //       lessonID,
  //       PAGES,
  //       authId,
  //       personLessonDataId,
  //       lessonName
  //     );

  //     return result;
  //   } catch (e) {
  //     console.error(
  //       'error @createStudentArchiveData in LessonApp.tsx creating journal data - ',
  //       e
  //     );
  //   }
  // };

  // const onActiveUnitUpdate = async (id: string) => {
  //   try {
  //     const result: any = await API.graphql(
  //       graphqlOperation(customQueries.getActiveUniversalSyllabus, {id: id})
  //     );

  //     const lessons = result?.data?.getUniversalSyllabus?.lessons?.items || [];

  //     const lessonIds = lessons.map((_d: any) => _d.lessonID);

  //     const result2: any = await API.graphql(
  //       graphqlOperation(customQueries.listUniversalLessons, {
  //         filter: {...createFilterToFetchSpecificItemsOnly(lessonIds, 'id')}
  //       })
  //     );

  //     const finalLessons: UniversalLesson[] =
  //       result2?.data?.listUniversalLessons?.items || [];
  //     const students = await getClassStudents(roomData.classID);

  //     if (students && students.length > 0) {
  //       for (const lesson of finalLessons) {
  //         let personLessonData =
  //           (await fetchLessonPersonData(lesson.id)) ||
  //           (await createPersonLessonsData(
  //             lesson.id,
  //             lesson.type,
  //             lesson.lessonPlan.length
  //           ));

  //         if (personLessonData) {
  //           for (const student of students) {
  //             await createStudentArchiveData(
  //               lesson.id,
  //               lesson.lessonPlan,
  //               student.studentID,
  //               personLessonData.id,
  //               lesson.title
  //             );
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     logError(error, {authId, email}, 'ClassRoomForm @onActiveUnitUpdate');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSelectActiveUnit = (unit: {id: string; name: string}) => {
    setRoomData({
      ...roomData,
      activeUnit: {
        id: unit.id,
        name: unit.name
      }
    });
  };

  return (
    <div className="">
      {/* Body section */}
      <PageWrapper defaultClass="px-4">
        <div className="w-full m-auto">
          <div className="">
            <SectionTitleV3
              // @ts-ignore
              title={
                <div className="flex flex-col">
                  <span className="w-auto">{RoomEDITdict[userLanguage].HEADING}</span>
                  <span className="text-gray-500 w-auto font-normal mt-2 text-sm">
                    {moment(roomData.createdAt).format('ll')}
                  </span>
                </div>
              }
            />

            <div className="grid grid-cols-2">
              <div className="px-3 py-4">
                <Selector
                  selectedItem={institute.value}
                  placeholder={RoomEDITdict[userLanguage]['INSTITUTION_PLACEHOLDER']}
                  label={RoomEDITdict[userLanguage]['INSTITUTION_LABEL']}
                  list={AllInstitutions}
                  isRequired
                  onChange={(value, name, id) => {
                    let institute = {value, name, id};
                    selectInstitute(institute);
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
                  placeholder={RoomEDITdict[userLanguage]['STATUS_PLACEHOLDER']}
                  label={RoomEDITdict[userLanguage]['STATUS_LABEL']}
                  labelTextClass={'text-xs'}
                  list={StatusList}
                  isRequired
                  onChange={beforeUptatingStatus}
                />
              </div>
              <div className="px-3 py-4">
                <Selector
                  selectedItem={type}
                  placeholder={'Classroom type'}
                  label={'Classroom type'}
                  labelTextClass={'text-xs'}
                  list={TypeList}
                  isRequired
                  onChange={selectClassroomType}
                />
              </div>
              <div className="px-3 py-4">
                <Selector
                  selectedItem={
                    status === RoomStatus.INACTIVE
                      ? 'Classroom inactive'
                      : curricular.value
                  }
                  placeholder={RoomEDITdict[userLanguage]['CURRICULUM_PLACEHOLDER']}
                  label={RoomEDITdict[userLanguage]['CURRICULUM_LABEL']}
                  disabled={loadingCurricular || status === RoomStatus.INACTIVE}
                  labelTextClass={'text-xs'}
                  list={curricularList}
                  isRequired
                  onChange={selectCurriculum}
                />
              </div>
              <div className="px-3 py-4">
                <Selector
                  disabled={unitsLoading || status === RoomStatus.INACTIVE}
                  selectedItem={
                    status === RoomStatus.INACTIVE
                      ? 'Classroom inactive'
                      : roomData.activeUnit.name
                  }
                  placeholder={RoomEDITdict[userLanguage]['ACTIVE_UNIT_PLACEHOLDER']}
                  label={RoomEDITdict[userLanguage]['ACTIVE_UNIT_LABEL']}
                  labelTextClass={'text-xs'}
                  list={units}
                  loading={unitsLoading}
                  onChange={(value, name, id) => onSelectActiveUnit({id, name})}
                />
              </div>
            </div>
            {/*
             **
             * Hide institution drop down since all the things are tied to the
             * Institute, will add this later if need to add builders separately.
             */}
            <div>
              <div className="grid grid-cols-2">
                <div className="px-3 py-4">
                  <SelectorWithAvatar
                    label={RoomEDITdict[userLanguage]['TEACHER_LABEL']}
                    isRequired
                    selectedItem={
                      status === RoomStatus.INACTIVE
                        ? {value: 'Classroom inactive'}
                        : teacher
                    }
                    list={teachersList}
                    disabled={status === RoomStatus.INACTIVE}
                    placeholder={RoomEDITdict[userLanguage]['TEACHER_PLACEHOLDER']}
                    onChange={selectTeacher}
                  />
                </div>
                <div className="px-3 py-4">
                  <MultipleSelector
                    label={RoomEDITdict[userLanguage]['CO_TEACHER_LABEL']}
                    withAvatar
                    disabledText="Classroom inactive"
                    disabled={status === RoomStatus.INACTIVE}
                    selectedItems={selectedCoTeachers}
                    list={coTeachersList}
                    placeholder={RoomEDITdict[userLanguage]['CO_TEACHER_PLACEHOLDER']}
                    onChange={selectCoTeacher}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3">
                <div className="px-3 py-4">
                  <FormInput
                    label={RoomEDITdict[userLanguage].CONFERENCE_CALL_LINK_LABEL}
                    name="conferenceCallLink"
                    value={conferenceCallLink}
                    onChange={editInputField}
                    placeHolder={
                      RoomEDITdict[userLanguage].CONFERENCE_CALL_LINK_PLACEHOLDER
                    }
                  />
                </div>
                <div className="px-3 py-4">
                  <FormInput
                    label={RoomEDITdict[userLanguage].LOCATION_LABEL}
                    name="location"
                    value={roomLocation}
                    onChange={editInputField}
                    placeHolder={RoomEDITdict[userLanguage].LOCATION_PLACEHOLDER}
                  />
                </div>
                <div className="px-3 py-4">
                  <Selector
                    selectedItem={roomData.teachingStyle}
                    placeholder={RoomEDITdict[userLanguage].METHOD}
                    label={RoomEDITdict[userLanguage].METHOD}
                    list={methods}
                    onChange={(value: TeachingStyle, name, id) =>
                      setRoomData({...roomData, teachingStyle: value})
                    }
                  />
                </div>
              </div>
              {checkIfAdmin() && (
                <CheckBox
                  dataCy="isZoiq"
                  label={'ZOIQ'}
                  className="group:hover:bg-gray-500"
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
        <div className="flex my-8 justify-center">
          <Buttons
            btnClass="py-3 px-12 text-sm mr-4"
            label={RoomEDITdict[userLanguage]['BUTTON']['CANCEL']}
            onClick={history.goBack}
            transparent
          />
          <Buttons
            disabled={loading}
            btnClass="py-3 px-12 text-sm ml-4"
            label={loading ? 'Saving...' : RoomEDITdict[userLanguage]['BUTTON']['SAVE']}
            onClick={saveRoomDetails}
          />
        </div>

        <AnimatedContainer show={status === RoomStatus.INACTIVE}>
          {status === RoomStatus.INACTIVE && (
            <p className="text-gray-500 text-sm text-center">
              This classroom is inactive and not available in the classroom
            </p>
          )}
        </AnimatedContainer>

        {warnModal.show && (
          <ModalPopUp
            closeAction={toggleModal}
            saveAction={warnModal.onSaveAction}
            saveLabel="Yes"
            message={warnModal.message}
          />
        )}
      </PageWrapper>
    </div>
  );
};

export default ClassRoomForm;
