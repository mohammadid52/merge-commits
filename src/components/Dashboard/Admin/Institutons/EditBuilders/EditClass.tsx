import React, { Fragment, useState, useEffect, useContext } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IoArrowUndoCircleOutline, IoClose } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';

import SelectorWithAvatar from '../../../../Atoms/Form/SelectorWithAvatar';
import SectionTitle from '../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../Atoms/PageWrapper'
import BreadCrums from '../../../../Atoms/BreadCrums';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';

import { stringToHslColor, getInitialsFromString, initials, createFilterToFetchAllItemsExcept } from '../../../../../utilities/strings';
import { getImageFromS3 } from '../../../../../utilities/services';
import { statusList } from '../../../../../utilities/staticData';
import { getAsset } from '../../../../../assets';

import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as queries from '../../../../../graphql/queries';
import * as mutations from '../../../../../graphql/mutations';
import useDictionary from '../../../../../customHooks/dictionary';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import ModalPopUp from '../../../../Molecules/ModalPopUp';

interface EditClassProps { }

const EditClass = (props: EditClassProps) => {
  const history = useHistory();
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const urlParams = useQuery();
  const match = useRouteMatch();

  const initialData = { id: '', name: '', institute: { id: '', name: '', value: '' } }
  const defaultNewMember = { id: '', name: '', value: '', avatar: '' }
  const [classData, setClassData] = useState(initialData)
  const [messages, setMessages] = useState({ show: false, message: '', isError: false });
  const [classStudents, setClassStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [newMember, setNewMember] = useState(defaultNewMember);
  const [statusEdit, setStatusEdit] = useState('');
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [previousName, setPreviousName] = useState('')
  const [warnModal, setWarnModal] = useState({
    show: false,
    profile: false,
    profileId: '',
    goBack: false,
    message: 'Do you want to save changes before moving forward?'
  });

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Edit Class', url: `${match.url}?id=${urlParams.get('id')}`, last: true }
  ];

  const { clientKey, userLanguage, theme } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const { editClassDict } = useDictionary(clientKey);
  const dictionary = editClassDict[userLanguage]

  const gotoProfileInfo = (profileId: string) => {
    history.push(`/dashboard/manage-users/user?id=${profileId}`)
  }

  const fetchClassData = async (classId: string) => {
    try {
      const result: any = await API.graphql(graphqlOperation(customQueries.getClassDetails, { id: classId }))
      const classData = result.data.getClass;
      setClassData({
        ...classData,
        id: classData.id,
        name: classData.name,
        institute: {
          id: classData.institution.id,
          name: classData.institution.name,
          value: classData.institution.name,
        }
      })
      const selectedStudentsIds: any = []
      const selectedStudents = classData.students.items.map((stu: any) => {
        selectedStudentsIds.push(stu.student.id)
        return {
          id: stu.id,
          status: stu.status,
          student: { ...stu.student, email: stu.studentEmail, name: `${stu.student.firstName || ''} ${stu.student.lastName || ''}` }
        }
      })
      let students: any = await API.graphql(graphqlOperation(customQueries.listPersons, {
        filter: {
          role: { eq: 'ST' },
          status: { eq: 'ACTIVE' },
          ...createFilterToFetchAllItemsExcept(selectedStudentsIds, 'id')
        },
      }));
      students = students.data.listPersons.items;
      students = students.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.firstName || ''} ${item.lastName || ''}`,
        value: `${item.firstName || ''} ${item.lastName || ''}`,
        avatar: item.image ? getImageFromS3(item.image) : '',
        status: item.status || 'Inactive',
        email: item.email || '',
        authId: item.authId || ''
      }));
      setClassStudents(selectedStudents)
      setStudents(students)
      setLoading(false)
    } catch (err) {
      console.log('err', err)
      setLoading(false)
      setMessages({
        show: true,
        message: 'Error while fetching class data,please try again later.',
        isError: true
      })
    }
  }

  const onNameChange = (e: any) => {
    setClassData({
      ...classData,
      name: e.target.value
    });
    setUnsavedChanges(true);
    if (messages.show) {
      setMessages({ show: false, message: '', isError: false })
    }
  }

  const onStudentSelect = (str: string, name: string, id: string, avatar: string) => {
    setNewMember({
      id: id,
      name: name,
      value: str,
      avatar: avatar
    })
  }

  const addStudentInClass = () => {
    if (newMember.id) {
      const { id, name, avatar } = newMember;
      saveClassStudent(id, classData.id);
      setNewMember(defaultNewMember);
    }
  }

  const saveClassStudent = async (id: string, classId: string) => {
    try {
      const selected = students.find((item: any) => item.id === id)
      const input = {
        classID: classId,
        studentID: id,
        studentAuthID: selected.authId,
        studentEmail: selected.email,
        status: 'Active',
      };
      let newStudent: any = await API.graphql(graphqlOperation(customMutations.createClassStudent, { input: input }));
      newStudent = newStudent.data.createClassStudent;
      setClassStudents([...classStudents,
      {
        id: newStudent.id, status: newStudent.status, student: { ...selected }
      }])
    } catch (err) {
      console.log('saveClassStudent', err)
      setMessages({
        show: true,
        message: 'Error while adding stuent, please try again later',
        isError: true
      })
    }
  }

  const onClassStudentStatusChange = async (val: string, name: string, id: string, studentId: string) => {
    setUpdateStatus(true)
    await API.graphql(graphqlOperation(customMutations.updateClassStudent, { input: { id: studentId, status: val } }));
    const updatedSudents = classStudents.map(stu => {
      if (stu.id === studentId) {
        stu.status = val
      }
      return stu
    })
    setClassStudents(updatedSudents);
    setStatusEdit('');
    setUpdateStatus(false)
  }

  useEffect(() => {
    const classId = urlParams.get('id')
    if (classId) fetchClassData(classId);
    else history.push('/dashboard/manage-institutions')
  }, [])

  const checkUniqClassName = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listClasss, {
        filter: {
          institutionID: { eq: classData.institute.id },
          name: { eq: classData.name }
        }
      }))
      return list.data.listClasss.items.length === 0 ? true : false;

    } catch {
      setMessages({
        show: true,
        message: 'Error while processing please Try again later.',
        isError: true
      })
    }
  }

  const validateForm = async () => {
    if (classData.name.trim() === '') {
      setMessages({
        show: true,
        message: 'Class name is required please enter.',
        isError: true
      })
      return false;
    } else if (classData.institute.id === '') {
      setMessages({
        show: true,
        message: 'Please select an institute to add class.',
        isError: true
      })
      return false;
    } else if (classData.name.trim() !== '' && previousName !== classData.name) {
      const isUniq = await checkUniqClassName()
      if (!isUniq) {
        setMessages({
          show: true,
          message: 'This class name is already exist, please add another name.',
          isError: true
        })
        return false;
      } else {
        return true
      }
    } else {
      return true
    }
  }

  const saveClassDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
      try {
        const input = {
          id: classData.id,
          name: classData.name,
          institutionID: classData.institute.id,
        }
        const newClass: any = await API.graphql(graphqlOperation(mutations.updateClass, { input: input }));
        setMessages({
          show: true,
          message: 'Class details has been updated.',
          isError: false
        })
      } catch {
        setMessages({
          show: true,
          message: 'Unable to update class details. Please try again later.',
          isError: true
        })
      }
    }
  }

  const goBack = () => {
    if (unsavedChanges) {
      setWarnModal({
        show: true,
        profile: false,
        profileId: '',
        goBack: true,
        message: 'Do you want to save changes before going back?'
      })
    } else {
      history.goBack();
    }
  }

  const movetoStudentProfile = (profileID: string) => {
    if (unsavedChanges) {
      setWarnModal({
        show: true,
        profile: true,
        profileId: profileID,
        goBack: false,
        message: 'Do you want to save changes before leaving the page?'
      })
    } else {
      gotoProfileInfo(profileID)
    }
  }

  const DiscardChanges = () => {
    if (warnModal.goBack) {
      history.goBack()
    } else if (warnModal.profile) {
      gotoProfileInfo(warnModal.profileId);
    }
  }

  const saveAndMove = async () => {
    if (warnModal.goBack) {
      await saveClassDetails();
      history.goBack()
    } else if (warnModal.profile) {
      await saveClassDetails();
      gotoProfileInfo(warnModal.profileId);
    }
  }

  return (
    <div className="w-8/10 h-full mt-4 p-4">

      <BreadCrums items={breadCrumsList} />

      <div className="flex justify-between">
        <SectionTitle title={dictionary.TITLE} subtitle={dictionary.SUBTITLE} />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="" label="Go Back" onClick={goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      <PageWrapper>
        <div className="w-6/10 px-2 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">CLASS INFORMATION</h3>
          <div className="">
            <div className="flex items-center">
              <div>
                <FormInput value={classData.name} id='className' onChange={onNameChange} name='className' label={dictionary.NAME_INPUT_LABEL} isRequired />
              </div>
              <Buttons btnClass="ml-4 py-1 mt-auto" label="Save" onClick={saveClassDetails} transparent={!unsavedChanges} disabled={!unsavedChanges} />
            </div>
          </div>
        </div>

        <h3 className="text-center text-lg text-gray-600 font-medium mt-12 mb-6">STUDENTS</h3>

        <div className="flex items-center w-6/10 m-auto px-2">
          <div>
            <label className="block text-xs font-semibold mb-1  leading-5 text-gray-700">
              Add students to class
            </label>
            <SelectorWithAvatar selectedItem={newMember} list={students} placeholder={dictionary.ADD_STUDENT_PLACEHOLDER} onChange={onStudentSelect} />
          </div>
          <Buttons btnClass="ml-4 py-1" label={dictionary.ADD_STUDENT_BUTTON} onClick={addStudentInClass} />
        </div>

        {classStudents ? (

          <Fragment>
            {!loading ?
              (classStudents.length ?
                (
                  <Fragment>
                    <div className="mt-8 w-9/10 m-auto px-2">
                      <div className="flex justify-between w-full items-center px-8 py-4 whitespace-no-wrap border-b border-gray-200 text-sm text-gray-600">
                        <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{dictionary.TABLE.SNO}</div>
                        <div className="flex w-5/10 items-center px-4 py-2">{dictionary.TABLE.NAME}</div>
                        <div className="w-3/10">{dictionary.TABLE.STATUS}</div>
                        <div className="w-1/10">{dictionary.TABLE.ACTIONS}</div>
                      </div>
                    </div>

                    <div className="mb-4 w-9/10 m-auto px-2 max-h-88 overflow-y-scroll">
                      {
                        classStudents.map((item, index) => (
                          <div key={item.id} className="flex justify-between w-full items-center px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                            <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                            <div className="flex w-5/10 items-center px-4 py-2 whitespace-normal cursor-pointer" onClick={() => movetoStudentProfile(item.student.id)}>
                              <div className="flex-shrink-0 h-10 w-10 flex items-center">
                                {item.student.avatar ?
                                  (<img
                                    src={item.student.avatar}
                                    className="h-8 w-8 rounded-full" />) :
                                  <div className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold" style={{ background: `${stringToHslColor(getInitialsFromString(item.student.name)[0] + ' ' + getInitialsFromString(item.student.name)[1])}`, textShadow: '0.1rem 0.1rem 2px #423939b3' }} >
                                    {item.student.name ? initials(getInitialsFromString(item.student.name)[0], getInitialsFromString(item.student.name)[1]) : initials('N', 'A')}
                                  </div>}
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

                            {
                              statusEdit === item.id ? (
                                <div className="w-3/10 mr-6 px-3">
                                  <Selector selectedItem={item.status} placeholder="Select Status" list={statusList} onChange={(val, name, id) => onClassStudentStatusChange(val, name, id, item.id)} />
                                </div>) :
                                <div className="w-3/10 px-3">
                                  {item.status || 'Active'}
                                </div>
                            }

                            <div className="w-1/10 px-3">
                              {statusEdit === item.id ?
                                <span className={`w-6 h-6 flex items-center cursor-pointer ${theme.textColor[themeColor]}`} onClick={() => setStatusEdit('')}>{updateStatus ? 'updating...' : 'Cancel'}</span>
                                :
                                <span className={`w-6 h-6 flex items-center cursor-pointer ${theme.textColor[themeColor]}`} onClick={() => setStatusEdit(item.id)}>
                                  Edit
                                </span>
                              }
                            </div>
                          </div>)
                        )}
                    </div>
                  </Fragment>
                )
                : (<div className="py-12 my-12 m-auto text-center">No students added in the class.</div>)
              )
              : <div className="py-12 my-12 m-auto text-center">Loading class students list...</div>
            }
            {messages.show && (
              <div className="py-2 m-auto text-center">
                <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>{messages.message && messages.message}</p>
              </div>)
            }
            {
              warnModal.show && <ModalPopUp closeAction={DiscardChanges} saveAction={saveAndMove} saveLabel='SAVE' cancelLabel='DISCARD' message={warnModal.message} />
            }
          </Fragment>
        ) : null}
      </PageWrapper>
    </div >
  )
}

export default EditClass
