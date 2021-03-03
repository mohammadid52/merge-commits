import React, { useState, useEffect, useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import API, { graphqlOperation } from '@aws-amplify/api';

import * as customQueries from '../../../../../customGraphql/customQueries';
import * as queries from '../../../../../graphql/queries';
import * as mutation from '../../../../../graphql/mutations';
import SectionTitle from '../../../../Atoms/SectionTitle';
import PageWrapper from '../../../../Atoms/PageWrapper'
import BreadCrums from '../../../../Atoms/BreadCrums';
import Buttons from '../../../../Atoms/Buttons';
import FormInput from '../../../../Atoms/Form/FormInput';
import Selector from '../../../../Atoms/Form/Selector';
import { getFilterORArray } from '../../../../../utilities/strings';
import SelectorWithAvatar from '../../../../Atoms/Form/SelectorWithAvatar';
import { GlobalContext } from '../../../../../contexts/GlobalContext';
import { getImageFromS3 } from '../../../../../utilities/services';

interface EditRoomProps {

}

const EditRoom = (props: EditRoomProps) => {
  const { } = props;
  const history = useHistory();
  const location = useLocation();
  const initialData = {
    id: '',
    name: '',
    institute: { id: '', name: '', value: '' },
    teacher: { id: '', name: '', value: '' },
    classRoom: { id: '', name: '', value: '' },
    curricular: { id: '', name: '', value: '' },
    maxPersons: ''
  }
  const { theme } = useContext(GlobalContext);
  const [roomData, setRoomData] = useState(initialData)
  const [institutionList, setInstitutionList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [curricularList, setCurricularList] = useState([]);
  const [prevName, setPrevName] = useState('');
  const [selectedCurrID, setSelectedCurrID] = useState('');
  const [messages, setMessages] = useState({
    show: false,
    message: '',
    isError: false
  })
  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const params = useQuery();
  const breadCrumsList = [
    { title: 'Home', url: '/dashboard', last: false },
    { title: 'Edit Classroom', url: `/dashboard/room-edit?id=${params.get('id')}`, last: true }
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
    });
    removeErrorMsg()
  }

  const selectInstitute = async (val: string, name: string, id: string) => {
    if (roomData.institute.id !== id) {
      setRoomData({
        ...roomData,
        institute: {
          id: id,
          name: name,
          value: val
        },
        teacher: { id: '', name: '', value: '' },
        classRoom: { id: '', name: '', value: '' },
        curricular: { id: '', name: '', value: '' },
      });
      removeErrorMsg();
    }
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
    removeErrorMsg();
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
    removeErrorMsg();
  }

  const removeErrorMsg = () => {
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
      if (InstituteList.length === 0) {
        setMessages({
          show: true,
          message: 'Please create an institute before creating Classroom.',
          isError: true
        })
      }
    } catch{
      setMessages({
        show: true,
        message: 'Unable to fetch institution list. Please try again later.',
        isError: true
      })
    }
  }

  const getInstituteInfo = async (instId: string) => {
    try {
      const list: any = await API.graphql(graphqlOperation(customQueries.getInstitution, {
        id: instId
      }));
      const serviceProviders = list.data.getInstitution?.serviceProviders?.items;
      return serviceProviders;
    } catch{
      setMessages({
        show: true,
        message: 'Unable to fetch institution data. Please try again later.',
        isError: true
      })
    }
  }

  const getTeachersList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listStaffs, {
        filter: { or: getFilterORArray(allInstiId, 'institutionID') },
      }));
      const listStaffs = list.data.listStaffs.items;
      if (listStaffs?.length === 0) {
        setMessages({
          show: true,
          message: 'Please add staff member first for the selected institute or select another institute.',
          isError: true
        })
      } else {
        const sortedList = listStaffs.sort((a: any, b: any) => (a.staffMember?.firstName?.toLowerCase() > b.staffMember?.firstName?.toLowerCase()) ? 1 : -1);
        const staffList = sortedList.map((item: any) => ({
          id: item.staffMember?.id,
          name: `${item.staffMember?.firstName || ''} ${item.staffMember?.lastName || ''}`,
          value: `${item.staffMember?.firstName || ''} ${item.staffMember?.lastName || ''}`,
          email: item.staffMember?.email ? item.staffMember?.email : '',
          authId: item.staffMember?.authId ? item.staffMember?.authId : ''
        }));

        // Removed duplicates from staff list.
        const uniqIDs: string[] = []
        const filteredArray = staffList.filter((member: { id: string }) => {
          const duplicate = uniqIDs.includes(member.id);
          uniqIDs.push(member.id)
          return !duplicate
        })
        setTeachersList(filteredArray);
      }

    } catch{
      setMessages({
        show: true,
        message: 'Unable to fetch teachers list. Please try again later.',
        isError: true
      })
    }

  }

  const getClassLists = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listClasss, {
        filter: { or: getFilterORArray(allInstiId, 'institutionID') },
      }));
      const listClass = list.data.listClasss?.items
      if (listClass.length === 0) {
        setMessages({
          show: true,
          message: 'Please add class first for the selected institute or select another institute.',
          isError: true
        })
      } else {
        const sortedList = listClass.sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1);
        const classList = sortedList.map((item: any, i: any) => ({
          id: item.id,
          name: `${item.name ? item.name : ''}`,
          value: `${item.name ? item.name : ''}`
        }));
        setClassList(classList);
      }
    } catch {
      setMessages({
        show: true,
        message: 'Unable to fetch class list. Please try again later.',
        isError: true
      })
    }
  }

  const getCurricularList = async (allInstiId: string[]) => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listCurriculums, {
        filter: { or: getFilterORArray(allInstiId, 'institutionID') }
      }));
      const sortedList = list.data.listCurriculums?.items.sort((a: any, b: any) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : -1);
      const curricularList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.name ? item.name : ''}`,
        value: `${item.name ? item.name : ''}`
      }));
      setCurricularList(curricularList);
    } catch{
      setMessages({
        show: true,
        message: 'Unable to fetch curricular list. Please try again later.',
        isError: true
      })
    }
  }

  const checkUniqRoomName = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(queries.listRooms, {
        filter: {
          institutionID: { eq: roomData.institute.id },
          name: { eq: roomData.name }
        }
      }))
      return list.data.listRooms.items.length === 0 ? true : false;

    } catch {
      setMessages({
        show: true,
        message: 'Error while processing please Try again later.',
        isError: true
      })
    }
  }

  const validateForm = async () => {
    if (roomData.name.trim() === '') {
      setMessages({
        show: true,
        message: 'Classroom name is required please enter name.',
        isError: true
      })
      return false;
    } else if (roomData.institute.id === '') {
      setMessages({
        show: true,
        message: 'Please select an institute to add Classroom.',
        isError: true
      })
      return false;
    } else if (roomData.teacher.id === '') {
      setMessages({
        show: true,
        message: 'Please select a teacher for the Classroom.',
        isError: true
      })
      return false;
    } else if (roomData.classRoom.id === '') {
      setMessages({
        show: true,
        message: 'Please select a class for the Classroom.',
        isError: true
      })
      return false;
    } else if (roomData.maxPersons == '') {
      setMessages({
        show: true,
        message: 'Please set Max students limit for the Classroom.',
        isError: true
      })
      return false;
    } else if (roomData.maxPersons > '30') {
      setMessages({
        show: true,
        message: 'One Classroom can allow max. 30 students.',
        isError: true
      })
      return false;
    } else if (roomData.name.trim() !== '' && prevName !== roomData.name) {
      const isUniq = await checkUniqRoomName()
      if (!isUniq) {
        setMessages({
          show: true,
          message: 'This Classroom name is already exist, please add another name.',
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


  const saveRoomCurricular = async (id: string, roomId: string, currId: string) => {
    if (roomId && id) {
      try {
        const curricularInput = {
          id: id,
          roomID: roomId,
          curriculumID: currId,
        }

        const addCurricular: any = await API.graphql(graphqlOperation(mutation.updateRoomCurriculum, { input: curricularInput }))
        setMessages({
          show: true,
          message: 'Classroom details has been updated.',
          isError: false
        })
      } catch {
        setMessages({
          show: true,
          message: 'Error while updating Classroom curricular. Please try that later.',
          isError: true
        })
      }
    } else {
      setMessages({
        show: true,
        message: 'Error while processing. Please try again later.',
        isError: true
      })
    }

  }

  const saveRoomDetails = async () => {
    const isValid = await validateForm();
    if (isValid) {
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
        const newRoom: any = await API.graphql(graphqlOperation(mutation.updateRoom, { input: input }));
        const curriculaId = newRoom.data.updateRoom.curricula.items[0].id;
        saveRoomCurricular(curriculaId, roomData.id, roomData.curricular.id)
      } catch{
        setMessages({
          show: true,
          message: 'Error while updating Classroom details. Please try again later.',
          isError: true
        })
      }
    }
  }

  const filterCurricularData = (currId: string) => {
    const currentList = [...curricularList];
    const selectedCurr = currentList.find(item => item.id === currId);
    setRoomData({
      ...roomData,
      curricular: {
        id: selectedCurr?.id,
        name: selectedCurr?.name,
        value: selectedCurr?.value
      }
    })

  }

  const fetchRoomDetails = async () => {
    const currID = params.get('id');
    if (currID) {
      try {
        const result: any = await API.graphql(graphqlOperation(queries.getRoom, { id: currID }))
        const savedData = result.data.getRoom;
        const curricularId = savedData.curricula.items[0].curriculumID;
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
            name: `${savedData.teacher?.firstName || ''} ${savedData.teacher?.lastName || ''}`,
            value: `${savedData.teacher?.firstName || ''} ${savedData.teacher?.lastName || ''}`,
          },
          classRoom: {
            id: savedData.class?.id,
            name: savedData.class?.name,
            value: savedData.class?.name,
          },
          maxPersons: savedData.maxPersons
        })
        setPrevName(savedData.name)
        setSelectedCurrID(curricularId)
      } catch {
        setMessages({
          show: true,
          message: 'Error while fetching Classroom data, please try again later.',
          isError: true
        })
      }
    } else {
      history.push('/dashboard/manage-institutions')
    }
  }

  const fetchOtherList = async () => {
    const instId = roomData.institute.id;
    const items: any = await getInstituteInfo(instId);
    const serviceProviders = items.map((item: any) => item.providerID);
    const allInstiId = [...serviceProviders, instId]
    getTeachersList(allInstiId);
    getClassLists(allInstiId);
    getCurricularList(allInstiId);
  }

  useEffect(() => {
    if (roomData.institute.id) {
      fetchOtherList();
    }
  }, [roomData.institute.id])

  useEffect(() => {
    if (curricularList.length && selectedCurrID) {
      filterCurricularData(selectedCurrID)
    }
  }, [curricularList])

  useEffect(() => {
    fetchRoomDetails();
    getInstitutionList()
  }, [])

  const { name, curricular, classRoom, maxPersons, institute, teacher } = roomData;

  return (
    <div className="w-8/10 h-full mt-4 p-4">

      {/* Section Header */}
      <BreadCrums items={breadCrumsList} />
      <div className="flex justify-between">
        <SectionTitle title="Edit Classroom" subtitle="Edit Classroom information" />
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
              <FormInput value={name} id='name' onChange={editInputField} name='name' label="Classroom Name" placeHolder="Add Classroom name" isRequired />
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
                  Teacher  <span className="text-red-500"> *</span>
                </label>
                <SelectorWithAvatar selectedItem={teacher} list={teachersList} placeholder="Select teacher" onChange={selectTeacher} />
              </div>
              <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  Class Name  <span className="text-red-500"> *</span>
                </label>
                <Selector selectedItem={classRoom.value} placeholder="Select Class" list={classList} onChange={selectClass} />
              </div>
              <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  Curriculum
              </label>
                <Selector selectedItem={curricular.value} placeholder="Select Curriculum" list={curricularList} onChange={selectCurriculum} />
              </div>
              <div className="px-3 py-4">
                <label className="block text-xs font-semibold leading-5 text-gray-700 mb-1">
                  Max.Students (Add number between 1 to 30)  <span className="text-red-500"> *</span>
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
        </div>
        {messages.show ? (<div className="py-2 m-auto text-center">
          <p className={`${messages.isError ? 'text-red-600' : 'text-green-600'}`}>{messages.message && messages.message}</p>
        </div>) : null}
        <div className="flex my-8 justify-center">
          <Buttons btnClass="py-3 px-12 text-sm mr-4" label="Cancel" onClick={history.goBack} transparent />
          <Buttons btnClass="py-3 px-12 text-sm ml-4" label="Save" onClick={saveRoomDetails} />
        </div>
      </PageWrapper>
    </div>
  )
}

export default EditRoom
