import {API, graphqlOperation} from 'aws-amplify';
import {Fragment, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import {getImageFromS3} from 'utilities/services';

import {PlusCircleOutlined} from '@ant-design/icons';
import Buttons from '@components/Atoms/Buttons';
import Filters, {SortType} from '@components/Atoms/Filters';
import Selector from '@components/Atoms/Form/Selector';
import Placeholder from '@components/Atoms/Placeholder';
import {SEARCH_LIMIT} from '@components/Lesson/constants';
import StudentName from '@components/MicroComponents/StudentName';
import UserLookupLocation from '@components/MicroComponents/UserLookupLocation';
import Table, {ITableProps} from '@components/Molecules/Table';
import {useNotifications} from '@contexts/NotificationContext';
import useSearch from '@customHooks/useSearch';
import {getLocalStorageData} from '@utilities/localStorage';
import {Card, Divider, Tooltip} from 'antd';
import {PersonStatus, Role} from 'API';
import Modal from 'atoms/Modal';
import Registration from 'components/Dashboard/Admin/UserManagement/Registration';
import User from 'components/Dashboard/Admin/UserManagement/User';
import {useGlobalContext} from 'contexts/GlobalContext';
import {
  createClassStudent,
  createClassroomGroupStudents
} from 'customGraphql/customMutations';
import {
  listClassStudentsForRoom,
  fetchPersons,
  listClassroomGroupssOptions
} from 'customGraphql/customQueries';
import useDictionary from 'customHooks/dictionary';
import useAuth from 'customHooks/useAuth';
import {updateClass} from 'graphql/mutations';
import PageLayout from 'layout/PageLayout';
import {map} from 'lodash';
import ModalPopUp from 'molecules/ModalPopUp';
import {addName, sortByName} from '../../UserManagement/UserLookup';
import {Status} from '../../UserManagement/UserStatus';
import LocationBadge from './LocationBadge';
import ErrorBoundary from '@components/Error/ErrorBoundary';

interface EditClassProps {
  instId: string;
  classId: string;
  toggleUpdateState?: () => void;
  roomData: any;
}

const {Meta} = Card;

const EditClass = ({instId, classId, roomData, toggleUpdateState}: EditClassProps) => {
  const history = useHistory();
  const classData = {
    id: '',
    name: '',
    institute: {id: '', name: '', value: ''}
  };
  const defaultNewMember = {
    id: '',
    label: '',
    value: '',
    avatar: '',
    group: {id: '', name: ''}
  };

  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });
  const [addMessage, setAddMessage] = useState({message: '', isError: false});
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);

  const [userModalOpen, setUserModalFormOpen] = useState<boolean>(false);

  const [studentProfileID, setStudentProfileID] = useState('');
  const [newMember, setNewMember] = useState(defaultNewMember);

  const [_2, setGroups] = useState<any[]>([]);
  const [_3, setSaving] = useState<boolean>(false);

  const [deleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [_4, setAdding] = useState(false);

  const [warnModal] = useState({
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
    userLanguage,
    state: {user}
  } = useGlobalContext();

  const {isAdmin, isBuilder, isSuperAdmin} = useAuth();

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
    nextToken?: string,
    outArray = []
  ): Promise<any> => {
    let combined: any[];
    try {
      const result: any = await API.graphql(
        graphqlOperation(listClassStudentsForRoom, {
          limit: SEARCH_LIMIT,
          ...filter,
          nextToken: nextToken
        })
      );

      let returnedData = result.data.listClassStudents?.items;

      combined = [...outArray, ...returnedData];

      return combined;
    } catch (error) {
      console.error(
        '🚀 ~ file: AnalyticsDashboard.tsx ~ line 24 ~ listAllStudents ~ error',
        error
      );
    }
  };

  const recursiveFetchAllStudents = async (outArray: any[], nextToken: string | null) => {
    try {
      let combined: any[] = [];
      let studentsFromAPI: any = await API.graphql(
        graphqlOperation(fetchPersons, {
          limit: SEARCH_LIMIT,
          filter: {
            role: {eq: Role.ST},
            or: [
              {status: {eq: PersonStatus.ACTIVE}},
              {status: {eq: PersonStatus.TRAINING}}
            ]
            // ...createFilterToFetchAllItemsExcept(neqList, 'id')
          },
          nextToken
        })
      );

      let studentsData = studentsFromAPI.data.listPeople.items;

      combined = [...studentsData, ...outArray];

      return combined;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchClassData = async (classId: string) => {
    setClassStudentsLoading(true);
    try {
      const classFilter = {
        filter: {
          classID: {
            eq: classId
          }
        }
      };

      const result = await getAllClassStudentByClassId(classFilter, undefined, []);

      const selectedStudents = result?.map((stu: any) => {
        return {
          id: stu.id,
          group: {name: stu.group, id: ''},
          status: stu.status,
          createAt: stu.createdAt,
          studentAuthID: stu.studentAuthID,
          name: `${stu?.student?.firstName || ''} ${stu?.student?.lastName || ''}`,
          student: {
            ...stu.student,
            email: stu?.studentEmail,
            name: `${stu?.student?.firstName || ''} ${stu?.student?.lastName || ''}`,
            avatar: stu?.student?.image ? getImageFromS3(stu?.student?.image) : ''
          }
        };
      });

      let students: any = await recursiveFetchAllStudents([], null);

      students = students.map((item: any) => ({
        id: item?.id,
        name: `${item?.firstName || ''} ${item?.lastName || ''}`,
        value: `${item?.firstName || ''} ${item?.lastName || ''}`,
        avatar: item?.image ? getImageFromS3(item?.image) : '',
        status: item?.status || 'Inactive',
        email: item?.email || '',
        authId: item?.authId || '',
        firstName: item?.firstName || '',
        lastName: item?.lastName || ''
      }));
      await getClassRoomGroups(roomData.id || room.id);
      setClassStudents(sortStudents(selectedStudents));
      setAllStudents(sortStudents(students));
    } catch (err) {
      console.error('err', err);

      setMessages({
        show: true,
        message: dictionary.messages.errorfetch,
        isError: true
      });
    } finally {
      setClassStudentsLoading(false);
      setLoading(false);
    }
  };

  const sortStudents = (studentList: any) => {
    return studentList.sort((personA: any, personB: any) =>
      personA.name[0] < personB.name[0] ? -1 : 1
    );
  };

  const room = getLocalStorageData('room_info');
  const withbackupClassId = classId;

  const [classStudentsLoading, setClassStudentsLoading] = useState(false);

  const getClassRoomGroups = async (roomId: string) => {
    try {
      const list: any = await API.graphql(
        graphqlOperation(listClassroomGroupssOptions, {
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

  const onStudentSelect = (_: string, option: any) => {
    setNewMember({
      ...option,
      group: {id: '', name: ''}
    });
    if (addMessage.message) {
      setAddMessage({
        message: '',
        isError: false
      });
    }
    setAddStudentModal(true);
  };

  const [addStudentModal, setAddStudentModal] = useState(false);

  const addStudentInClass = async () => {
    if (newMember.id) {
      setAddStudentModal(false);
      const {id} = newMember;
      await saveClassStudent(id);
      setNewMember(defaultNewMember);
    }
  };

  const {setNotification} = useNotifications();

  const saveClassStudent = async (id: string) => {
    try {
      setAdding(true);
      const selected = allStudents.find((item: any) => item.id === id);
      const input = {
        classID: withbackupClassId,
        group: newMember.group,
        studentID: id,
        studentAuthID: selected.authId,
        studentEmail: selected.email,
        status: PersonStatus.ACTIVE
      };
      let newStudent: any = await API.graphql(
        graphqlOperation(createClassStudent, {input: input})
      );
      newStudent = newStudent.data.createClassStudent;
      if (newMember.group?.id) {
        await API.graphql(
          graphqlOperation(createClassroomGroupStudents, {
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

        student: {
          ...selected,
          onDemand: Boolean(newStudent?.student?.onDemand)
        }
      };

      classStudents.push(updatedStudent);

      setClassStudents([...classStudents]);

      setAdding(false);

      setNotification({
        title: `Student added successfully - ${newStudent.studentEmail}`,
        show: true,
        type: 'success'
      });
    } catch (err) {
      console.error('saveClassStudent', err);
      setNotification({
        title: `Something went wrong`,
        type: 'error',
        show: true
      });
      setAddMessage({
        message: dictionary.messages.errorstudentadd,
        isError: true
      });
    }
  };

  useEffect(() => {
    if (withbackupClassId) {
      fetchClassData(withbackupClassId);
    } else {
      console.log('class id not found');
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [withbackupClassId]);

  const validateForm = () => {
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
        await API.graphql(graphqlOperation(updateClass, {input: input}));
        toggleUpdateState?.();
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
    fetchClassData(withbackupClassId);
  };

  const discardChanges = () => {
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

  const [filters, setFilters] = useState<SortType | null>(null);
  const [filteredList, setFilteredList] = useState([...classStudents]);

  const {setSearchInput, searchInput} = useSearch(classStudents, ['name']);

  const updateFilter = (filterName: SortType) => {
    if (filterName === filters) {
      setSearchInput({...searchInput, isActive: false});
      setFilters(null);
      setFilteredList([]);
    } else {
      setSearchInput({...searchInput, isActive: true});
      const filtered = classStudents.filter(
        (_d: any) => filterName === _d?.student?.status
      );

      setFilteredList(filtered);
      setFilters(filterName);
    }
  };

  const finalList = searchInput.isActive ? filteredList : classStudents;

  const dataList = map(sortByName(addName(finalList)), (item: any, index: number) => ({
    no: index + 1,
    onClick: () => {
      user.role !== 'BLD' && setStudentProfileID(item.student.id);
      user.role !== 'BLD' && setUserModalFormOpen(true);
    },
    participantName: <StudentName item={item} user={user} />,

    status: <Status useDefault status={item?.student?.status} />,
    location: <UserLookupLocation item={item} idx={index} />,
    type: <LocationBadge onDemand={item?.student?.onDemand} />,
    dateAdded: item.createAt ? new Date(item.createAt).toLocaleDateString() : '--'
    // actions: (
    //   <CommonActionsBtns
    //     button1Action={() => {
    //       user.role !== 'BLD' && setStudentProfileID(item.student.id);
    //       user.role !== 'BLD' && setUserModalFormOpen(true);
    //       user.role !== 'BLD' && setStudentIdToEdit(item.id);
    //     }}
    //     button2Action={() => onDelete(item.id)}
    //   />
    // )
  }));

  const dict = dictionary.TABLE;

  const tableConfig: ITableProps = {
    headers: [
      dict['SNO'],
      dict['NAME'],
      dict['TYPE'],
      dict['STATUS'],
      dict['LOCATION'],
      dict['DATE']
      // dict['ACTIONS']
    ],
    dataList,
    config: {
      dataList: {
        loading: classStudentsLoading || loading
      }
    }
  };

  /**
   * Takes allStudents and classStudents arrays and returns a new array of students, with a new `disabled` property added.
   *
   * @returns {Array} - An array of student objects. Each object has an added 'disabled' property which is a boolean indicating whether or not the student is already in the classStudents array.
   */

  const addDisablePropertyToAlreadySelectedStudents = (): Array<any> => {
    if (
      allStudents && // check if allStudents is not null
      classStudents && // check if classStudents is not null
      allStudents.length > 0 && // check if allStudents is not empty
      classStudents.length > 0 // check if classStudents is not empty
    ) {
      const isStudentAlreadyAdded = (student: any) =>
        classStudents.find(
          (classStudent) => classStudent.student.authId === student.authId
        );
      return allStudents.map((student) => {
        const disabled = Boolean(isStudentAlreadyAdded(student));
        const label = `${student.firstName} ${student.lastName}`;
        return {
          ...student,
          disabled,
          value: (
            <Tooltip title={disabled ? 'Already in class' : ''}>
              <Meta
                className={`flex ${
                  disabled ? 'opacity-50 pointer-events-none' : ''
                } items-center`}
                title={label}
                description={student?.email}
                avatar={
                  <Placeholder size="h-8 w-8 mr-2" image={student?.image} name={label} />
                }
              />
            </Tooltip>
          )
        };
      });
    } else {
      return [];
    }
  };

  return (
    <ErrorBoundary componentName="EditClass">
      <div className="">
        <Modal
          open={addStudentModal}
          saveAction={addStudentInClass}
          closeAction={() => {
            setAddStudentModal(false);
            setNewMember(defaultNewMember);
          }}
          showHeader={false}
          showFooter={false}>
          <p>Do you want to add {newMember.label}?</p>
          <div className="w-full flex items-center justify-end gap-4 mt-2">
            <Buttons
              label={'Cancel'}
              transparent
              onClick={() => {
                setAddStudentModal(false);
                setNewMember(defaultNewMember);
              }}
            />
            <Buttons label={'Add'} onClick={addStudentInClass} />
          </div>
        </Modal>

        <PageLayout
          type="inner"
          title={roomData.name}
          extra={
            <div className={`w-auto flex gap-x-4 justify-end items-center`}>
              <Selector
                width={400}
                dataCy="edit-class"
                selectedItem={newMember.label}
                showSearch
                optionFilterProp="name"
                disabled={classStudentsLoading || loading}
                list={addDisablePropertyToAlreadySelectedStudents()}
                placeholder={dictionary.ADD_STUDENT_PLACEHOLDER}
                onChange={onStudentSelect}
                size="middle"
                dropdownRender={(menu) => {
                  return (
                    <>
                      {menu}
                      <Divider style={{margin: '8px 0'}} />
                      <Buttons
                        onClick={() => setShowRegistrationForm(true)}
                        label={'Register a new student to this classroom'}
                        className="w-full"
                        size="middle"
                        Icon={PlusCircleOutlined}
                        variant="dashed"
                      />
                    </>
                  );
                }}
              />
            </div>
          }>
          <Filters
            list={classStudents}
            loading={loading}
            updateFilter={updateFilter}
            filters={filters}
          />

          <div className="">
            {addMessage?.message && (
              <div className="flex flex-col items-center justify-center m-auto px-4 mb-4">
                <div className="py-2">
                  <p
                    className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>
                    {addMessage?.message}
                  </p>
                </div>
              </div>
            )}
            {finalList ? (
              <Fragment>
                <Table {...tableConfig} />
                {messages.show && (
                  <div className="py-2 m-auto text-center">
                    <p
                      className={`${
                        messages.isError ? 'text-red-600' : 'text-green-600'
                      }`}>
                      {messages.message ? messages.message : ''}
                    </p>
                  </div>
                )}

                <ModalPopUp
                  open={warnModal.show}
                  closeAction={discardChanges}
                  saveAction={saveAndMove}
                  saveLabel="SAVE"
                  cancelLabel="DISCARD"
                  message={warnModal.message}
                />

                <ModalPopUp
                  open={warnModal2.show}
                  dataCy="edit-class-delete-student-modal"
                  closeAction={closeDeleteModal}
                  saveAction={warnModal2.action}
                  saveLabel="Yes"
                  message={warnModal2.message}
                  loading={deleting}
                />

                <Modal
                  open={showRegistrationForm}
                  showHeader={true}
                  title={RegistrationDict[userLanguage]['title']}
                  showHeaderBorder={true}
                  showFooter={false}
                  closeAction={() => setShowRegistrationForm(false)}>
                  <Registration
                    classData={{
                      classId: withbackupClassId,
                      roomId: roomData.id
                    }}
                    isInInstitute
                    isInModalPopup
                    postMutation={postMutation}
                    instId={instId}
                  />
                </Modal>

                <Modal
                  open={userModalOpen}
                  title={UserDict[userLanguage]['title']}
                  showHeader={true}
                  showHeaderBorder={false}
                  showFooter={false}
                  scrollHidden={true}
                  width={1000}
                  closeAction={() => setUserModalFormOpen(false)}>
                  <User
                    shouldNavigate={false}
                    onSuccessCallback={() => setUserModalFormOpen(false)}
                    instituteId={instId}
                    userId={studentProfileID}
                    insideModalPopUp={true}
                  />
                </Modal>
              </Fragment>
            ) : null}
          </div>
        </PageLayout>
      </div>
    </ErrorBoundary>
  );
};

export default EditClass;
