import React, { Fragment, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IoArrowUndoCircleOutline, IoClose } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';

import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as queries from '../../../../../graphql/queries';
import * as mutations from '../../../../../graphql/mutations';
import SectionTitle from '../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../Atoms/PageWrapper'
import BreadCrums from '../../../../Atoms/BreadCrums';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import { IconContext } from 'react-icons';
import { stringToHslColor, getInitialsFromString, initials } from '../../../../../utilities/strings';
import SelectorWithAvatar from '../../../../Atoms/Form/SelectorWithAvatar';
import { getImageFromS3 } from '../../../../../utilities/services';

interface EditClassProps {

}

const EditClass = (props: EditClassProps) => {
  const { } = props;
  const history = useHistory();
  const location = useLocation();
  const initialData = {
    id: '',
    name: '',
    institute: {
      id: '',
      name: '',
      value: ''
    }
  }
  const [classData, setClassData] = useState(initialData)
  const [newMember, setNewMember] = useState({
    name: '',
    id: '',
    value: '',
    avatar: ''
  });
  const [studentList, setStudentList] = useState([]);
  const [institutionList, setInstitutionList] = useState([]);
  const [selectedStudents, setSelectedStudent] = useState([]);
  const [allStudentList, setAllStudentList] = useState([]);
  const [prevStdList, setPrevStdList] = useState([]);
  const [previousName, setPreviousName] = useState('')
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  });
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Edit Class', url: `/dashboard/class-edit?id=${params.get('id')}`, last: true }
  ];

  const onChange = (e: any) => {
    setClassData({
      ...classData,
      name: e.target.value
    })
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      })
    }
  }

  const setInstitute = (val: string, name: string, id: string) => {
    setClassData({
      ...classData,
      institute: {
        id: id,
        name: name,
        value: val
      }
    })
    if (messages.show) {
      setMessages({
        show: false,
        message: '',
        isError: false
      })
    }
  }

  const getImageURL = async (uniqKey: string) => {
    const imageUrl: any = await getImageFromS3(uniqKey);
    if (imageUrl) {
      console.log(imageUrl)
      return imageUrl
    } else {
      return ''
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

  const addMemberToList = () => {
    if (newMember.id) {
      saveClassStudent(newMember.id, classData.id)
      setSelectedStudent([
        ...selectedStudents,
        {
          name: newMember.name,
          id: newMember.id,
          avatar: newMember.avatar
        }
      ])
      setNewMember({
        id: '',
        name: '',
        value: '',
        avatar: ''
      })
    }
  }

  const removeStudentFromList = (id: string) => {
    const newList = selectedStudents.filter(item => item.id !== id);
    setSelectedStudent(newList)
    removeStudentFromClass(id);
  }

  const getStudentsList = async () => {
    try {
      // Fetch persons with student role and active status. 
      const list: any = await API.graphql(graphqlOperation(customQueries.listPersons, {
        filter: {
          role: { eq: 'ST' },
          status: { eq: 'ACTIVE' }
        },
      }));
      const sortedList = list.data.listPersons.items.sort((a: any, b: any) => (a.firstName?.toLowerCase() > b.firstName?.toLowerCase()) ? 1 : -1);
      const personsList = Promise.all(sortedList.map(async (item: any, i: any) => ({
        id: item.id,
        name: `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`,
        value: `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`,
        avatar: item.image ? await getImageURL(item.image) : '',
        email: item.email ? item.email : '',
        authId: item.authId ? item.authId : ''
      })));
      personsList.then(res => {
        setAllStudentList(res)
        setStudentList(res);
      })
    } catch{
      setMessages({
        show: true,
        message: 'Error while fetching student list, Please try again later.',
        isError: true
      })
    }

  }

  const getInstitutionList = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listInstitutions));
      const sortedList = list.data.listInstitutions?.items.sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1);
      const InstituteList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.name ? item.name : ''}`,
        value: `${item.name ? item.name : ''}`
      }));
      setInstitutionList(InstituteList);
    } catch {
      setMessages({
        show: true,
        message: 'Error while fetching institution list, Please try again later.',
        isError: true
      })
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
      } catch{
        setMessages({
          show: true,
          message: 'Unable to update class details. Please try again later.',
          isError: true
        })
      }
    }
  }

  const saveClassStudent = async (id: string, classId: string) => {
    try {
      const authID = allStudentList.find((item: any) => item.id === id).authId;
      const stdEmail = allStudentList.find((item: any) => item.id === id).email;
      const input = {
        studentAuthID: authID,
        classID: classId,
        studentID: id,
        studentEmail: stdEmail
      };
      const students: any = await API.graphql(graphqlOperation(customMutations.createClassStudent, { input: input }));
      const newEntry = students.data.createClassStudent;
      setPrevStdList([
        ...prevStdList,
        newEntry
      ]);
    } catch{
      setMessages({
        show: true,
        message: 'Error while adding stuent, please try again later',
        isError: true
      })
    }
  }

  const removeStudentFromClass = async (stdId: string) => {
    try {
      const uniqID = prevStdList.find(item => item.studentID === stdId).id;
      const input = {
        id: uniqID
      };
      const students: any = await API.graphql(graphqlOperation(mutations.deleteClassStudent, { input: input }));
    } catch{
      setMessages({
        show: true,
        message: 'Error while deleting stuents from class, please try again later',
        isError: true
      })
    }
  }

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

  const fetchClassData = async () => {
    const classId = params.get('id')
    if (classId) {
      try {
        const result: any = await API.graphql(graphqlOperation(queries.getClass, { id: classId }))
        const savedclassData = result.data.getClass;
        setClassData({
          ...classData,
          id: savedclassData.id,
          name: savedclassData.name,
          institute: {
            id: savedclassData.institution.id,
            name: savedclassData.institution.name,
            value: savedclassData.institution.name,
          }
        })
        setPrevStdList(savedclassData.students.items);
        setPreviousName(savedclassData.name);
        getInstitutionList();
        getStudentsList();
      } catch {
        setMessages({
          show: true,
          message: 'Error while fetching class data,please try again later.',
          isError: true
        })
      }
    } else {
      history.push('/dashboard/manage-institutions')
    }
  }

  useEffect(() => {
    fetchClassData();
  }, [])

  useEffect(() => {
    const previousList = [...allStudentList]
    const newList = previousList.filter(item => !selectedStudents.some(std => std.id === item.id));
    setStudentList(newList)
  }, [selectedStudents])

  useEffect(() => {
    console.log("++++++++");
    console.log(allStudentList.length, prevStdList.length)
    console.log("++++++++");
    const prevSelectedStudents = allStudentList.filter(item => prevStdList.some(std => std.studentID === item.id)).map(data => ({
      name: data.name,
      id: data.id,
      avatar: data.avatar,
    }))
    setSelectedStudent([
      ...selectedStudents,
      ...prevSelectedStudents
    ])
  }, [allStudentList])

  const { name, institute } = classData;

  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Edit Class" subtitle="Edit class information" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">CLASS INFORMATION</h3>
          <div className="">
            <div className="px-3 py-4">
              <FormInput value={name} id='className' onChange={onChange} name='className' label="Class Name" isRequired />
            </div>

            {/* 
              **
              * Hide institution drop down since all the things are tied to the 
              * Institute, will add this later if need to add builders saperately.
            */}
            {/* <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Institute <span className="text-red-500"> *</span>
              </label>
              <Selector selectedItem={institute.value} placeholder="Select Institute" list={institutionList} onChange={setInstitute} />
            </div> */}
          </div>
        </div>
        <h3 className="text-center text-lg text-gray-600 font-medium mt-12 mb-6">STUDENTS</h3>
        <div className="flex items-center w-6/10 m-auto px-2">
          <SelectorWithAvatar selectedItem={newMember} list={studentList} placeholder="Add new student" onChange={onStudentSelect} />
          <Buttons btnClass="ml-4 py-1" label="Add" onClick={addMemberToList} />
        </div>
        {selectedStudents.length > 0 && (
          <Fragment>
            <div className="mb-4 mt-8 w-6/10 m-auto px-2 max-h-88 overflow-y-scroll">
              {selectedStudents.map((item, index) =>
                <div key={item.id} className="flex justify-between w-full items-center px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>
                  <div className="flex w-8/10 items-center px-4 py-2">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center">
                      {item.avatar ?
                        (<img
                          src={item.avatar}
                          className="h-8 w-8 rounded-full" />) :
                        <div className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold" style={{ background: `${stringToHslColor(getInitialsFromString(item.name)[0] + ' ' + getInitialsFromString(item.name)[1])}`, textShadow: '0.1rem 0.1rem 2px #423939b3' }} >
                          {item.name ? initials(getInitialsFromString(item.name)[0], getInitialsFromString(item.name)[1]) : initials('N', 'A')}
                        </div>}
                    </div>
                    <div className="ml-4">{item.name}</div>
                  </div>
                  <div className="w-1/10">
                    <span className="w-6 h-6 flex items-center cursor-pointer" onClick={() => removeStudentFromList(item.id)}>
                      <IconContext.Provider value={{ size: '1rem', color: '#000000' }}>
                        <IoClose />
                      </IconContext.Provider>
                    </span>
                  </div>
                </div>)}
            </div>
          </Fragment>
        )}
        {messages.show ? (<div className="py-2 m-auto text-center">
          <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>{messages.message && messages.message}</p>
        </div>) : null}
        <div className="flex my-12 justify-center">
          <Buttons btnClass="my-8 py-3 px-12 text-sm mr-4" label="Cancel" onClick={history.goBack} transparent />
          <Buttons btnClass="my-8 py-3 px-12 text-sm ml-4" label="Save" onClick={saveClassDetails} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default EditClass
