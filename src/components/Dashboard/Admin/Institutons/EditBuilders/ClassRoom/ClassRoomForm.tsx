import React, {useState, useEffect, useContext} from 'react';
import {useHistory, useLocation, useParams, useRouteMatch} from 'react-router-dom';
import API, {graphqlOperation} from '@aws-amplify/api';

import * as customQueries from '../../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../../customGraphql/customMutations';
import * as queries from '../../../../../../graphql/queries';
import * as mutation from '../../../../../../graphql/mutations';

import PageWrapper from '../../../../../Atoms/PageWrapper';
import Buttons from '../../../../../Atoms/Buttons';
import FormInput from '../../../../../Atoms/Form/FormInput';
import Selector from '../../../../../Atoms/Form/Selector';
import SelectorWithAvatar from '../../../../../Atoms/Form/SelectorWithAvatar';
import MultipleSelector from '../../../../../Atoms/Form/MultipleSelector';
import ModalPopUp from '../../../../../Molecules/ModalPopUp';

import {getFilterORArray} from '../../../../../../utilities/strings';
import {GlobalContext} from '../../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../../customHooks/dictionary';
import {LessonEditDict} from '../../../../../../dictionary/dictionary.iconoclast';

interface ClassRoomFormProps {
  instId: string;
}

const ClassRoomForm = ({instId}: ClassRoomFormProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const {roomId}: any = useParams();

  const initialData = {
    id: '',
    name: '',
    institute: {id: instId, name: '', value: ''},
    teacher: {id: '', name: '', value: ''},
    coTeachers: [{}],
    classRoom: {id: '', name: '', value: ''},
    curricular: {id: '', name: '', value: ''},
    maxPersons: '',
    conferenceCallLink: '',
    location: '',
  };
  const {theme, clientKey, userLanguage} = useContext(GlobalContext);
  const [roomData, setRoomData] = useState(initialData);
  const [institutionList, setInstitutionList] = useState([]);
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
  const [coTeachersList, setCoTeachersList] = useState(teachersList);
  const [selectedCoTeachers, setSelectedCoTeachers] = useState<
    {email?: string; authId: string; value?: string; id?: string; name?: string}[]
  >([]);
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const {RoomBuilderdict, RoomEDITdict} = useDictionary(clientKey);

  const params = useQuery();

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [warnModal, setWarnModal] = useState({
    show: false,
    message: LessonEditDict[userLanguage]['MESSAGES']['UNSAVE'],
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const selectTeacher = (val: string, name: string, id: string) => {
    setRoomData({
      ...roomData,
      teacher: {
        id: id,
        name: name,
        value: val,
      },
    });

    const filteredDefaultTeacher: object[] = teachersList.filter(
      (coTeacher: any) => coTeacher.id !== id
    );
    setUnsavedChanges(true);
    setCoTeachersList(filteredDefaultTeacher);
    setSelectedCoTeachers((list: any) => list.filter((d: any) => d.id !== id));
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
      [e.target.name]: e.target.value,
    });
    setUnsavedChanges(true);

    removeErrorMsg();
  };

  const selectInstitute = async (val: string, name: string, id: string) => {
    if (roomData.institute.id !== id) {
      setRoomData({
        ...roomData,
        institute: {
          id: id,
          name: name,
          value: val,
        },
        teacher: {id: '', name: '', value: ''},
        coTeachers: [{}],
        classRoom: {id: '', name: '', value: ''},
        curricular: {id: '', name: '', value: ''},
      });
      setUnsavedChanges(true);

      removeErrorMsg();
    }
  };

  const selectClass = (val: string, name: string, id: string) => {
    setRoomData({
      ...roomData,
      classRoom: {
        id: id,
        name: name,
        value: val,
      },
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
        value: val,
      },
    });
    setUnsavedChanges(true);

    removeErrorMsg();
  };

  const removeErrorMsg = () => {
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false,
      });
    }
  };

  const getInstituteInfo = async (instId: string) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.getInstitution, {
          id: instId,
        })
      );
      setRoomData((prevData) => ({
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
      // if (!isMounted) {
      //   return;
      // }
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
        setCoTeachersList(filteredArray.filter((item: any) => item.id !== teacher.id));
      }
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unableteacher'],
        isError: true,
      });
    }
  };

  // const getClassLists = async (allInstiId: string[]) => {
  //   try {
  //     const list: any = await API.graphql(
  //       graphqlOperation(queries.listClasss, {
  //         filter: {or: getFilterORArray(allInstiId, 'institutionID')},
  //       })
  //     );
  //     const listClass = list.data.listClasss?.items;
  //     // if (!isMounted) {
  //     //   return;
  //     // }
  //     if (listClass.length === 0) {
  //       setMessages({
  //         show: true,
  //         message: RoomEDITdict[userLanguage]['messages']['addclassfirst'],
  //         isError: true,
  //       });
  //     } else {
  //       const sortedList = listClass.sort((a: any, b: any) =>
  //         a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
  //       );
  //       const filteredClassList = sortedList.filter((classItem: any) => {
  //         return (
  //           classItem?.institution.isServiceProvider === false ||
  //           (classItem?.institution.isServiceProvider === true &&
  //             classItem.institution.id === instId)
  //         );
  //       });
  //       const classList = filteredClassList.map((item: any, i: any) => ({
  //         id: item.id,
  //         name: `${item.name ? item.name : ''}`,
  //         value: `${item.name ? item.name : ''}`,
  //       }));
  //       setClassList(classList);
  //     }
  //   } catch {
  //     setMessages({
  //       show: true,
  //       message: RoomEDITdict[userLanguage]['messages']['unableclass'],
  //       isError: true,
  //     });
  //   }
  // };

  const getCurricularList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listCurriculums, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')},
        })
      );
      // if (!isMounted) {
      //   return;
      // }
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
            institutionID: {eq: roomData.institute.id},
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
    } else if (roomData.institute.id === '') {
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
    }
    // else if (roomData.classRoom.id === '') {
    //   setMessages({
    //     show: true,
    //     message: RoomEDITdict[userLanguage]['messages']['selectclass'],
    //     isError: true,
    //   });
    //   return false;
    // }
    // else if (roomData.maxPersons == '') {
    //   setMessages({
    //     show: true,
    //     message: RoomEDITdict[userLanguage]['messages']['mxstudent'],
    //     isError: true,
    //   });
    //   return false;
    // }
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

  const createRoomCurricular = async (roomId: string, currId: string) => {
    if (roomId) {
      try {
        const curricularInput = {
          roomID: roomId,
          curriculumID: currId,
        };

        const addCurricular: any = await API.graphql(
          graphqlOperation(mutation.createRoomCurriculum, {input: curricularInput})
        );
        setMessages({
          show: true,
          message:
            RoomBuilderdict[userLanguage]['messages']['success']['classroomdetail'],
          isError: false,
        });
        setRoomData(initialData);
        setLoading(false);
      } catch {
        setMessages({
          show: true,
          message: RoomBuilderdict[userLanguage]['messages']['error']['classroomadd'],
          isError: true,
        });
        setLoading(false);
      }
    } else {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['error']['classroomadd'],
        isError: true,
      });
      setLoading(false);
    }
  };
  const getFirstSyllabus = async (curriculumID: string) => {
    if (curriculumID) {
      const syllabusCSequenceFetch: any = await API.graphql(
        graphqlOperation(customQueries.getCurriculumUniversalSyllabusSequence, {
          id: `${curriculumID}`,
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
  const saveRoomDetails = async () => {
    setLoading(true);
    const isValid = await validateForm();
    if (isValid) {
      try {
        if (roomData.id) {
          const input = {
            id: roomData.id,
            institutionID: instId,
            classID: roomData.classRoom.id,
            teacherAuthID: teachersList.find(
              (item: any) => item.id === roomData.teacher.id
            ).authId,
            teacherEmail: teachersList.find(
              (item: any) => item.id === roomData.teacher.id
            ).email,
            name: roomData.name,
            maxPersons: roomData.maxPersons,
            location: roomData.location,
            conferenceCallLink: roomData.conferenceCallLink,
          };
          const newRoom: any = await API.graphql(
            graphqlOperation(mutation.updateRoom, {input: input})
          );

          const curriculaId = newRoom.data.updateRoom.curricula.items[0].id;
          await saveRoomTeachers(roomData.id);
          await saveRoomCurricular(curriculaId, roomData.id, roomData.curricular.id);
          setUnsavedChanges(false);
          setMessages({
            show: true,
            message: RoomEDITdict[userLanguage]['messages']['classupdate'],
            isError: false,
          });
          // history.push(
          //   `/dashboard/manage-institutions/institution?id=${roomData.institute?.id}&tab=4`
          // );
        } else {
          const input = {
            institutionID: instId,
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
          };

          const newRoom: any = await API.graphql(
            graphqlOperation(customMutations.createRoom, {input: input})
          );
          const roomId = newRoom.data.createRoom.id;
          const classInput = {
            name: roomData.name,
            institutionID: instId,
            roomId,
          };
          const newClass: any = await API.graphql(
            graphqlOperation(customMutations.createClass, {input: classInput})
          );
          await API.graphql(
            graphqlOperation(mutation.updateRoom, {
              input: {
                id: roomId,
                classID: newClass.data.createClass.id,
              },
            })
          );
          if (roomData.curricular.id) {
            await createRoomCurricular(roomId, roomData.curricular.id);
            await saveRoomTeachers(roomId);
          } else {
            setMessages({
              show: true,
              message:
                RoomBuilderdict[userLanguage]['messages']['success']['newclassroom'],
              isError: false,
            });
            setRoomData(initialData);
            setSelectedCoTeachers([]);
            setLoading(false);
          }
          history.push(
            `/dashboard/manage-institutions/institution/${instId}/room-edit/${roomId}?step=students`
          );
        }
      } catch {
        setLoading(false);
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
            ...roomData,
            id: savedData.id,
            name: savedData.name,
            institute: {
              id: savedData.institution?.id,
              name: savedData.institution?.name,
              value: savedData.institution?.name,
            },
            teacher: {
              id: savedData.teacher?.id,
              name: `${savedData.teacher?.firstName || ''} ${
                savedData.teacher?.lastName || ''
              }`,
              value: `${savedData.teacher?.firstName || ''} ${
                savedData.teacher?.lastName || ''
              }`,
            },
            classRoom: {
              id: savedData.class?.id,
              name: savedData.class?.name,
              value: savedData.class?.name,
            },
            // ***** UNCOMMENT THIS ******
            // coTeachers: savedData.coTeachers,
            maxPersons: savedData.maxPersons,
            location: savedData.location,
            conferenceCallLink: savedData.conferenceCallLink,
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
          id: params.get('id'),
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
    // getClassLists(allInstiId);
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
    // getInstitutionList();
  }, []);

  const {
    name,
    curricular,
    classRoom,
    maxPersons,
    // institute,
    teacher,
    conferenceCallLink,
    location: roomLocation,
  } = roomData;

  return (
    <div className="">
      {/* Body section */}
      <PageWrapper defaultClass="px-4">
        <div className="w-full m-auto">
          {/* <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {RoomEDITdict[userLanguage]['HEADING']}
          </h3> */}
          <div className="">
            <div className="text-lg font-medium mb-4">
              {RoomEDITdict[userLanguage].HEADING}
            </div>
            <div className="grid grid-cols-2">
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
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  {RoomEDITdict[userLanguage]['CURRICULUM_LABEL']}
                </label>
                <Selector
                  selectedItem={curricular.value}
                  placeholder={RoomEDITdict[userLanguage]['CURRICULUM_PLACEHOLDER']}
                  list={curricularList}
                  onChange={selectCurriculum}
                />
              </div>
            </div>
            {/*
             **
             * Hide institution drop down since all the things are tied to the
             * Institute, will add this later if need to add builders separately.
             */}
            {/* <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Institute  <span className="text-red-500"> *</span>
              </label>
              <Selector selectedItem={institute.value} placeholder="Select Institute" list={institutionList} onChange={selectInstitute} />
            </div> */}

            <div>
              <div className="grid grid-cols-2">
                <div className="px-3 py-4">
                  <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                    {RoomEDITdict[userLanguage]['TEACHER_LABEL']}{' '}
                    <span className="text-red-500"> *</span>
                  </label>
                  <SelectorWithAvatar
                    selectedItem={teacher}
                    list={teachersList}
                    placeholder={RoomEDITdict[userLanguage]['TEACHER_PLACEHOLDER']}
                    onChange={selectTeacher}
                  />
                </div>
                <div className="px-3 py-4">
                  <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                    {RoomEDITdict[userLanguage]['CO_TEACHER_LABEL']}
                  </label>
                  <MultipleSelector
                    withAvatar
                    selectedItems={selectedCoTeachers}
                    list={coTeachersList}
                    placeholder={RoomEDITdict[userLanguage]['CO_TEACHER_PLACEHOLDER']}
                    onChange={selectCoTeacher}
                  />
                </div>
              </div>
              {/* <div className="grid grid-cols-2">
                <div className="px-3 py-4">
                  <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                    {RoomEDITdict[userLanguage]['CLASS_NAME_LABEL']}{' '}
                    <span className="text-red-500"> *</span>
                  </label>
                  <Selector
                    selectedItem={classRoom.value}
                    placeholder={RoomEDITdict[userLanguage]['CLASS_NAME_PLACEHOLDER']}
                    list={classList}
                    onChange={selectClass}
                  />
                </div>
                <div className="px-3 py-4">
                  <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                    {RoomEDITdict[userLanguage]['MAXSTUDENT_LABEL']}{' '}
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="number"
                    id="maxPersons"
                    name="maxPersons"
                    onChange={editInputField}
                    className={`mt-1 block w-full sm:text-sm sm:leading-5  border-0 border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
                    value={maxPersons}
                    placeholder={RoomEDITdict[userLanguage]['MAXSTUDENT_PLACEHOLDER']}
                    min="1"
                    max="256"
                  />
                </div>
              </div>
               */}
              <div className="grid grid-cols-2">
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
              </div>
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
        {warnModal.show && (
          <ModalPopUp
            closeAction={toggleModal}
            saveAction={onModalSave}
            saveLabel="Yes"
            message={warnModal.message}
          />
        )}
      </PageWrapper>
    </div>
  );
};

export default ClassRoomForm;
