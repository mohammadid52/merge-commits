import React, { useEffect, useState, Fragment } from 'react';
import { FaPlus } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib/esm/iconContext';
import API, { graphqlOperation } from '@aws-amplify/api';

import * as customQueries from '../../../../../customGraphql/customQueries';
import PageWrapper from '../../../../Atoms/PageWrapper';
import Selector from '../../../../Atoms/Form/Selector';
import { getInitialsFromString, initials, stringToHslColor } from '../../../../../utilities/strings';
import { IoClose } from 'react-icons/io5';
import Buttons from '../../../../Atoms/Buttons';
import SelectorWithAvatar from '../../../../Atoms/Form/SelectorWithAvatar';
import * as queries from '../../../../../graphql/queries'
import * as mutations from '../../../../../graphql/mutations'
interface StaffBuilderProps {
  instituteId: String
}

const StaffBuilder = (props: StaffBuilderProps) => {
  const [staffList, setStaffList] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    id: '',
    value: '',
    avatar: ''
  });
  const [activeStaffList, setActiveStaffList] = useState([]);

  const onChange = (str: string, name: string, id: string, avatar: string) => {
    setNewMember({
      id: id,
      name: name,
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
        id: i,
        name: `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`,
        value: `${item.firstName ? item.firstName : ''} ${item.lastName ? item.lastName : ''}`,
        authId: item.authId,
        email: item.email
      }));
      console.log('personsList', personsList)
      setStaffList(personsList);
    } catch{
      console.log('Error while fetching staff details')
    }
  }

  const getStaff = async () => {
    try {
      const staff: any = await API.graphql(graphqlOperation(queries.listStaffs, {
        filter: { institutionID: { eq: props.instituteId } },
      }));
      let staffMembers: any = staff.data.listStaffs.items;
      staffMembers = staffMembers.map((member: any) => {
        member.name = `${member.staffMember.firstName || ''} ${member.staffMember.lastName || ''}`
        member.image = member.staffMember.image
        member.role = member.staffMember.role
        return member
      })
      console.log('staff.data.listStaffs.items', staffMembers)
      setActiveStaffList(staffMembers)
    } catch(err) {
      console.log('Error: Get Staff, StaffBuilder: Could not get list of Institution staff members', err)
    }
  }

  const addStaffMember = async () => {
    try {
      const member = staffList.filter((item: any) => item.id === newMember.id)[0]
      const input = {
        institutionID: props.instituteId,
        staffAuthID: member.authId,
        staffEmail: member.email,
        status: 'Active',
        statusChangeDate: (new Date()).toISOString().split('T')[0]
      }
      console.log('input', input)
      const staff: any = await API.graphql(graphqlOperation(mutations.createStaff, { input: input }));
      const addedMember = staff.data.createStaff;
      addedMember.name = `${addedMember.staffMember.firstName || ''} ${addedMember.staffMember.lastName || ''}`
      addedMember.image = addedMember.staffMember.image;
      addedMember.role = addedMember.staffMember.roleaddedMember;
      setActiveStaffList([...activeStaffList, addedMember])
    } catch(err) {
      console.log('Error: Add Staff, StaffBuilder: Could not add new staff member in institution', err)
    }
  }

  useEffect(() => {
    getPersonsList()
    getStaff()
  }, [])

  return (
    <div className="p-8 flex m-auto justify-center">
      <div className="">
        <PageWrapper>
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center pb-8 ">STAFF MEMBERS</h3>
          <div className="flex items-center w-6/10 m-auto px-2">
            <SelectorWithAvatar selectedItem={newMember} list={staffList} placeholder="Add new staff member" onChange={onChange} />
            <Buttons btnClass="ml-4 py-1" label="Add" onClick={addStaffMember} />
          </div>
          <div className="my-4 w-8/10 m-auto max-h-88 overflow-y-scroll">
            {activeStaffList.length > 0 && (
              <Fragment>
                {activeStaffList.map(item =>
                  <div className="flex justify-between w-full  px-8 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div className="flex w-3/10 items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center">
                        {item.staffMember.image ?
                          (<img
                            // src={imageUrl}
                            className="h-8 w-8 rounded-full" />) :
                          <div className="h-8 w-8 rounded-full flex justify-center items-center text-white text-sm text-bold" style={{ background: `${stringToHslColor(getInitialsFromString(item.name)[0] + ' ' + getInitialsFromString(item.name)[1])}`, textShadow: '0.1rem 0.1rem 2px #423939b3' }} >
                            {item.name ? initials(getInitialsFromString(item.name)[0], getInitialsFromString(item.name)[1]) : initials('N', 'A')}
                          </div>}
                      </div>
                      <div className="ml-4">{item.name}</div>
                    </div>
                    <div className="flex items-center">{item.role ? getStaffRole(item.role) : ''}</div>
                    <span className="w-6 h-6 flex items-center" onClick={() => console.log('')}>
                      <IconContext.Provider value={{ size: '1rem', color: '#000000' }}>
                        <IoClose />
                      </IconContext.Provider>
                    </span>
                  </div>)}
              </Fragment>
            )}
          </div>
        </PageWrapper>
      </div>
    </div>
  )
}

export default StaffBuilder
