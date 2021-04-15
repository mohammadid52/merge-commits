import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';

import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutation from '../../../../../customGraphql/customMutations';
import * as queries from '../../../../../graphql/queries';
import * as mutation from '../../../../../graphql/mutations';
import SectionTitle from '../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../Atoms/PageWrapper';
import BreadCrums from '../../../../Atoms/BreadCrums';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import { getFilterORArray } from '../../../../../utilities/strings';
import SelectorWithAvatar from '../../../../Atoms/Form/SelectorWithAvatar';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import { getImageFromS3 } from '../../../../../utilities/services';
import useDictionary from '../../../../../customHooks/dictionary';
import { getAsset } from '../../../../../assets';
import MultipleSelector from '../../../../Atoms/Form/MultipleSelector';

interface RoomBuilderProps {}

const RoomBuilder = (props: RoomBuilderProps) => {
  const {} = props;
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const initialData = {
    id: '',
    name: '',
    institute: { id: '', name: '', value: '' },
    teacher: { id: '', name: '', value: '' },
    classRoom: { id: '', name: '', value: '' },
    curricular: { id: '', name: '', value: '' },
    maxPersons: '',
  };
  const { theme, clientKey, userLanguage } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const [roomData, setRoomData] = useState(initialData);
  const [institutionList, setInstitutionList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [curricularList, setCurricularList] = useState([]);
  const [coTeachersList, setCoTeachersList] = useState(teachersList);
  const [selectedCoTeachers, setSelectedCoTeachers] = useState<
    { email?: string; authId: string; value?: string; id?: string; name?: string }[]
  >([]);

  const { RoomBuilderdict, BreadcrumsTitles } = useDictionary(clientKey);
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false,
  });
  const [loading, setLoading] = useState(false);
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const breadCrumsList = [
    { title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false },
    { title: BreadcrumsTitles[userLanguage]['CLASSROOM_CREATION'], url: `${match.url}`, last: true },
  ];

  const createNewEntry = (field: string) => {
    if (field === 'teacher') {
      history.push('/dashboard/registration');
    } else if (field === 'curricular') {
      history.push(`/dashboard/manage-institutions/institution/curricular-creation?id=${roomData?.institute?.id}`);
    } else if (field === 'class') {
      history.push(`/dashboard/manage-institutions/institution/class-creation?id=${roomData?.institute?.id}`);
    }
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
    const filteredDefaultTeacher: object[] = teachersList.filter((coTeacher: any) => coTeacher.id !== id);
    setCoTeachersList(filteredDefaultTeacher);
    setSelectedCoTeachers((list: any) => list.filter((d: any) => d.id !== id));
  };

  const selectCoTeacher = (id: string, name: string, value: string) => {
    let updatedList;
    const currentCoTeachers = selectedCoTeachers;
    const selectedItem = currentCoTeachers.find((item) => item.id === id);

    if (!selectedItem) {
      const selectedItem = coTeachersList.find((item) => item.id === id);
      updatedList = [...currentCoTeachers, { id, name, value, ...selectedItem }];
    } else {
      updatedList = currentCoTeachers.filter((item) => item.id !== id);
    }

    setSelectedCoTeachers(updatedList);
  };

  const editInputField = (e: any) => {
    setRoomData({
      ...roomData,
      [e.target.name]: e.target.value,
    });
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
        teacher: { id: '', name: '', value: '' },
        classRoom: { id: '', name: '', value: '' },
        curricular: { id: '', name: '', value: '' },
      });
    }
    removeErrorMsg();
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
        value: `${item.name ? item.name : ''}`,
      }));
      setInstitutionList(InstituteList);
      if (InstituteList.length === 0) {
        setMessages({
          show: true,
          message: RoomBuilderdict[userLanguage]['messages']['error']['institutebefor'],
          isError: true,
        });
      }
    } catch {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['error']['institutelist'],
        isError: true,
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
      const serviceProviders = list.data.getInstitution?.serviceProviders?.items;
      return serviceProviders;
    } catch {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['error']['institutelist'],
        isError: true,
      });
    }
  };

  const getTeachersList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listStaffs, {
          filter: { or: getFilterORArray(allInstiId, 'institutionID') },
        })
      );
      const listStaffs = list.data.listStaffs.items;
      if (listStaffs?.length === 0) {
        setMessages({
          show: true,
          message: RoomBuilderdict[userLanguage]['messages']['error']['staffmember'],
          isError: true,
        });
      } else {
        const sortedList = listStaffs.sort((a: any, b: any) =>
          a.staffMember?.firstName?.toLowerCase() > b.staffMember?.firstName?.toLowerCase() ? 1 : -1
        );
        const staffList = sortedList
          .filter((staff: any) => staff.staffMember)
          .map((item: any) => ({
            id: item.staffMember?.id,
            name: `${item.staffMember?.firstName || ''} ${item.staffMember?.lastName || ''}`,
            value: `${item.staffMember?.firstName || ''} ${item.staffMember?.lastName || ''}`,
            email: item.staffMember?.email ? item.staffMember?.email : '',
            authId: item.staffMember?.authId ? item.staffMember?.authId : '',
          }));

        // Filter duplicate results.
        const filteredIdList: Array<string> = [];
        const updatedList = staffList.filter((item: any) => {
          if (filteredIdList.indexOf(item.id) < 0) {
            filteredIdList.push(item.id);
            return item;
          }
        });

        setTeachersList(updatedList);
        setCoTeachersList(updatedList);
      }
    } catch (err) {
      console.log(err);
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['error']['teacherlist'],
        isError: true,
      });
    }
  };

  const getClassLists = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listClasss, {
          filter: { or: getFilterORArray(allInstiId, 'institutionID') },
        })
      );
      const listClass = list.data.listClasss?.items;
      if (listClass.length === 0) {
        setMessages({
          show: true,
          message: RoomBuilderdict[userLanguage]['messages']['error']['createclass'],
          isError: true,
        });
      } else {
        const sortedList = listClass.sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase() ? 1 : -1));
        const classList = sortedList.map((item: any, i: any) => ({
          id: item.id,
          name: `${item.name ? item.name : ''}`,
          value: `${item.name ? item.name : ''}`,
        }));
        setClassList(classList);
      }
    } catch {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['error']['classlist'],
        isError: true,
      });
    }
  };

  const getCurricularList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listCurriculums, {
          filter: { or: getFilterORArray(allInstiId, 'institutionID') },
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
        message: RoomBuilderdict[userLanguage]['messages']['error']['curricular'],
        isError: true,
      });
    }
  };

  const checkUniqRoomName = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listRooms, {
          filter: {
            institutionID: { eq: roomData.institute.id },
            name: { eq: roomData.name },
          },
        })
      );
      return list.data.listRooms.items.length === 0 ? true : false;
    } catch {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['error']['process'],
        isError: true,
      });
    }
  };

  const validateForm = async () => {
    if (roomData.name.trim() === '') {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['validation']['classroomname'],
        isError: true,
      });
      return false;
    } else if (roomData.institute.id === '') {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['validation']['institute'],
        isError: true,
      });
      return false;
    } else if (roomData.teacher.id === '') {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['validation']['teacher'],
        isError: true,
      });
      return false;
    } else if (roomData.classRoom.id === '') {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['validation']['class'],
        isError: true,
      });
      return false;
    } else if (roomData.maxPersons == '') {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['validation']['maxstudent'],
        isError: true,
      });
      return false;
    } else if (parseInt(roomData.maxPersons) < 1 || parseInt(roomData.maxPersons) > 30) {
      setMessages({
        show: true,
        message: RoomBuilderdict[userLanguage]['messages']['validation']['allowstudent'],
        isError: true,
      });
      return false;
    } else if (roomData.name.trim() !== '') {
      const isUniq = await checkUniqRoomName();
      if (!isUniq) {
        setMessages({
          show: true,
          message: RoomBuilderdict[userLanguage]['messages']['validation']['classroomexist'],
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

  const saveRoomCurricular = async (roomId: string, currId: string) => {
    if (roomId) {
      try {
        const curricularInput = {
          roomID: roomId,
          curriculumID: currId,
        };

        const addCurricular: any = await API.graphql(
          graphqlOperation(mutation.createRoomCurriculum, { input: curricularInput })
        );
        setMessages({
          show: true,
          message: RoomBuilderdict[userLanguage]['messages']['success']['classroomdetail'],
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

  const createNewRoom = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        setLoading(true);
        const input = {
          institutionID: roomData.institute.id,
          classID: roomData.classRoom.id,
          teacherAuthID: teachersList.find((item: any) => item.id === roomData.teacher.id).authId,
          teacherEmail: teachersList.find((item: any) => item.id === roomData.teacher.id).email,
          name: roomData.name,
          maxPersons: roomData.maxPersons,
          // ********************** CHANGES HERE ********************************
          // ********************** Uncomment this lines and add it to graphql query ********************************
          // coTeachersEmail: selectedCoTeachers.map((item: any) => item.email),
          // coTeachersAuthId: selectedCoTeachers.map((item: any) => item.authId),
        };

        const newRoom: any = await API.graphql(graphqlOperation(customMutation.createRoom, { input: input }));
        const roomId = newRoom.data.createRoom.id;
        if (roomData.curricular.id) {
          await saveRoomCurricular(roomId, roomData.curricular.id);
        } else {
          setMessages({
            show: true,
            message: RoomBuilderdict[userLanguage]['messages']['success']['newclassroom'],
            isError: false,
          });
          setRoomData(initialData);
          setLoading(false);
        }
      } catch {
        setMessages({
          show: true,
          message: RoomBuilderdict[userLanguage]['messages']['error']['ecreateclass'],
          isError: true,
        });
        setLoading(false);
      }
    }
  };
  const fetchOtherList = async (id: string) => {
    const items: any = await getInstituteInfo(id);
    const serviceProviders = items.map((item: any) => item.providerID);
    const allInstiId = [...serviceProviders, id];
    getTeachersList(allInstiId);
    getClassLists(allInstiId);
    getCurricularList(allInstiId);
  };

  useEffect(() => {
    if (roomData.institute.id) {
      fetchOtherList(roomData.institute.id);
    }
  }, [roomData.institute.id]);

  useEffect(() => {
    const instId = params.get('id');
    if (instId) {
      setRoomData({
        ...roomData,
        institute: {
          id: instId,
          name: '',
          value: '',
        },
      });
      getInstitutionList();
    } else {
      history.push('/dashboard/manage-institutions');
    }
  }, []);

  useEffect(() => {
    if (roomData.institute.id) {
      const instName = institutionList.find((item: { id: string }) => item.id === roomData.institute.id).name;
      if (instName) {
        setRoomData({
          ...roomData,
          institute: {
            id: roomData.institute.id,
            name: instName,
            value: instName,
          },
        });
      } else {
        setMessages({
          show: true,
          message: RoomBuilderdict[userLanguage]['messages']['error']['invalid'],
          isError: true,
        });
      }
    }
  }, [institutionList]);

  const { name, curricular, classRoom, maxPersons, institute, teacher } = roomData;

  return (
    <div className="">
      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle
          title={RoomBuilderdict[userLanguage]['TITLE']}
          subtitle={RoomBuilderdict[userLanguage]['SUBTITLE']}
        />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons label="Go Back" btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {RoomBuilderdict[userLanguage]['HEADING']}
          </h3>
          <div className="">
            <div className="px-3 py-4">
              <FormInput
                value={name}
                id="name"
                onChange={editInputField}
                name="name"
                label={RoomBuilderdict[userLanguage]['NAME_LABEL']}
                placeHolder={RoomBuilderdict[userLanguage]['NAME_PLACEHOLDER']}
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
                  {RoomBuilderdict[userLanguage]['TEACHER_LABEL']} <span className="text-red-500"> *</span>
                </label>
                <SelectorWithAvatar
                  selectedItem={teacher}
                  list={teachersList}
                  placeholder={RoomBuilderdict[userLanguage]['TEACHER_PLACEHOLDER']}
                  onChange={selectTeacher}
                />
                <p
                  className={`text-xs p-1 text-gray-600 cursor-pointer hover:${theme.textColor[themeColor]}`}
                  onClick={() => createNewEntry('teacher')}>
                  Add new teacher
                </p>
              </div>
              <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  {RoomBuilderdict[userLanguage]['CO_TEACHER_LABEL']}
                </label>
                <MultipleSelector
                  selectedItems={selectedCoTeachers}
                  list={coTeachersList}
                  placeholder={RoomBuilderdict[userLanguage]['CO_TEACHER_PLACEHOLDER']}
                  onChange={selectCoTeacher}
                  disabled={roomData.teacher.id === ''}
                />
              </div>
              <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  {RoomBuilderdict[userLanguage]['CLASS_NAME_LABEL']} <span className="text-red-500"> *</span>
                </label>
                <Selector
                  selectedItem={classRoom.value}
                  placeholder={RoomBuilderdict[userLanguage]['CLASS_NAME_PLACEHOLDER']}
                  list={classList}
                  onChange={selectClass}
                />
                <p
                  className={`text-xs p-1 text-gray-600 cursor-pointer hover:${theme.textColor[themeColor]}`}
                  onClick={() => createNewEntry('class')}>
                  Add new class
                </p>
              </div>
              <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  {RoomBuilderdict[userLanguage]['CURRICULUM_LABEL']}
                </label>
                <Selector
                  selectedItem={curricular.value}
                  placeholder={RoomBuilderdict[userLanguage]['CURRICULUM_PLACEHOLDER']}
                  list={curricularList}
                  onChange={selectCurriculum}
                />
                <p
                  className={`text-xs p-1 text-gray-600 cursor-pointer hover:${theme.textColor[themeColor]}`}
                  onClick={() => createNewEntry('curricular')}>
                  Add new curriculum
                </p>
              </div>
              <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  {RoomBuilderdict[userLanguage]['MAXSTUDENT_LABEL']} <span className="text-red-500"> *</span>
                </label>
                <input
                  type="number"
                  id="maxPersons"
                  name="maxPersons"
                  onChange={editInputField}
                  className={`mt-1 block w-full sm:text-sm sm:leading-5  border-0 border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
                  value={maxPersons}
                  placeholder={RoomBuilderdict[userLanguage]['MAXSTUDENT_PLACHOLDER']}
                  min="1"
                  max="30"
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
            btnClass="py-3 px-12 text-sm"
            label={
              !loading
                ? RoomBuilderdict[userLanguage]['BUTTON']['SAVE']
                : RoomBuilderdict[userLanguage]['BUTTON']['SAVING']
            }
            onClick={createNewRoom}
          />
        </div>
      </PageWrapper>
    </div>
  );
};

export default RoomBuilder;
