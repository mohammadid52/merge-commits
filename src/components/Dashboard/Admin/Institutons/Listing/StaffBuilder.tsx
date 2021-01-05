import React, { useEffect, useState, Fragment, useContext } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';

import { IoClose } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib/esm/iconContext';

import SelectorWithAvatar from '../../../../Atoms/Form/SelectorWithAvatar';
import Selector from '../../../../Atoms/Form/Selector';
import Buttons from '../../../../Atoms/Buttons';
import PageWrapper from '../../../../Atoms/PageWrapper';
import InstitutionPopUp from '../InstitutionPopUp';

import { getInitialsFromString, initials, stringToHslColor, createFilterToFetchSpecificItemsOnly } from '../../../../../utilities/strings';

import { GlobalContext } from '../../../../../contexts/GlobalContext';
import useDictionary from '../../../../../customHooks/dictionary';

import * as customQueries from '../../../../../customGraphql/customQueries';
import * as customMutations from '../../../../../customGraphql/customMutations';
import * as queries from '../../../../../graphql/queries';
import * as mutations from '../../../../../graphql/mutations';
interface StaffBuilderProps {
  instituteId: String
  serviceProviders: { items: { id: string, providerID: string }[] }
}

const StaffBuilder = (props: StaffBuilderProps) => {
  const { staffBuilderDict } = useDictionary();
  const { userLanguage } = useContext(GlobalContext);
  const dictionary = staffBuilderDict[userLanguage]
  const [availableUsers, setAvailableUsers] = useState([]);
  const [allAvailableUsers, setAllAvailableUsers] = useState([])
  const [newMember, setNewMember] = useState({
    name: '',
    id: '',
    value: '',
    avatar: ''
  });
  const [activeStaffList, setActiveStaffList] = useState([]);
  const [dataLoading, setDataLoading] = useState(true)
  const [showModal, setShowModal] = useState<{ show: boolean; item: any; }>({ show: false, item: {} })
  const [statusEdit, setStatusEdit] = useState('');
  const [updateStatus, setUpdateStatus] = useState(false)
  const statusList = [
    { id: 1, name: 'Active', value: 'Active' },
    { id: 2, name: 'Inactive', value: 'Inactive' },
    { id: 3, name: 'Dropped', value: 'Dropped' }
  ]
  const onChange = (str: string, name: string, id: string, avatar: string) => {
    setNewMember({
      name: name,
      id: id,
      value: str,
      avatar: avatar
    })
  }

  const getStaffRole = (role: string) => {
    switch (role) {
      case 'CRD':
        return 'Coordinator';
      case 'TR':
        return 'Teacher';
    }
  }

  const getPersonsList = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(customQueries.listPersons, {
        filter: { role: { eq: ('TR' || 'CRD') } },
      }));
      const sortedList = list.data.listPersons.items.sort((a: any, b: any) => (a.firstName?.toLowerCase() > b.firstName?.toLowerCase()) ? 1 : -1);
      const personsList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`,
        value: `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`,
        authId: item.authId,
        email: item.email
      }));
      return personsList;
    } catch {
      console.log('Error while fetching staff details')
    }
  }

  const getStaff = async () => {
    try {
      // get service providers of the institute and create a list and fetch the staff
      const { serviceProviders: { items }, instituteId } = props;
      const institutions = [instituteId]
      items.map((item: any) => institutions.push(item.providerID))
      const staff: any = await API.graphql(graphqlOperation(queries.listStaffs, {
        filter: { ...createFilterToFetchSpecificItemsOnly(institutions, 'institutionID') },
      }));
      // We are removing duplicate staff memebers across institution and service providers.
      // confirm with Mike. If we have to show multiple entries with institute name 
      // remove this staffUserIds logic and add institute name in the oject
      const staffUserIds: Array<string> = []
      let staffMembers: any = staff.data.listStaffs.items;
      staffMembers = staffMembers.filter((member: any) => {
        if (member.staffMember && staffUserIds.indexOf(member.staffMember.id) < 0) {
          staffUserIds.push(member.staffMember.id)
          member.userId = member.staffMember.id;
          member.name = `${member.staffMember.firstName || ''} ${member.staffMember.lastName || ''}`
          member.image = member.staffMember.image
          member.role = member.staffMember.role
          return member
        }
      })
      return staffMembers
    } catch (err) {
      console.log('Error: Get Staff, StaffBuilder: Could not get list of Institution staff members', err)
    }
  }

  const addStaffMember = async () => {
    try {
      if (newMember && newMember.id) {
        // get the selected user from the list
        const member = availableUsers.filter((item: any) => item.id === newMember.id)[0]
        // add user mutation
        const input = {
          institutionID: props.instituteId,
          staffAuthID: member.authId,
          staffEmail: member.email,
          status: 'Active',
          statusChangeDate: (new Date()).toISOString().split('T')[0]
        }
        const staff: any = await API.graphql(graphqlOperation(mutations.createStaff, { input: input }));
        // use the mutation result to add the selected user to the staff list
        const addedMember = staff.data.createStaff;
        addedMember.userId = addedMember.staffMember.id;
        addedMember.name = `${addedMember.staffMember.firstName || ''} ${addedMember.staffMember.lastName || ''}`
        addedMember.image = addedMember.staffMember.image;
        addedMember.role = addedMember.staffMember.role;
        setActiveStaffList([...activeStaffList, addedMember]);
        // remove the selected user
        setNewMember({ name: '', id: '', value: '', avatar: '' });
        // remove the selected user from the available users list
        let updatedAvailableUsers = availableUsers.filter((item: any) => item.id !== member.id)
        setAvailableUsers(updatedAvailableUsers)
      } else {
        // TODO: Add the validation msg or error msg on UI for the user. 
        // or disable add button if newMember is not selected 
        console.log('select a user to add.')
      }
    } catch (err) {
      console.log('Error: Add Staff, StaffBuilder: Could not add new staff member in institution', err)
    }
  }

  const fetchStaffData = async () => {
    const staffMembers = await getStaff()
    const staffMembersIds = staffMembers.map((item: any) => item.userId)
    let users = await getPersonsList()
    let availableUsersList = users.filter((item: any) => staffMembersIds.indexOf(item.id) < 0)
    setActiveStaffList(staffMembers)
    setAvailableUsers(availableUsersList)
    // saving the initial all users list for future use. see removeStaff member function for use.
    setAllAvailableUsers(users)
    setDataLoading(false)
  }

  useEffect(() => {
    fetchStaffData()
  }, [])

  const onStaffStatusChange = async (status: string, staffId: string, currentStatus: string) => {
    if (currentStatus !== status) {
      setUpdateStatus(true)
      await API.graphql(graphqlOperation(customMutations.updateStaff, { input: { id: staffId, status } }));
      const updatedStaff = activeStaffList.map(staff => {
        if (staff.id === staffId) {
          staff.status = status
        }
        return staff
      })
      setActiveStaffList(updatedStaff);
      setUpdateStatus(false)
    }
    setStatusEdit('');
  }
  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">{dictionary['TITLE']}</h3>
          {
            !dataLoading ?
              <>
                <div className="flex items-center w-6/10 m-auto px-2 mb-8">
                  <SelectorWithAvatar selectedItem={newMember} list={availableUsers} placeholder={dictionary['ADD_PLACEHOLDER']} onChange={onChange} />
                  <Buttons btnClass="ml-4 py-1" label={dictionary['ADD_BUTTON']} onClick={addStaffMember} />
                </div>

                {activeStaffList.length > 0 ? (
                  <Fragment>
                    <div className="my-4 w-8/10 m-auto max-h-88 overflow-y-scroll">
                      <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                        <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>No.</span>
                        </div>
                        <div className="w-6/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Name</span>
                        </div>
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Role</span>
                        </div>
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Status</span>
                        </div>
                        <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          <span>Action</span>
                        </div>
                      </div>

                      {activeStaffList.map((item, index) =>
                        <div key={index} className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">

                          <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>

                          <div className="flex w-6/10 px-8 py-3 items-center text-left text-s leading-4 font-medium ">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center">
                              <div className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold" style={{ background: `${stringToHslColor(getInitialsFromString(item.name)[0] + ' ' + getInitialsFromString(item.name)[1])}`, textShadow: '0.1rem 0.1rem 2px #423939b3' }} >
                                {item.name ? initials(getInitialsFromString(item.name)[0], getInitialsFromString(item.name)[1]) : initials('N', 'A')}
                              </div>
                            </div>
                            <div className="ml-4">{item.name}</div>
                          </div>

                          <div className="flex w-3/10 px-8 py-3 text-left text-s leading-4 items-center">{item.role ? getStaffRole(item.role) : ''}</div>
                          {
                            statusEdit === item.id ? (
                              <div className="w-3/10 mr-6">
                                <Selector selectedItem={item.status} placeholder="Select Status" list={statusList} onChange={(val, name, id) => onStaffStatusChange(val, item.id, item.status)} />
                              </div>) :
                              <div className="w-3/10">
                                {item.status || 'Active'}
                              </div>
                          }
                          <div className="w-1/10">
                            {statusEdit === item.id ?
                              <span className="w-6 h-6 flex items-center cursor-pointer text-indigo-600">{updateStatus ? 'updating...' : ''}</span>
                              :
                              <span className="w-6 h-6 flex items-center cursor-pointer text-indigo-600" onClick={() => setStatusEdit(item.id)}>
                                Edit
                              </span>
                            }
                          </div>
                        </div>)
                      }

                    </div>
                  </Fragment>
                ) : (
                    <div className="text-center p-16">
                      <p> This institute does not have any staff member. Please add new member.</p>
                    </div>
                  )}
              </> : (
                <div className="text-center p-16">
                  <p>Loading...</p>
                </div>
              )
          }
        </PageWrapper>
      </div>
    </div>
  )
}

export default StaffBuilder
