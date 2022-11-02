import {GraphQLAPI as API, graphqlOperation} from '@aws-amplify/api-graphql';
import React, {Fragment, useEffect, useState} from 'react';
import {FaSpinner, FaTimes} from 'react-icons/fa';
import {HiPencil} from 'react-icons/hi';
import {useHistory} from 'react-router-dom';

import AddButton from 'atoms/Buttons/AddButton';
import {DeleteActionBtn} from 'atoms/Buttons/DeleteActionBtn';
import SearchSelectorWithAvatar from 'atoms/Form/SearchSelectorWithAvatar';
import Loader from 'atoms/Loader';

import {getImageFromS3} from 'utilities/services';
import {
  createFilterToFetchAllItemsExcept,
  getInitialsFromString,
  initials,
  stringToHslColor
} from 'utilities/strings';
import {getAsset} from 'assets';

import Modal from 'atoms/Modal';
import Registration from 'components/Dashboard/Admin/UserManagement/Registration';
import User from 'components/Dashboard/Admin/UserManagement/User';
import {useGlobalContext} from 'contexts/GlobalContext';
import * as customMutations from 'customGraphql/customMutations';
import * as customQueries from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import useAuth from 'customHooks/useAuth';
import * as mutations from 'graphql/mutations';
import ModalPopUp from 'molecules/ModalPopUp';
import LocationBadge from './LocationBadge';
import {PersonStatus} from 'API';
import {useNotifications} from '@contexts/NotificationContext';

interface EditClassProps {
  instId: string;
  classId: string;
  toggleUpdateState?: () => void;
  roomData: any;
}

const EditClass = ({instId, classId, roomData, toggleUpdateState}: EditClassProps) => {
  const history = useHistory();
  const initialData = {id: '', name: '', institute: {id: '', name: '', value: ''}};
  const defaultNewMember = {
    id: '',
    name: '',
    value: '',
    avatar: '',
    group: {id: '', name: ''}
  };

  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [classData, setClassData] = useState(initialData);
  const [messages, setMessages] = useState({show: false, message: '', isError: false});
  const [addMessage, setAddMessage] = useState({message: '', isError: false});
  const [classStudents, setClassStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [searching, setSearching] = useState<boolean>(false);
  const [userModalOpen, setUserModalFormOpen] = useState<boolean>(false);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [studentProfileID, setStudentProfileID] = useState('');
  const [newMember, setNewMember] = useState(defaultNewMember);
  const [studentIdToEdit, setStudentIdToEdit] = useState<string>('');
  const [groups, setGroups] = useState([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [warnModal, setWarnModal] = useState({
    show: false,
    profile: false,
    profileId: '',
    goBack: false,
    message: 'Do you want to save changes before moving forward?'
  });
  const [warnModal2, setWarnModal2] = useState({
    show: false,
    message: '',
    action: () => {}
  });

  const {
    clientKey,
    userLanguage,
    state: {user},
    theme
  } = useGlobalContext();

  const {isAdmin, isBuilder, isSuperAdmin} = useAuth();

  const themeColor = getAsset(clientKey, 'themeClassName');
  const {editClassDict, RegistrationDict, UserDict} = useDictionary();
  const dictionary = editClassDict[userLanguage];

  const gotoProfileInfo = (profileId: string) => {
    history.push(
      isSuperAdmin || isAdmin || isBuilder
        ? `/dashboard/manage-institutions/manage-users/${profileId}`
        : `/dashboard/manage-institutions/institution/${instId}/manage-users/${profileId}`
    );
  };

  const getAllClassStudentByClassId = async (
    filter: any,
    nextToken: string,
    outArray: any[]
  ): Promise<any> => {
    let combined: any[];
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.listClassStudentsForRoom, {
          ...filter,
          nextToken: nextToken
        })
      );

      let returnedData = result.data.listClassStudents?.items;
      let NextToken = result.data.listClassStudents?.nextToken;

      combined = [...outArray, ...returnedData];

      if (NextToken) {
        combined = await getAllClassStudentByClassId(filter, NextToken, combined);
      }

      return combined;
    } catch (error) {
      console.log(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllStudents ~ error',
        error
      );
    }
  };

  const recursiveFetchAllStudents = async (
    neqList: any[],
    outArray: any[],
    nextToken: string | null
  ) => {
    try {
      let combined: any[] = [];
      let studentsFromAPI: any = await API.graphql(
        graphqlOperation(customQueries.fetchPersons, {
          filter: {
            role: {eq: 'ST'},
            or: [
              {status: {eq: PersonStatus.ACTIVE}},
              {status: {eq: PersonStatus.TRAINING}}
            ],
            ...createFilterToFetchAllItemsExcept(neqList, 'id')
          },
          nextToken
        })
      );

      let studentsData = studentsFromAPI.data.listPeople.items;
      let NextToken: string = studentsFromAPI.data.listPeople.nextToken;

      combined = [...studentsData, ...outArray];
      if (NextToken) {
        combined = await recursiveFetchAllStudents(neqList, combined, NextToken);
      }
      return combined;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClassData = async (classId: string) => {
    try {
      const classFilter = {
        filter: {
          classID: {
            eq: classId
          }
        }
      };

      const result = await getAllClassStudentByClassId(classFilter, undefined, []);

      const selectedStudentsIds: any = [];
      const selectedStudents = result?.map((stu: any) => {
        selectedStudentsIds.push(stu.student.id);
        return {
          id: stu.id,
          group: {name: stu.group, id: ''},
          status: stu.status,
          createAt: stu.createdAt,
          studentAuthID: stu.studentAuthID,
          student: {
            ...stu.student,
            email: stu.studentEmail,
            name: `${stu.student.firstName || ''} ${stu.student.lastName || ''}`,
            avatar: stu.student.image ? getImageFromS3(stu.student.image) : ''
          }
        };
      });

      let students: any = await recursiveFetchAllStudents(selectedStudentsIds, [], null);
      students = students.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.firstName || ''} ${item.lastName || ''}`,
        value: `${item.firstName || ''} ${item.lastName || ''}`,
        avatar: item.image ? getImageFromS3(item.image) : '',
        status: item.status || 'Inactive',
        email: item.email || '',
        authId: item.authId || '',
        firstName: item.firstName || '',
        lastName: item.lastName || ''
      }));
      await getClassRoomGroups(roomData.id);
      setClassStudents(selectedStudents);
      setAllStudents(sortStudents(students));
      setLoading(false);
    } catch (err) {
      console.error('err', err);
      setLoading(false);
      setMessages({
        show: true,
        message: dictionary.messages.errorfetch,
        isError: true
      });
    }
  };

  const fetchStudentList = async (searchQuery: string) => {
    // const result: any = await API.graphql(
    //   graphqlOperation(customQueries.listPersons, {
    //     filter: {
    //       role: {eq: 'ST'},
    //       or: [{firstName: {contains: searchQuery}}, {lastName: {contains: searchQuery}}]
    //     }
    //   })
    // );
    // const students = result.data.listPeople.items;

    // const mappedStudents = students.map((item: any, i: any) => ({
    //   id: item.id,
    //   name: `${item.firstName || ''} ${item.lastName || ''}`,
    //   value: `${item.firstName || ''} ${item.lastName || ''}`,
    //   avatar: item.image ? getImageFromS3(item.image) : '',
    //   status: item.status || 'Inactive',
    //   email: item.email || '',
    //   authId: item.authId || ''
    // }));

    // filter allStudents by searchQuery

    const filteredStudents = allStudents.filter((student: any) => {
      const {firstName, lastName, name} = student;

      const searchValue = searchQuery.toLowerCase();

      return (
        firstName?.toLowerCase().includes(searchValue) ||
        lastName?.toLowerCase().includes(searchValue) ||
        name?.toLowerCase().includes(searchValue)
      );
    });

    setFilteredStudents(sortStudents(filteredStudents));
    setSearching(false);
  };

  const sortStudents = (studentList: any) => {
    return studentList.sort((personA: any, personB: any) =>
      personA.name[0] < personB.name[0] ? -1 : 1
    );
  };

  const getClassRoomGroups = async (roomId: string) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(customQueries.listClassroomGroupssOptions, {
          filter: {
            classRoomID: {eq: roomId},
            groupType: {eq: 'Proficiency'}
          }
        })
      );
      setGroups(
        list?.data?.listClassroomGroups.items?.map((item: any) => ({
          name: item.groupName,
          id: item.id
        }))
      );
    } catch (error) {}
  };

  const clearFilteredStudents = () => {
    setFilteredStudents([]);
  };

  const onStudentSelect = (str: string, name: string, id: string, avatar: string) => {
    setNewMember({
      id: id,
      name: name,
      value: str,
      avatar: avatar,
      group: {id: '', name: ''}
    });
    if (addMessage.message) {
      setAddMessage({
        message: '',
        isError: false
      });
    }
  };

  const addStudentInClass = async () => {
    if (newMember.id) {
      const {id} = newMember;
      await saveClassStudent(id);
      setNewMember(defaultNewMember);
    }
    setFilteredStudents([]);
  };

  const {setNotification} = useNotifications();

  const saveClassStudent = async (id: string) => {
    try {
      setAdding(true);
      const selected = allStudents.find((item: any) => item.id === id);
      const input = {
        classID: classId,
        group: newMember.group,
        studentID: id,
        studentAuthID: selected.authId,
        studentEmail: selected.email,
        status: PersonStatus.ACTIVE
      };
      let newStudent: any = await API.graphql(
        graphqlOperation(customMutations.createClassStudent, {input: input})
      );
      newStudent = newStudent.data.createClassStudent;
      if (newMember.group?.id) {
        await API.graphql(
          graphqlOperation(customMutations.createClassroomGroupStudents, {
            input: {
              classRoomGroupID: newMember.group?.id,
              studentEmail: selected.email,
              studentAuthId: selected.authId
            }
          })
        );
      }

      const updatedStudent = {
        id: newStudent.id,
        createAt: newStudent.createdAt,
        group: newStudent.group,
        status: newStudent.status,

        student: {...selected, onDemand: Boolean(newStudent?.student?.onDemand)}
      };

      classStudents.push(updatedStudent);

      setClassStudents([...classStudents]);
      setAllStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== newMember.id)
      );

      setAdding(false);

      setNotification({
        title: `Student added successfully - ${newStudent.studentEmail}`,
        show: true,
        type: 'success'
      });
    } catch (err) {
      console.error('saveClassStudent', err);
      setNotification({title: `Something went wrong`, type: 'error', show: true});
      setAddMessage({
        message: dictionary.messages.errorstudentadd,
        isError: true
      });
    }
  };

  const onDelete = (id: any) => {
    const onDrop = async () => {
      setDeleting(true);
      await API.graphql(
        graphqlOperation(customMutations.deleteClassStudent, {
          input: {id}
        })
      );
      const deletedStudentData = classStudents.find((item) => item.id === id);
      setAllStudents((prevStudent) => [
        ...prevStudent,
        {
          id: deletedStudentData.id,
          name: `${deletedStudentData.student?.firstName || ''} ${
            deletedStudentData.student?.lastName || ''
          }`,
          value: `${deletedStudentData.student?.firstName || ''} ${
            deletedStudentData.student?.lastName || ''
          }`,
          avatar: deletedStudentData.student?.image
            ? getImageFromS3(deletedStudentData.student?.image)
            : '',
          status: deletedStudentData.status || 'Inactive',
          email: deletedStudentData.student?.email || '',
          authId: deletedStudentData.studentAuthID || ''
        }
      ]);
      setClassStudents((prevStudents) => prevStudents.filter((item) => item.id !== id));
      closeDeleteModal();
      setDeleting(false);
      setNotification({
        title: `Student removed from classroom - ${deletedStudentData.student?.email}`,
        type: 'success',
        show: true
      });
    };
    setWarnModal2({
      show: true,
      message: `Are you sure you want to remove this student from class?`,
      action: onDrop
    });
  };

  useEffect(() => {
    if (classId) fetchClassData(classId);
  }, [classId]);

  const validateForm = async () => {
    if (classData.name.trim() === '') {
      setMessages({
        show: true,
        message: dictionary.messages.classrequired,
        isError: true
      });
      return false;
    } else if (classData.institute.id === '') {
      setMessages({
        show: true,
        message: dictionary.messages.selectinstitute,
        isError: true
      });
      return false;
    } else {
      return true;
    }
  };

  const saveClassDetails = async () => {
    setSaving(true);
    const isValid = await validateForm();
    if (isValid) {
      try {
        const input = {
          id: classData.id,
          name: classData.name,
          institutionID: classData.institute.id
        };
        const newClass: any = await API.graphql(
          graphqlOperation(mutations.updateClass, {input: input})
        );
        toggleUpdateState();
        setMessages({
          show: true,
          message: dictionary.messages.classupdate,
          isError: false
        });
        setSaving(false);
      } catch {
        setMessages({
          show: true,
          message: dictionary.messages.unableupdate,
          isError: true
        });
        setSaving(false);
      }
    }
  };

  const postMutation = () => {
    setShowRegistrationForm(false);
    fetchClassData(classId);
  };

  const DiscardChanges = () => {
    if (warnModal.goBack) {
      history.goBack();
    } else if (warnModal.profile) {
      gotoProfileInfo(warnModal.profileId);
    }
  };

  const saveAndMove = async () => {
    if (warnModal.goBack) {
      await saveClassDetails();
      history.goBack();
    } else if (warnModal.profile) {
      await saveClassDetails();
      gotoProfileInfo(warnModal.profileId);
    }
  };

  const closeDeleteModal = () => {
    setWarnModal2({...warnModal2, show: false});
  };

  return (
    <div className="">
      <div className="px-8 py-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900 w-auto capitalize">
          {roomData.name}
        </h3>
      </div>

      {loading ? (
        <div className="h-100 flex justify-center items-center">
          <div className="w-5/10">
            <Loader />
            <p className="mt-2 text-center">{dictionary.LOADING}</p>
          </div>
        </div>
      ) : (
        <div className="px-4 mt-4">
          <div className="flex flex-col items-center justify-center m-auto px-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="col-span-1 md:col-span-2 lg:col-span-4">
                <label className="block text-xs font-semibold mb-1 leading-5 text-gray-700">
                  Add students to class
                </label>
                <div className="flex items-center justify-between">
                  <SearchSelectorWithAvatar
                    selectedItem={newMember}
                    list={filteredStudents.length > 0 ? filteredStudents : allStudents}
                    placeholder={dictionary.ADD_STUDENT_PLACEHOLDER}
                    onChange={onStudentSelect}
                    fetchStudentList={fetchStudentList}
                    clearFilteredStudents={clearFilteredStudents}
                    searchStatus={searching}
                    searchCallback={setSearching}
                    imageFromS3={false}
                    creatable
                    creatableLabel={'Add students from register to class'}
                    onCreate={() => setShowRegistrationForm(true)}
                  />
                </div>
              </div>

              <AddButton
                className="mx-2 2xl:ml-5 2xl:mr-10 py-1 px-5 mt-auto"
                label={dictionary.ADD_STUDENT_BUTTON}
                onClick={addStudentInClass}
                disabled={adding || !newMember.id}
              />
            </div>
            <div className="py-2">
              <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
                {addMessage?.message}
              </p>
            </div>
          </div>
          {classStudents ? (
            <Fragment>
              {classStudents.length ? (
                <Fragment>
                  <div className="mt-8 w-full  m-auto px-2">
                    <div className="flex justify-between w-full items-center px-4 2xl:px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 text-sm text-gray-600">
                      <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                        {dictionary.TABLE.SNO}
                      </div>
                      <div className="flex w-5/10 items-center px-4 py-2">
                        {dictionary.TABLE.NAME}
                      </div>
                      <div className="w-3/10 px-3">{dictionary.TABLE.STATUS}</div>
                      <div className="w-3/10 px-3">{dictionary.TABLE.DATE}</div>
                      <div className="w-1/10 px-3 flex justify-center">
                        {dictionary.TABLE.ACTIONS}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full m-auto pl-2 max-h-88 overflow-y-scroll">
                    {classStudents.map((item, index) => {
                      return (
                        <div
                          key={item.id}
                          className="flex justify-between w-full items-center px-4 2xl:px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                          <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                            {index + 1}.
                          </div>
                          <div
                            className={`flex w-5/10 items-center px-4 py-2 whitespace-normal ${
                              user.role !== 'BLD' ? 'cursor-pointer' : ''
                            } `}
                            onClick={() => {
                              user.role !== 'BLD' && setStudentProfileID(item.student.id);
                              user.role !== 'BLD' && setUserModalFormOpen(true);
                            }}>
                            <div className="flex-shrink-0 h-10 w-10 flex items-center">
                              {item.student.avatar ? (
                                <img
                                  src={item.student.avatar}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <div
                                  className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold"
                                  style={{
                                    background: `${stringToHslColor(
                                      getInitialsFromString(item.student.name)[0] +
                                        ' ' +
                                        getInitialsFromString(item.student.name)[1]
                                    )}`,
                                    textShadow: '0.1rem 0.1rem 2px #423939b3'
                                  }}>
                                  {item.student.name
                                    ? initials(
                                        getInitialsFromString(item.student.name)[0],
                                        getInitialsFromString(item.student.name)[1]
                                      )
                                    : initials('N', 'A')}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div
                                className={`${
                                  user.role !== 'BLD' ? 'hover:text-gray-600' : ''
                                } text-sm leading-5 font-medium text-gray-900`}>
                                {item.student.name}
                              </div>
                              <div className="text-sm leading-5 text-gray-500">
                                {item.student.email}
                              </div>
                            </div>
                          </div>

                          <div className="w-3/10">
                            <LocationBadge onDemand={item?.student?.onDemand} />
                          </div>
                          <div className="w-3/10 px-3 text-gray-600 text-sm">
                            {item.createAt
                              ? new Date(item.createAt).toLocaleDateString()
                              : '--'}
                          </div>

                          <div className="w-1/10 px-3 flex justify-center cursor-pointer">
                            <DeleteActionBtn handleClick={() => onDelete(item.id)} />
                            {studentIdToEdit === item.id ? (
                              <span
                                className={`ml-2 w-4 h-4 flex items-center cursor-pointer ${
                                  theme.textColor[themeColor]
                                } ${updating ? 'animate-spin' : ''}`}
                                onClick={() => setStudentIdToEdit('')}>
                                {updating ? <FaSpinner /> : <FaTimes />}
                              </span>
                            ) : (
                              <span
                                className={`ml-2 w-4 h-4 flex items-center cursor-pointer ${theme.textColor[themeColor]}`}
                                onClick={() => setStudentIdToEdit(item.id)}>
                                <HiPencil />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Fragment>
              ) : (
                <div className="py-12 my-12 m-auto text-center">
                  {dictionary.NOSTUDENT}
                </div>
              )}
              {messages.show && (
                <div className="py-2 m-auto text-center">
                  <p
                    className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
                    {messages.message && messages.message}
                  </p>
                </div>
              )}
              {warnModal.show && (
                <ModalPopUp
                  closeAction={DiscardChanges}
                  saveAction={saveAndMove}
                  saveLabel="SAVE"
                  cancelLabel="DISCARD"
                  message={warnModal.message}
                />
              )}
              {warnModal2.show && (
                <ModalPopUp
                  closeAction={closeDeleteModal}
                  saveAction={warnModal2.action}
                  saveLabel="Yes"
                  message={warnModal2.message}
                  loading={deleting}
                />
              )}
              {showRegistrationForm && (
                <Modal
                  showHeader={true}
                  title={RegistrationDict[userLanguage]['title']}
                  showHeaderBorder={true}
                  showFooter={false}
                  closeAction={() => setShowRegistrationForm(false)}>
                  <Registration
                    classData={{classId, roomId: roomData.id}}
                    isInInstitute
                    isInModalPopup
                    postMutation={postMutation}
                    instId={instId}
                  />
                </Modal>
              )}
              {userModalOpen && (
                <Modal
                  title={UserDict[userLanguage]['title']}
                  showHeader={true}
                  showHeaderBorder={false}
                  showFooter={false}
                  scrollHidden={true}
                  closeAction={() => setUserModalFormOpen(false)}
                  position={'fixed'}>
                  <User
                    shouldNavigate={false}
                    onSuccessCallback={() => setUserModalFormOpen(false)}
                    instituteId={instId}
                    userId={studentProfileID}
                    insideModalPopUp={false}
                  />
                </Modal>
              )}
            </Fragment>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EditClass;
