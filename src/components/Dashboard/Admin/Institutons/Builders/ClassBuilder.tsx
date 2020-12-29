import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IoArrowUndoCircleOutline, IoClose } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';
import { v4 as uuidv4 } from 'uuid';

import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as queries from '../../../../../graphql/queries';
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

interface ClassBuilderProps {

}

const ClassBuilder = (props: ClassBuilderProps) => {
  const { } = props;
  const history = useHistory();
  const [classData, setClassData] = useState({
    id: '',
    name: '',
    institute: {
      id: '',
      name: '',
      value: ''
    }
  })
  const [newMember, setNewMember] = useState({
    name: '',
    id: '',
    value: '',
    avatar: ''
  });
  const [studentList, setStudentList] = useState(null);
  const [institutionList, setInstitutionList] = useState(null);
  const [selectedStudents, setSelectedStudent] = useState([]);

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Class Creation', url: '/dashboard/class-creation', last: true }
  ];

  const onChange = (e: any) => {
    setClassData({
      ...classData,
      name: e.target.value
    })
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
    setSelectedStudent([
      ...selectedStudents,
      {
        name: newMember.name,
        id: newMember.id,
        avatar: newMember.avatar
      }
    ]
    )
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
      personsList.then(res => setStudentList(res))
    } catch{
      console.log('Error while fetching staff details')
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
    } catch{
      console.log('Error while fetching staff details')
    }
  }

  const saveClassDetails = async () => {
    try {
      const input = {
        id: classData.id,
        name: classData.name,
        institutionID: classData.institute.id,
      }

      const newClass: any = await API.graphql(graphqlOperation(customMutations.createClass, { input: input }));
      const studentsList: any = Promise.all(selectedStudents.map(async (item: any) => await saveStudentsList(item.id)));
    } catch{
      console.log('Error while creating class details')
    }
  }

  const saveStudentsList = async (id: string) => {
    try {
      const studets = {
        studentAuthID: studentList.find((item: any) => item.id === id).authId,
        classID: classData.id,
        studentID: id,
        studentEmail: studentList.find((item: any) => item.id === id).email
      };
      const students: any = await API.graphql(graphqlOperation(customMutations.createClassStudent, { input: studets }));

    } catch{

    }
  }

  useEffect(() => {
    getStudentsList()
    getInstitutionList()
    setClassData({
      ...classData,
      id: uuidv4()
    })
  }, [])

  const { name, institute } = classData;

  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Create New Class" subtitle="Add new class to the list" />
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
              <FormInput value={name} id='className' onChange={onChange} name='className' label="Class Name" />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Institute
              </label>
              <Selector selectedItem={institute.value} placeholder="Select Institute" list={institutionList} onChange={setInstitute} />
            </div>
          </div>
        </div>
        <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">Students</h3>
        <div className="flex items-center w-6/10 m-auto px-2">
          <SelectorWithAvatar selectedItem={newMember} list={studentList} placeholder="Add new student" onChange={onStudentSelect} />
          <Buttons btnClass="ml-4 py-1" label="Add" onClick={addMemberToList} />
        </div>
        <div className="my-4 w-6/10 m-auto px-2 max-h-88 overflow-y-scroll">
          {selectedStudents.length > 0 && (
            <Fragment>
              {selectedStudents.map(item =>
                <div className="flex justify-between w-full items-center px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                  <div className="flex w-3/10 items-center">
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
                  <span className="w-6 h-6 flex items-center" onClick={() => console.log('')}>
                    <IconContext.Provider value={{ size: '1rem', color: '#000000' }}>
                      <IoClose />
                    </IconContext.Provider>
                  </span>
                </div>)}
            </Fragment>
          )}
        </div>
        <div className="flex my-8 justify-center">
          <Buttons btnClass="my-8 py-3 px-12 text-sm" label="Save" onClick={saveClassDetails} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default ClassBuilder
