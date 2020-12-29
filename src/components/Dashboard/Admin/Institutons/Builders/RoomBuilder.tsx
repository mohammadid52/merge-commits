import React, { Fragment, useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { IoArrowUndoCircleOutline, IoClose } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';
import { v4 as uuidv4 } from 'uuid';

import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutation from '../../../../../customGraphql/customMutations';
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
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import { getImageFromS3 } from '../../../../../utilities/services';

interface RoomBuilderProps {

}

const RoomBuilder = (props: RoomBuilderProps) => {
  const { } = props;
  const history = useHistory();
  const { theme } = useContext(GlobalContext);
  const [roomData, setRoomData] = useState({
    id: '',
    name: '',
    institute: { id: '', name: '', value: '' },
    teacher: { id: '', name: '', value: '' },
    classRoom: { id: '', name: '', value: '' },
    curricular: { id: '', name: '', value: '' },
    maxPersons: ''
  })
  const [institutionList, setInstitutionList] = useState(null);
  const [teachersList, setTeachersList] = useState(null);
  const [classList, setClassList] = useState(null);
  const [curricularList, setCurricularList] = useState(null);

  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Room Creation', url: '/dashboard/room-creation', last: true }
  ];

  const selectTeacher = (val: string, name: string, id: string) => {
    setRoomData({
      ...roomData,
      teacher: {
        id: id,
        name: name,
        value: val,
      }
    })
  }

  const editInputField = (e: any) => {
    setRoomData({
      ...roomData,
      [e.target.name]: e.target.value
    })
  }

  const selectInstitute = (val: string, name: string, id: string) => {
    setRoomData({
      ...roomData,
      institute: {
        id: id,
        name: name,
        value: val
      }
    })
  }

  const selectClass = (val: string, name: string, id: string) => {
    setRoomData({
      ...roomData,
      classRoom: {
        id: id,
        name: name,
        value: val
      }
    })
  }
  const selectCurriculum = (val: string, name: string, id: string) => {
    setRoomData({
      ...roomData,
      curricular: {
        id: id,
        name: name,
        value: val
      }
    })
  }

  const getImageURL = async (uniqKey: string) => {
    console.log("Asked for image")
    const imageUrl: any = await getImageFromS3(uniqKey);
    if (imageUrl) {
      console.log(imageUrl)
      return imageUrl
    } else {
      return ''
    }
  }

  const getTeachersList = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(customQueries.listPersons, {
        filter: {
          role: { eq: 'TR' }
        },
      }));
      const sortedList = list.data.listPersons.items.sort((a: any, b: any) => (a.firstName?.toLowerCase() > b.firstName?.toLowerCase()) ? 1 : -1);
      const personsList = Promise.all(sortedList.map(async (item: any) => ({
        id: item.id,
        name: `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`,
        value: `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`,
        avatar: item.image ? await getImageURL(item.image) : '',
        email: item.email ? item.email : '',
        authId: item.authId ? item.authId : ''
      })));
      setTeachersList(personsList);
    } catch{
      console.log('Error while fetching teachers list')
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
      console.log('Error while fetching institution list')
    }
  }
  const getClassLists = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listClasss));
      const sortedList = list.data.listClasss?.items.sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1);
      const classList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.name ? item.name : ''}`,
        value: `${item.name ? item.name : ''}`
      }));
      setClassList(classList);
    } catch{
      console.log('Error while fetching class list')
    }
  }

  const getCurricularList = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listCurriculums));
      const sortedList = list.data.listCurriculums?.items.sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1);
      const curricularList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.name ? item.name : ''}`,
        value: `${item.name ? item.name : ''}`
      }));
      setCurricularList(curricularList);
    } catch{
      console.log('Error while fetching curricular details')
    }
  }

  const createNewRoom = async () => {
    try {
      const input = {
        id: roomData.id,
        institutionID: roomData.institute.id,
        classID: roomData.classRoom.id,
        teacherAuthID: teachersList.find((item: any) => item.id === roomData.teacher.id).authId,
        teacherEmail: teachersList.find((item: any) => item.id === roomData.teacher.id).email,
        name: roomData.name,
        maxPersons: roomData.maxPersons,
      }
      const newRoom: any = await API.graphql(graphqlOperation(customMutation.createRoom, { input: input }));

    } catch{
      console.log('Error while creating new room')
    }
  }

  useEffect(() => {
    getTeachersList()
    getInstitutionList()
    getClassLists()
    getCurricularList()
    setRoomData({
      ...roomData,
      id: uuidv4()
    })
  }, [])

  const { name, curricular, classRoom, maxPersons, institute, teacher } = roomData;

  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Create New Room" subtitle="Add new room to the list" />
        <div className="flex justify-end py-4 mb-4 w-5/10">
          <Buttons btnClass="mr-4" onClick={history.goBack} Icon={IoArrowUndoCircleOutline} />
        </div>
      </div>

      {/* Body section */}
      <PageWrapper>
        <div className="w-6/10 m-auto">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">ROOM INFORMATION</h3>
          <div className="">
            <div className="px-3 py-4">
              <FormInput value={name} id='name' onChange={editInputField} name='name' label="Room Name" placeHolder="Add room name" />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Institute
              </label>
              <Selector selectedItem={institute.value} placeholder="Select Institute" list={institutionList} onChange={selectInstitute} />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Teacher
              </label>
              <SelectorWithAvatar selectedItem={teacher} list={teachersList} placeholder="Select teacher" onChange={selectTeacher} />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Class Name
              </label>
              <Selector selectedItem={classRoom.value} placeholder="Select Class" list={classList} onChange={selectClass} />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Curriculum
              </label>
              <Selector selectedItem={curricular.value} placeholder="Select Curriculum" list={curricularList} onChange={selectCurriculum} />
            </div>
            <div className="px-3 py-4">
              <label className="block text-m font-medium leading-5 text-gray-700 mb-1">
                Max.Students
              </label>
              <input
                type="number"
                id='maxPersons'
                name='maxPersons'
                onChange={editInputField}
                className={`mt-1 block w-full sm:text-sm sm:leading-5 border border-gray-400 py-2 px-3 rounded-md shadow-sm ${theme.outlineNone}`}
                value={maxPersons}
                placeholder='Max students'
                min="1" max="30" />
            </div>
          </div>
        </div>
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-12 text-sm" label="Save" onClick={createNewRoom} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default RoomBuilder
