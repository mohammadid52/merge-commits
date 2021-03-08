import React, { useEffect, useState, Fragment, useContext } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';

import SelectorWithAvatar from '../../../../Atoms/Form/SelectorWithAvatar';
import Selector from '../../../../Atoms/Form/Selector';
import Buttons from '../../../../Atoms/Buttons';
import PageWrapper from '../../../../Atoms/PageWrapper';

import { getInitialsFromString, initials, stringToHslColor, createFilterToFetchSpecificItemsOnly } from '../../../../../utilities/strings';
import { getImageFromS3 } from '../../../../../utilities/services';
import { statusList } from '../../../../../utilities/staticData';
import { getAsset } from '../../../../../assets';

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
  const { userLanguage, clientKey, theme } = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');
  const { staffBuilderDict } = useDictionary(clientKey);
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
      case 'FLW':
        return 'Fellow';
      case 'BLD':
        return 'Builder';
      case 'ADM':
        return 'Admin';
    }
  }

  const getPersonsList = async () => {
    try {
      const list: any = await API.graphql(graphqlOperation(customQueries.listPersons, {
        // filter: { or: [{ role: { eq: "TR" } }, { role: { eq: "FLW" } }, { role: { eq: "CRD" } }] },
        filter: { role: { ne: "ST" } },
      }));
      const sortedList = list.data.listPersons.items.sort((a: any, b: any) => (a.firstName?.toLowerCase() > b.firstName?.toLowerCase()) ? 1 : -1);
      const personsList = sortedList.map((item: any, i: any) => ({
        id: item.id,
        name: `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`,
        value: `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`,
        authId: item.authId,
        email: item.email,
        avatar: item.image ? getImageFromS3(item.image) : '',
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

      // ********
      // Hiding staff details for other institutions they will be available on dropdown only.
      // items.map((item: any) => institutions.push(item.providerID))
      // ********

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
          member.image = member.staffMember.image ? getImageFromS3(member?.staffMember?.image) : null
          member.role = member.staffMember.role
          member.email = member.staffMember.email
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
        addedMember.image = addedMember.staffMember.image ? getImageFromS3(addedMember?.staffMember?.image) : null;
        addedMember.role = addedMember.staffMember.role;
        addedMember.email = addedMember.staffMember.email;
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
    <div className="py-8 flex m-auto justify-center">
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
                    <div className="flex justify-between w-full px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>No.</span>
                      </div>
                      <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>Name</span>
                      </div>
                      <div className="w-2/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>Role</span>
                      </div>
                      <div className="w-3/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>Status</span>
                      </div>
                      <div className="w-1/10 px-8 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        <span>Action</span>
                      </div>
                    </div>

                    <div className="w-full m-auto max-h-88 overflow-y-auto">
                      {activeStaffList.map((item, index) =>
                        <div key={index} className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">

                          <div className="flex w-1/10 items-center px-8 py-3 text-left text-s leading-4">{index + 1}.</div>

                          <div className="flex w-3/10 px-8 py-3 items-center text-left text-s leading-4 font-medium whitespace-normal">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center">
                              {!item.image ? (
                                <div className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold" style={{ background: `${stringToHslColor(getInitialsFromString(item.name)[0] + ' ' + getInitialsFromString(item.name)[1])}`, textShadow: '0.1rem 0.1rem 2px #423939b3' }} >
                                  {item.name ? initials(getInitialsFromString(item.name)[0], getInitialsFromString(item.name)[1]) : initials('N', 'A')}
                                </div>
                              ) : (
                                  <div className="h-8 w-8 rounded-full flex justify-center items-center" >
                                    <img src={item.image} className="rounded-full" />
                                  </div>
                                )}
                            </div>
                            <div className="ml-2">
                              <div className="hover:text-gray-600 cursor-pointer text-sm leading-5 font-medium text-gray-900">
                                {item.name}
                              </div>
                              <div className="text-sm leading-5 text-gray-500">
                                {item.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex w-2/10 px-8 py-3 text-left text-s leading-4 items-center">{item.role ? getStaffRole(item.role) : ''}</div>
                          {
                            statusEdit === item.id ? (
                              <div className="flex w-3/10 px-8 py-3 text-left text-s leading-4 items-center">
                                <Selector selectedItem={item.status} placeholder="Select Status" list={statusList} onChange={(val, name, id) => onStaffStatusChange(val, item.id, item.status)} />
                              </div>) :
                              <div className="flex w-3/10 px-8 py-3 text-left text-s leading-4 items-center">
                                {item.status || 'Active'}
                              </div>
                          }
                          <div className="flex w-1/10 px-8 py-3 text-left text-s leading-4 items-center">
                            {statusEdit === item.id ?
                              <span className={`w-6 h-6 flex items-center cursor-pointer ${theme.textColor[themeColor]}`} onClick={() => setStatusEdit('')}>{updateStatus ? 'updating...' : 'Cancel'}</span>
                              :
                              <span className={`w-6 h-6 flex items-center cursor-pointer ${theme.textColor[themeColor]}`} onClick={() => setStatusEdit(item.id)}>
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
