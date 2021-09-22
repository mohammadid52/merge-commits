import React, {Fragment, useState, useEffect, useContext} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';
import {HiPencil} from 'react-icons/hi';
import {FaSpinner, FaTimes} from 'react-icons/fa';
import API, {graphqlOperation} from '@aws-amplify/api';

import SelectorWithAvatar from '../../../../Atoms/Form/SelectorWithAvatar';
import SectionTitle from '../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../Atoms/PageWrapper';
import BreadCrums from '../../../../Atoms/BreadCrums';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import AddButton from '../../../../Atoms/Buttons/AddButton';
import {DeleteActionBtn} from '../../../../Atoms/Buttons/DeleteActionBtn';

import {
  stringToHslColor,
  getInitialsFromString,
  initials,
  createFilterToFetchAllItemsExcept,
  createFilterToFetchSpecificItemsOnly,
} from '../../../../../utilities/strings';
import {getImageFromS3} from '../../../../../utilities/services';
import {groupOptions} from '../../../../../utilities/staticData';
import {getAsset} from '../../../../../assets';

import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as queries from '../../../../../graphql/queries';
import * as mutations from '../../../../../graphql/mutations';
import useDictionary from '../../../../../customHooks/dictionary';
import {GlobalContext} from '../../../../../contexts/GlobalContext';
import ModalPopUp from '../../../../Molecules/ModalPopUp';
import {goBackBreadCrumb} from '../../../../../utilities/functions';
import SearchSelectorWithAvatar from '../../../../Atoms/Form/SearchSelectorWithAvatar';

interface EditClassProps {}

const EditClass = (props: EditClassProps) => {
  const history = useHistory();
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const urlParams = useQuery();
  const match = useRouteMatch();

  const initialData = {id: '', name: '', institute: {id: '', name: '', value: ''}};
  const defaultNewMember = {id: '', name: '', value: '', avatar: '', group: ''};
  const [classData, setClassData] = useState(initialData);
  const [messages, setMessages] = useState({show: false, message: '', isError: false});
  const [addMessage, setAddMessage] = useState({message: '', isError: false});
  const [classStudents, setClassStudents] = useState([]);
  const [students, setStudents] = useState([]);

  const [searching, setSearching] = useState<boolean>(false);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [newMember, setNewMember] = useState(defaultNewMember);
  const [studentIdToEdit, setStudentIdToEdit] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [previousName, setPreviousName] = useState('');
  const [warnModal, setWarnModal] = useState({
    show: false,
    profile: false,
    profileId: '',
    goBack: false,
    message: 'Do you want to save changes before moving forward?',
  });
  const [warnModal2, setWarnModal2] = useState({
    show: false,
    message: '',
    action: () => {},
  });

  const {clientKey, userLanguage, theme} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const {editClassDict, BreadcrumsTitles} = useDictionary(clientKey);
  const dictionary = editClassDict[userLanguage];

  const breadCrumsList = [
    {title: BreadcrumsTitles[userLanguage]['HOME'], url: '/dashboard', last: false},
    {
      title: BreadcrumsTitles[userLanguage]['INSTITUTION_MANAGEMENT'],
      url: '/dashboard/manage-institutions',
      last: false,
    },
    {
      title: classData?.institute?.name || 'loading...',
      goBack: true,
      last: false,
    },
    {
      title: BreadcrumsTitles[userLanguage]['CLASSES'],
      url: `/dashboard/manage-institutions/institution?id=${classData.institute?.id}&tab=class`,
      last: false,
    },
    {
      title: classData?.name,
      url: `${match.url}?id=${urlParams.get('id')}`,
      last: true,
    },
  ];

  const gotoProfileInfo = (profileId: string) => {
    history.push(`/dashboard/manage-users/user?id=${profileId}`);
  };

  const fetchClassData = async (classId: string) => {
    try {
      const result: any = await API.graphql(
        graphqlOperation(customQueries.getClassDetails, {id: classId})
      );
      const classData = result.data.getClass;
      setClassData({
        ...classData,
        id: classData.id,
        name: classData.name,
        institute: {
          id: classData.institution.id,
          name: classData.institution.name,
          value: classData.institution.name,
        },
      });
      const selectedStudentsIds: any = [];
      const selectedStudents = classData.students.items.map((stu: any) => {
        selectedStudentsIds.push(stu.student.id);
        return {
          id: stu.id,
          group: stu.group,
          status: stu.status,
          createAt: stu.createdAt,
          studentAuthID: stu.studentAuthID,
          student: {
            ...stu.student,
            email: stu.studentEmail,
            name: `${stu.student.firstName || ''} ${stu.student.lastName || ''}`,
            avatar: stu.student.image ? getImageFromS3(stu.student.image) : '',
          },
        };
      });
      let students: any = await API.graphql(
        graphqlOperation(customQueries.fetchPersons, {
          filter: {
            role: {eq: 'ST'},
            status: {eq: 'ACTIVE'},
            ...createFilterToFetchAllItemsExcept(selectedStudentsIds, 'id'),
          },
          limit: 500,
        })
      );
      students = students.data.listPersons.items;
      students = students.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.firstName || ''} ${item.lastName || ''}`,
        value: `${item.firstName || ''} ${item.lastName || ''}`,
        avatar: item.image ? getImageFromS3(item.image) : '',
        status: item.status || 'Inactive',
        email: item.email || '',
        authId: item.authId || '',
      }));
      setClassStudents(selectedStudents);
      setStudents(sortStudents(students));
      setLoading(false);
    } catch (err) {
      console.log('err', err);
      setLoading(false);
      setMessages({
        show: true,
        message: dictionary.messages.errorfetch,
        isError: true,
      });
    }
  };

  const fetchStudentList = async (searchQuery: string) => {
    const result: any = await API.graphql(
      graphqlOperation(customQueries.listPersons, {
        filter: {
          role: {eq: 'ST'},
          status: {eq: 'ACTIVE'},
          or: [{firstName: {contains: searchQuery}}, {lastName: {contains: searchQuery}}],
        },
      })
    );
    const students = result.data.listPersons.items;
    const mappedStudents = students.map((item: any, i: any) => ({
      id: item.id,
      name: `${item.firstName || ''} ${item.lastName || ''}`,
      value: `${item.firstName || ''} ${item.lastName || ''}`,
      avatar: item.image ? getImageFromS3(item.image) : '',
      status: item.status || 'Inactive',
      email: item.email || '',
      authId: item.authId || '',
    }));
    setFilteredStudents(sortStudents(mappedStudents));
    setSearching(false);
  };

  const sortStudents = (studentList: any) => {
    return studentList.sort((personA: any, personB: any) =>
      personA.name[0] < personB.name[0] ? -1 : 1
    );
  };

  const clearFilteredStudents = () => {
    setFilteredStudents([]);
  };

  const onNameChange = (e: any) => {
    setClassData({
      ...classData,
      name: e.target.value,
    });
    setUnsavedChanges(true);
    if (messages.show) {
      setMessages({show: false, message: '', isError: false});
    }
  };

  const onStudentSelect = (str: string, name: string, id: string, avatar: string) => {
    setNewMember({
      id: id,
      name: name,
      value: str,
      avatar: avatar,
      group: '',
    });
    if (addMessage.message) {
      setAddMessage({
        message: '',
        isError: false,
      });
    }
  };

  const addStudentInClass = async () => {
    if (newMember.id) {
      const {id, name, avatar} = newMember;
      await saveClassStudent(id, classData.id);
      setNewMember(defaultNewMember);
    }
    setFilteredStudents([]);
  };

  const saveClassStudent = async (id: string, classId: string) => {
    try {
      setAdding(true);
      const selected = students.find((item: any) => item.id === id);
      const input = {
        classID: classId,
        group: newMember.group,
        studentID: id,
        studentAuthID: selected.authId,
        studentEmail: selected.email,
        status: 'Active',
      };
      let newStudent: any = await API.graphql(
        graphqlOperation(customMutations.createClassStudent, {input: input})
      );
      newStudent = newStudent.data.createClassStudent;
      setClassStudents([
        ...classStudents,
        {
          id: newStudent.id,
          createAt: newStudent.createdAt,
          group: newStudent.group,
          status: newStudent.status,
          student: {...selected},
        },
      ]);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== newMember.id)
      );
      setAdding(false);
      setAddMessage({
        message: 'Student added successfully',
        isError: false,
      });
    } catch (err) {
      console.log('saveClassStudent', err);
      setAddMessage({
        message: dictionary.messages.errorstudentadd,
        isError: true,
      });
    }
  };

  // const onClassStudentStatusChange = async (
  //   val: string,
  //   name: string,
  //   id: string,
  //   studentId: string
  // ) => {
  //   setUpdateStatus(true);
  //   await API.graphql(
  //     graphqlOperation(customMutations.updateClassStudent, {
  //       input: {id: studentId, status: val},
  //     })
  //   );
  //   const updatedSudents = classStudents.map((stu) => {
  //     if (stu.id === studentId) {
  //       stu.status = val;
  //     }
  //     return stu;
  //   });
  //   setClassStudents(updatedSudents);
  //   setStatusEdit('');
  //   setUpdateStatus(false);
  // };

  const onGroupEdit = async (studentId: string, group: string) => {
    setUpdating(true);
    await API.graphql(
      graphqlOperation(customMutations.updateClassStudent, {
        input: {id: studentId, group},
      })
    );
    setClassStudents((prevStudent) =>
      prevStudent.map((student) =>
        student.id === studentId ? {...student, group} : student
      )
    );
    setStudentIdToEdit('');
    setUpdating(false);
  };

  const onDelete = (id: any) => {
    const onDrop = async () => {
      setDeleting(true);
      await API.graphql(
        graphqlOperation(customMutations.deleteClassStudent, {
          input: {id},
        })
      );
      const deletedStudentData = classStudents.find((item) => item.id === id);
      setStudents((prevStudent) => [
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
          authId: deletedStudentData.studentAuthID || '',
        },
      ]);
      setClassStudents((prevStudents) => prevStudents.filter((item) => item.id !== id));
      closeDeleteModal();
      setDeleting(false);
    };
    setWarnModal2({
      show: true,
      message: `Are you sure you want to remove this student from class?`,
      action: onDrop,
    });
  };

  useEffect(() => {
    const classId = urlParams.get('id');
    if (classId) fetchClassData(classId);
    else history.push('/dashboard/manage-institutions');
    // try {
    //   console.log('Here.......')
    //   const input = { classStudents: [{
    //     classID: "97323010-05d0-4278-ac15-7343e1b58f0d",
    //     status: "Active",
    //     studentAuthID: "e02c63b2-6dca-4d37-a9ea-006e53c04769",
    //     studentEmail: "aman+1@sublimedatasys.com",
    //     studentID: "b3fe0840-6a1e-4d72-b34e-f2c585804fa3"
    //   },
    //   {
    //     classID: "97323010-05d0-4278-ac15-7343e1b58f0d",
    //     status: "Active",
    //     studentAuthID: "78c518a8-0413-409c-b613-cb087446abe7",
    //     studentEmail: "brandi@zoiq.io",
    //     studentID: "8ed85558-389a-4203-8a0e-fb061e519dac",
    //   }] };
    //   API.graphql(graphqlOperation(mutations.batchAddClassStudent, input));
    // } catch (err) {
    //   console.log('ERRRRROR', err);
    // }
  }, []);

  const checkUniqClassName = async () => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(queries.listClasss, {
          filter: {
            institutionID: {eq: classData.institute.id},
            name: {eq: classData.name},
          },
        })
      );
      return list.data.listClasss.items.length === 0 ? true : false;
    } catch {
      setMessages({
        show: true,
        message: dictionary.messages.processerror,
        isError: true,
      });
    }
  };

  const validateForm = async () => {
    if (classData.name.trim() === '') {
      setMessages({
        show: true,
        message: dictionary.messages.classrequired,
        isError: true,
      });
      return false;
    } else if (classData.institute.id === '') {
      setMessages({
        show: true,
        message: dictionary.messages.selectinstitute,
        isError: true,
      });
      return false;
    } else if (classData.name.trim() !== '' && previousName !== classData.name) {
      const isUniq = await checkUniqClassName();
      if (!isUniq) {
        setMessages({
          show: true,
          message: dictionary.messages.classexist,
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

  const saveClassDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        const input = {
          id: classData.id,
          name: classData.name,
          institutionID: classData.institute.id,
        };
        const newClass: any = await API.graphql(
          graphqlOperation(mutations.updateClass, {input: input})
        );
        setMessages({
          show: true,
          message: dictionary.messages.classupdate,
          isError: false,
        });
      } catch {
        setMessages({
          show: true,
          message: dictionary.messages.unableupdate,
          isError: true,
        });
      }
    }
  };

  const goBack = () => {
    if (unsavedChanges) {
      setWarnModal({
        show: true,
        profile: false,
        profileId: '',
        goBack: true,
        message: 'Do you want to save changes before going back?',
      });
    } else {
      goBackBreadCrumb(breadCrumsList, history);
    }
  };

  const movetoStudentProfile = (profileID: string) => {
    if (unsavedChanges) {
      setWarnModal({
        show: true,
        profile: true,
        profileId: profileID,
        goBack: false,
        message: 'Do you want to save changes before leaving the page?',
      });
    } else {
      gotoProfileInfo(profileID);
    }
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

  const onGroupChange = (_: string, name: string) => {
    setNewMember((prevValues) => ({
      ...prevValues,
      group: name,
    }));
  };

  const closeDeleteModal = () => {
    setWarnModal2({...warnModal2, show: false});
  };

  return (
    <div className="">
      <BreadCrums items={breadCrumsList} />

      <div className="flex justify-between">
        <SectionTitle title={dictionary.TITLE} subtitle={dictionary.SUBTITLE} />
        {/* <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons
            btnClass=""
            label="Go Back"
            onClick={goBack}
            Icon={IoArrowUndoCircleOutline}
          />
        </div> */}
      </div>

      <PageWrapper>
        <div className="w-8/10 2xl:w-6/10 px-2 m-auto mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">
            {dictionary.heading}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="col-span-4">
              <FormInput
                value={classData.name}
                id="className"
                onChange={onNameChange}
                name="className"
                label={dictionary.NAME_INPUT_LABEL}
                isRequired
              />
            </div>
            <Buttons
              btnClass="mx-2 lg:ml-5 lg:mr-10 py-1 mt-auto"
              label="Save"
              onClick={saveClassDetails}
              transparent={!unsavedChanges}
              disabled={!unsavedChanges}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-8/10 2xl:w-6/10 m-auto px-2 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1 leading-5 text-gray-700">
                Add students to class
              </label>
              <div className="flex items-center justify-between">
                <SearchSelectorWithAvatar
                  selectedItem={newMember}
                  list={searching ? filteredStudents : students}
                  placeholder={dictionary.ADD_STUDENT_PLACEHOLDER}
                  onChange={onStudentSelect}
                  fetchStudentList={fetchStudentList}
                  clearFilteredStudents={clearFilteredStudents}
                  searchStatus={searching}
                  searchCallback={setSearching}
                  imageFromS3={false}
                  creatable
                  creatableLabel={'Add students from register to class'}
                  onCreate={() => history.push('/dashboard/registration')}
                />
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1 leading-5 text-gray-700">
                {dictionary.GROUP}
              </label>
              <div className="flex items-center justify-between">
                <Selector
                  selectedItem={newMember?.group}
                  list={groupOptions}
                  placeholder={dictionary.GROUP_PLACEHOLDER}
                  onChange={onGroupChange}
                  disabled={!newMember?.id}
                />
              </div>
            </div>
            <AddButton
              className="mx-2 lg:ml-5 lg:mr-10 py-1 px-5 mt-auto"
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
            {!loading ? (
              classStudents.length ? (
                <Fragment>
                  <div className="mt-8 w-full lg:w-9/10 m-auto px-2">
                    <div className="flex justify-between w-full items-center px-4 2xl:px-8 py-4 whitespace-nowrap border-b-0 border-gray-200 text-sm text-gray-600">
                      <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                        {dictionary.TABLE.SNO}
                      </div>
                      <div className="flex w-5/10 items-center px-4 py-2">
                        {dictionary.TABLE.NAME}
                      </div>
                      <div className="w-2/10 px-3">{dictionary.TABLE.GROUP}</div>
                      <div className="w-3/10 px-3">{dictionary.TABLE.DATE}</div>
                      <div className="w-1/10 px-3 flex justify-center">
                        {dictionary.TABLE.ACTIONS}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 w-full lg:w-9/10 m-auto pl-2 max-h-88 overflow-y-scroll">
                    {classStudents.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex justify-between w-full items-center px-4 2xl:px-8 py-4 whitespace-nowrap border-b-0 border-gray-200">
                        <div className="flex w-.5/10 items-center px-8 py-3 text-left text-s leading-4">
                          {index + 1}.
                        </div>
                        <div
                          className="flex w-5/10 items-center px-4 py-2 whitespace-normal cursor-pointer"
                          onClick={() => movetoStudentProfile(item.student.id)}>
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
                                  textShadow: '0.1rem 0.1rem 2px #423939b3',
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
                            {/* {item.student.name} */}
                            <div className="hover:text-gray-600 text-sm leading-5 font-medium text-gray-900">
                              {item.student.name}
                            </div>
                            <div className="text-sm leading-5 text-gray-500">
                              {item.student.email}
                            </div>
                          </div>
                        </div>
                        {studentIdToEdit === item.id ? (
                          <div className="w-2/10 mr-6 px-3">
                            <Selector
                              selectedItem={item.group}
                              list={groupOptions}
                              placeholder={dictionary.GROUP_PLACEHOLDER}
                              onChange={(_: string, name: string) =>
                                onGroupEdit(item.id, name)
                              }
                            />
                          </div>
                        ) : (
                          <div
                            className="w-2/10 px-3"
                            onClick={() => setStudentIdToEdit(item.id)}>
                            {item.group || '-'}
                          </div>
                        )}
                        <div className="w-3/10 px-3">
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
                    ))}
                  </div>
                </Fragment>
              ) : (
                <div className="py-12 my-12 m-auto text-center">
                  {dictionary.NOSTUDENT}
                </div>
              )
            ) : (
              <div className="py-12 my-12 m-auto text-center">{dictionary.LOADING}</div>
            )}
            {messages.show && (
              <div className="py-2 m-auto text-center">
                <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
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
          </Fragment>
        ) : null}
      </PageWrapper>
    </div>
  );
};

export default EditClass;
