import API, {graphqlOperation} from '@aws-amplify/api';
import React, {useContext, useEffect, useState} from 'react';
import {IoArrowUndoCircleOutline} from 'react-icons/io5';
import {useHistory, useLocation} from 'react-router-dom';

import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';

import SectionTitleV3 from '@components/Atoms/SectionTitleV3';
import BreadCrums from 'atoms/BreadCrums';
import Buttons from 'atoms/Buttons';
import FormInput from 'atoms/Form/FormInput';
import MultipleSelector from 'atoms/Form/MultipleSelector';
import Selector from 'atoms/Form/Selector';
import SelectorWithAvatar from 'atoms/Form/SelectorWithAvatar';
import PageWrapper from 'atoms/PageWrapper';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import {LessonEditDict} from 'dictionary/dictionary.iconoclast';
import * as mutation from 'graphql/mutations';
import * as queries from 'graphql/queries';
import ModalPopUp from 'molecules/ModalPopUp';
import {goBackBreadCrumb} from 'utilities/functions';
import {getImageFromS3} from 'utilities/services';
import {getFilterORArray} from 'utilities/strings';

interface EditRoomProps {}

const EditRoom = (props: EditRoomProps) => {
  const {} = props;
  const history = useHistory();
  const location = useLocation();
  const initialData = {
    id: '',
    name: '',
    institute: {id: '', name: '', value: ''},
    teacher: {id: '', name: '', value: ''},
    coTeachers: [{}],
    classRoom: {id: '', name: '', value: ''},
    curricular: {id: '', name: '', value: ''},
    maxPersons: ''
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
    isError: false
  });
  const [originalTeacher, setOriginalTeacher] = useState([]);
  const [coTeachersList, setCoTeachersList] = useState(teachersList);
  const [selectedCoTeachers, setSelectedCoTeachers] = useState<
    {email?: string; authId: string; value?: string; id?: string; name?: string}[]
  >([]);
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const {BreadcrumsTitles, RoomEDITdict} = useDictionary(clientKey);

  const params = useQuery();
  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false
    },
    {
      title: roomData.institute?.name || BreadcrumsTitles[userLanguage]['LOADING'],
      goBack: true,
      last: false
    },
    {
      title: BreadcrumsTitles[userLanguage]['CLASSROOMS'],
      url: `/dashboard/manage-institutions/institution/${roomData.institute?.id}/class-rooms`,
      last: false
    },
    {
      title: roomData.name,
      url: `/dashboard/room-edit?id=${params.get('id')}`,
      last: true
    }
  ];

  const [unsavedChanges, setUnsavedChanges] = useState(false);
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

  const goBack = () => {
    if (unsavedChanges) {
      toggleModal();
    } else {
      goBackBreadCrumb(breadCrumsList, history);
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

  const selectInstitute = async (val: string, name: string, id: string) => {
    if (roomData.institute.id !== id) {
      setRoomData({
        ...roomData,
        institute: {
          id: id,
          name: name,
          value: val
        },
        teacher: {id: '', name: '', value: ''},
        coTeachers: [{}],
        classRoom: {id: '', name: '', value: ''},
        curricular: {id: '', name: '', value: ''}
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
        value: val
      }
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

  const removeErrorMsg = () => {
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      });
    }
  };

  const getImageURL = async (uniqKey: string) => {
    const imageUrl: any = await getImageFromS3(uniqKey);
    if (imageUrl) {
      console.log(imageUrl);
      return imageUrl;
    } else {
      return '';
    }
  };

  const getInstitutionList = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listInstitutions));
      const sortedList = list.data.listInstitutions?.items.sort((a: any, b: any) =>
        a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1
      );
      const InstituteList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.name ? item.name : ''}`,
        value: `${item.name ? item.name : ''}`
      }));
      setInstitutionList(InstituteList);
      if (InstituteList.length === 0) {
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['institutebefor'],
          isError: true
        });
      }
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unabletofetch'],
        isError: true
      });
    }
  };

  const getInstituteInfo = async (instId: string) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.getInstitution, {
          id: instId
        })
      );
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
        setTeachersList(filteredArray);
        setCoTeachersList(filteredArray.filter((item: any) => item.id !== teacher.id));
      }
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unableteacher'],
        isError: true
      });
    }
  };

  const getClassLists = async (allInstiId: string[]) => {
    const instId = roomData.institute.id;
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listClasses, {
          filter: {or: getFilterORArray(allInstiId, 'institutionID')}
        })
      );
      const listClass = list.data.listClasses?.items;
      if (listClass.length === 0) {
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['addclassfirst'],
          isError: true
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
          value: `${item.name ? item.name : ''}`
        }));
        setClassList(classList);
      }
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['unableclass'],
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

  const checkUniqRoomName = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listRooms, {
          filter: {
            institutionID: {eq: roomData.institute.id},
            name: {eq: roomData.name}
          }
        })
      );
      return list.data.listRooms.items.length === 0 ? true : false;
    } catch {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['errorprocess'],
        isError: true
      });
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
    } else if (roomData.teacher.id === '') {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['selectteacher'],
        isError: true
      });
      return false;
    } else if (roomData.classRoom.id === '') {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['selectclass'],
        isError: true
      });
      return false;
    } else if (roomData.maxPersons == '') {
      setMessages({
        show: true,
        message: RoomEDITdict[userLanguage]['messages']['mxstudent'],
        isError: true
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

        const addCurricular: any = await API.graphql(
          graphqlOperation(mutation.updateRoomCurriculum, {input: curricularInput})
        );
        setLoading(false);
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['classupdate'],
          isError: false
        });
      } catch {
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

  const saveRoomDetails = async () => {
    setLoading(true);
    const isValid = await validateForm();
    if (isValid) {
      try {
        const input = {
          id: roomData.id,
          institutionID: roomData.institute.id,
          classID: roomData.classRoom.id,
          teacherAuthID: teachersList.find((item: any) => item.id === roomData.teacher.id)
            .authId,
          teacherEmail: teachersList.find((item: any) => item.id === roomData.teacher.id)
            .email,
          name: roomData.name,
          maxPersons: roomData.maxPersons
        };
        const newRoom: any = await API.graphql(
          graphqlOperation(mutation.updateRoom, {input: input})
        );

        const curriculaId = newRoom.data.updateRoom.curricula.items[0].id;
        await saveRoomTeachers(roomData.id);
        await saveRoomCurricular(curriculaId, roomData.id, roomData.curricular.id);
        setUnsavedChanges(false);
        history.push(
          `/dashboard/manage-institutions/institution/${roomData.institute?.id}/class-rooms`
        );
      } catch {
        setMessages({
          show: true,
          message: RoomEDITdict[userLanguage]['messages']['errupdatingclass'],
          isError: true
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
    const currID = params.get('id');
    if (currID) {
      try {
        const result: any = await API.graphql(
          graphqlOperation(customQueries.getRoom, {id: currID})
        );
        const savedData = result.data.getRoom;
        const curricularId = savedData.curricula.items[0].curriculumID;

        const coTeachers = savedData.coTeachers?.items;
        setOriginalTeacher(
          coTeachers?.map((d: any) => {
            return {
              rowId: d.id,
              id: d.teacherID
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
              rowId: d.id
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
            value: savedData.institution?.name
          },
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
          maxPersons: savedData.maxPersons
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
  };

  const fetchOtherList = async () => {
    const instId = roomData.institute.id;
    const items: any = await getInstituteInfo(instId);
    const serviceProviders = items.map((item: any) => item.providerID);
    const allInstiId = [...serviceProviders, instId];
    getTeachersList(allInstiId);
    getClassLists(allInstiId);
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
    getInstitutionList();
  }, []);

  const {name, curricular, classRoom, maxPersons, institute, teacher} = roomData;

  return (
    <div className="">
      {/* Section Header */}
      <BreadCrums
        unsavedChanges={unsavedChanges}
        toggleModal={toggleModal}
        items={breadCrumsList}
      />
      <div className="flex justify-between">
        <SectionTitleV3
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
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {RoomEDITdict[userLanguage]['HEADING']}
          </h3>
          <div className="">
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
            {/*
             **
             * Hide institution drop down since all the things are tied to the
             * Institute, will add this later if need to add builders saperately.
             */}
            {/* <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Institute  <span className="text-red-500"> *</span>
              </label>
              <Selector selectedItem={institute.value} placeholder="Select Institute" list={institutionList} onChange={selectInstitute} />
            </div> */}

            <div>
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
                  {RoomEDITdict[userLanguage]['CURRICULUM_LABEL']}
                </label>
                <Selector
                  selectedItem={curricular.value}
                  placeholder={RoomEDITdict[userLanguage]['CURRICULUM_PLACEHOLDER']}
                  list={curricularList}
                  onChange={selectCurriculum}
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

export default EditRoom;
